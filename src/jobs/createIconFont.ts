import path from "node:path";
import { createWriteStream } from "node:fs";
import archiver from "archiver";
import { FontAssetType, generateFonts, OtherAssetType } from "fantasticon";
import sax from "sax";
import type { SAXStream as SaxStreamType } from "sax";
import fs from "fs";

import {
	FONT_ICONS_DIR,
	FONTS_DIR,
	FORCE_PROCESS_ICONS,
	ICONS_CACHE_DIR,
	ICONS_EXTRA_DIR,
} from "@/config/app";
import * as Cache from "@/util/cache";
import {
	createJSONReader,
	createJSONWriter,
	createWriter,
	mkDir,
} from "@/util/fs";
import { showInfo } from "@/util/console";
import { isNotNil, prop, propEq, toPairs } from "ramda";
import { CacheType, type ICache } from "@/types/cache";
import type { Mapping } from "@/types/common";
import { getIconContents } from "./font/getIconContents";
import { getCustomContent } from "@/components/custom/getCustomContent";
import specialIcons from "@/data/icons/special";
import { VERSION } from "@/constants";
import { getCodepoints } from "./font/getCodepoints";
import { createDatabaseIconsCache } from "./createCache";

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

	if (FORCE_PROCESS_ICONS) {
		showInfo("FORCE_PROCESS_ICONS enabled — processing all icons");
	}

	console.log("extracting svg icons...");
	await extractIcons();
};

/** Copy a previously built SVG into the cache when skipping reprocessing. */
export const restorePreviousIcon = (id: string) => {
	const src = path.join(FONT_ICONS_DIR, `${id}.svg`);
	if (!fs.existsSync(src)) {
		return false;
	}

	mkDir(ICONS_CACHE_DIR);
	fs.copyFileSync(src, path.join(ICONS_CACHE_DIR, `${id}.svg`));
	return true;
};

export const createIconFont = async () => {
	await prepareIcons();
	console.log("copying extra icons...");
	await copyExtraIcons();
	console.log("creating font assets...");
	await createAssets();
	console.log("archiving icon svgs...");
	await createIconArchive();
};

export const createIconArchive = async () => {
	if (!fs.existsSync(FONT_ICONS_DIR)) {
		console.warn(`skip icons.zip: directory missing: ${FONT_ICONS_DIR}`);
		return;
	}

	const zipPath = path.join(FONTS_DIR, "icons.zip");
	await fs.promises.rm(zipPath, { force: true });

	const output = createWriteStream(zipPath);
	const archive = archiver("zip", { zlib: { level: 9 } });

	await new Promise<void>((resolve, reject) => {
		output.on("close", resolve);
		archive.on("error", reject);
		archive.on("warning", (err) => {
			if (err.code === "ENOENT") {
				console.warn(err);
				return;
			}
			reject(err);
		});
		archive.pipe(output);
		archive.directory(FONT_ICONS_DIR, false);
		void archive.finalize();
	});
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

	// Fantasticon may omit glyphs without an SVG; merge so historical
	// codepoints stay published and never shift for clients.
	if (codepoints) {
		const readJSON = createJSONReader(FONTS_DIR);
		const writeJSON = createJSONWriter(FONTS_DIR);
		const generated = readJSON<Mapping<number>>("icons") ?? {};
		writeJSON("icons", {
			...codepoints,
			...generated,
		});
	}

	// Wipe previous font icons so deleted/renamed SVGs do not linger.
	fs.rmSync(FONT_ICONS_DIR, { recursive: true, force: true });
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

			// Historical codepoint with no SVG in this build — keep in fonts/icons.json
			// for stability, but do not require icons.info metadata.
			const hasSvg = fs.existsSync(path.join(ICONS_CACHE_DIR, `${icon}.svg`));
			if (!hasSvg) {
				return null;
			}

			console.log(`icon ${icon} not found`);

			return null;
		})
		.filter(isNotNil);

	Cache.cache(CacheType.ICONS_INFO, data);
	createDatabaseIconsCache();
};

export const getIconSetId = (id: string) => id.toLowerCase().replace(/\W/g, "");

export const extractIcons = async () => {
	const icons = Cache.getIcons();
	const glyphMap = Cache.getLastGlyphMap();
	const force = FORCE_PROCESS_ICONS || !glyphMap;

	const previousSvgInfo = force ? [] : (Cache.getSVGIconInfo() ?? []);
	const previousSvgInfoByIcon = new Map(
		previousSvgInfo.map((info) => [info.icon, info]),
	);

	const iconInfoByIcon = new Map<string, ICache.SVGIconInfo>();

	const options = {
		dir: ICONS_CACHE_DIR,
		extension: "svg",
	};
	const writeSVG = createWriter(options);

	// Track base names claimed in this run (same semantics as filesystem exists()
	// on an empty cache). Naming must not depend on restored files.
	const claimedNames = new Set<string>();
	let processedCount = 0;
	let skippedCount = 0;

	for (const icon of icons) {
		const { name, iconSetName } = icon.properties;
		const iconSetId = getIconSetId(iconSetName);
		const id = claimedNames.has(name) ? `${iconSetId}-${name}` : name;
		claimedNames.add(name);

		const isKnown = !force && glyphMap?.[id] !== undefined;
		const previousInfo = previousSvgInfoByIcon.get(id);

		// Skip expensive sharp work only when we can reuse both prior SVG + info.
		// Copy per-icon (not bulk-restore) so deleted/orphan icons are not kept.
		if (isKnown && previousInfo && restorePreviousIcon(id)) {
			iconInfoByIcon.set(id, previousInfo);
			if (id === name || !iconInfoByIcon.has(name)) {
				iconInfoByIcon.set(name, { ...previousInfo, icon: name });
			}
			skippedCount++;
			continue;
		}

		const { svg, width, height, circled } = await getIconContents(icon);
		const ratio = width / height;
		const info: ICache.SVGIconInfo = {
			icon: id,
			ratio,
			circled,
			width,
			height,
		};

		iconInfoByIcon.set(id, info);

		// Legacy: also record under the base name (first write wins on collisions).
		if (id === name || !iconInfoByIcon.has(name)) {
			iconInfoByIcon.set(name, { ...info, icon: name });
		}

		writeSVG(id, svg);
		processedCount++;
	}

	if (!force) {
		showInfo(
			`processed ${processedCount} new icons, skipped ${skippedCount} existing`,
		);
	}

	Cache.cache(CacheType.SVG_ICONS_INFO, [...iconInfoByIcon.values()]);
};
