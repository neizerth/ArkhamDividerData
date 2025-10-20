// import path from "node:path"; // unused
import { FontAssetType, generateFonts, OtherAssetType } from "fantasticon";
import sax from "sax";
import type { SAXStream as SaxStreamType } from "sax";
import fs from "fs";

import {
	FONT_ICONS_DIR,
	FONTS_DIR,
	ICONS_CACHE_DIR,
	ICONS_EXTRA_DIR,
} from "@/config/app";
import * as Cache from "@/util/cache";
import {
	createExistsChecker,
	createJSONReader,
	createWriter,
	mkDir,
} from "@/util/fs";
import { isNotNil, prop, propEq, toPairs } from "ramda";
import { CacheType, type ICache } from "@/types/cache";
import type { Mapping } from "@/types/common";
import { getIconContents } from "./font/getIconContents";
import { getCustomContent } from "@/components/custom/getCustomContent";
import specialIcons from "@/data/icons/special";
import { VERSION } from "@/constants";
import { getCodepoints } from "./font/getCodepoints";

// accommodate large inline SVG strings
(sax as unknown as { MAX_BUFFER_LENGTH: number }).MAX_BUFFER_LENGTH =
	Number.POSITIVE_INFINITY;

// Polyfill missing destroy on older sax streams to avoid pipe() errors on Node >= 16
// Some versions of sax's SAXStream don't implement destroy(), which Node's pipe expects.
// This ensures downstream piping in dependencies (e.g., icon/font generators) doesn't throw.
const maybePolyfillSaxDestroy = (saxModule: typeof import("sax")) => {
	try {
		const SAXStream = (saxModule as unknown as { SAXStream?: SaxStreamType })
			.SAXStream as unknown as { prototype?: Record<string, unknown> };
		if (
			SAXStream &&
			SAXStream.prototype &&
			!("destroy" in SAXStream.prototype)
		) {
			(
				SAXStream.prototype as unknown as {
					destroy: (error?: Error) => SaxStreamType;
				}
			).destroy = function (this: SaxStreamType, err?: Error) {
				type Emitter = {
					emit: (event: "error" | "close", ...args: unknown[]) => void;
				};
				const self = this as unknown as Partial<Emitter>;
				if (err && typeof self.emit === "function") self.emit("error", err);
				if (typeof self.emit === "function") self.emit("close");
				return this;
			} as (error?: Error) => SaxStreamType;
		}
	} catch {
		// ignore
	}
};

maybePolyfillSaxDestroy(sax);

export const prepareIcons = async () => {
	console.log("clearing icons cache...");
	await clearIconsCache();
	console.log("extracting svg icons...");
	await extractIcons();
};

export const createIconFont = async () => {
	await prepareIcons();
	console.log("copying extra icons...");
	await copyExtraIcons();
	console.log("creating font assets...");
	await createAssets();
};

export const clearIconsCache = async () => {
	fs.rmSync(ICONS_CACHE_DIR, {
		recursive: true,
		force: true,
	});
};

export const copyExtraIcons = async () => {
	fs.cpSync(ICONS_EXTRA_DIR, ICONS_CACHE_DIR, { recursive: true });

	const customDirs = getCustomContent()
		.map(prop("iconsDir"))
		.filter((dir) => isNotNil(dir) && fs.existsSync(dir));

	for (const dir of customDirs) {
		fs.cpSync(dir, ICONS_CACHE_DIR, { recursive: true });
	}
};

export const createAssets = async () => {
	mkDir(FONTS_DIR);

	const codepoints = getCodepoints();

	await generateFonts({
		name: "icons",
		inputDir: ICONS_CACHE_DIR,
		outputDir: FONTS_DIR,
		normalize: true,
		codepoints,
		fontTypes: [FontAssetType.WOFF, FontAssetType.WOFF2, FontAssetType.TTF],
		assetTypes: [OtherAssetType.JSON, OtherAssetType.HTML, OtherAssetType.CSS],
	});

	mkDir(FONT_ICONS_DIR);

	fs.cpSync(ICONS_CACHE_DIR, FONT_ICONS_DIR, {
		recursive: true,
	});

	fs.cpSync(`${FONTS_DIR}/icons.ttf`, `${FONTS_DIR}/icons.${VERSION}.ttf`);

	await cacheIconsInfo();
};

export const cacheIconsInfo = async () => {
	const readJSON = createJSONReader(FONTS_DIR);
	const info = readJSON<Mapping<number>>("icons");
	const icons = Cache.getIcons();
	const svgIconsInfo = Cache.getSVGIconInfo();

	const customIcons = getCustomContent()
		.map(prop("icons"))
		.filter(isNotNil)
		.flat()
		.concat(specialIcons);

	const findIconInfo = ({
		icon,
		id = icon,
		iconSet,
	}: {
		id?: string;
		icon: string;
		iconSet?: string;
	}) => {
		const code = info[id];

		const dbIcon = icons.find(
			({ properties }) =>
				properties.name === icon &&
				(!iconSet || iconSet === getIconSetId(properties.iconSetName)),
		);

		const svgIconInfo = svgIconsInfo.find(propEq(id, "icon"));

		if (dbIcon && svgIconInfo) {
			const { width, height, ratio = width / height, circled } = svgIconInfo;
			const iconSet = dbIcon.properties.iconSetName;

			return {
				icon: id,
				ratio,
				iconSet,
				width,
				height,
				code,
				circled,
			};
		}
	};

	const data = toPairs(info)
		.map(([icon, code]) => {
			const item = findIconInfo({
				icon,
			});

			if (item) {
				return item;
			}

			const customIcon = customIcons.find(propEq(icon, "icon"));

			if (customIcon) {
				const { width, height, circled } = customIcon;
				const ratio = width / height;

				return {
					icon,
					code,
					circled,
					width,
					height,
					ratio,
				};
			}

			const dashIndex = icon.indexOf("-");

			const dashItem = findIconInfo({
				id: icon,
				icon: icon.slice(dashIndex + 1),
				iconSet: icon.slice(0, dashIndex),
			});

			if (dashItem) {
				return dashItem;
			}

			console.log(`icon ${icon} not found`);

			return null;
		})
		.filter(isNotNil);

	Cache.cache(CacheType.ICONS_INFO, data);
};

export const getIconSetId = (id: string) => id.toLowerCase().replace(/\W/g, "");

export const extractIcons = async () => {
	// const icons = Cache.getIcons().slice(0, 20);
	const icons = Cache.getIcons();
	const iconInfo: ICache.SVGIconInfo[] = [];

	const options = {
		dir: ICONS_CACHE_DIR,
		extension: "svg",
	};
	const writeSVG = createWriter(options);

	const exists = createExistsChecker(options);

	for (const icon of icons) {
		const { name, iconSetName } = icon.properties;

		const { svg, width, height, circled } = await getIconContents(icon);

		const ratio = width / height;

		iconInfo.push({
			icon: name,
			ratio,
			circled,
			width,
			height,
		});

		if (!exists(name)) {
			writeSVG(name, svg);
			continue;
		}

		const iconSetId = getIconSetId(iconSetName);
		const uniqueName = `${iconSetId}-${name}`;

		iconInfo.push({
			icon: uniqueName,
			ratio,
			circled,
			width,
			height,
		});

		writeSVG(uniqueName, svg);
	}

	Cache.cache(CacheType.SVG_ICONS_INFO, iconInfo);
	// const
};
