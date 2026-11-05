import { DOWNLOADS_DIR } from "@/config/app";
import * as API from "@/config/api";
import { DEFAULT_ICON_SIZE } from "@/config/icons";
import type { IIcoMoon } from "@/types/icomoon";
import { showWarning } from "@/util/console";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { SVGPathData } from "svg-pathdata";

const require = createRequire(import.meta.url);
const fontkit = require("fontkit") as Fontkit;

export const ARKHAM_BUILD_ICON_SET = "Arkham Build";

const CSS_PATH = "frontend/src/styles/icons-encounters.css";
const FONT_PATH = "frontend/src/assets/fonts/encounters.woff2";

const RULE =
	/\.encounters-([A-Za-z0-9_-]+):before\s*\{[^}]*content:\s*["']\\([0-9a-fA-F]+)["']/g;

type Fontkit = {
	openSync: (file: string) => {
		glyphForCodePoint: (codePoint: number) => {
			path: {
				commands: unknown[];
				toSVG: () => string;
			};
		};
	};
};

export const getArkhamBuildIcons = (
	existing: IIcoMoon.Icon[],
): IIcoMoon.Icon[] => {
	try {
		return readIcons(existing);
	} catch (error) {
		showWarning("arkham.build encounter icons skipped:", error);
		return [];
	}
};

const readIcons = (existing: IIcoMoon.Icon[]) => {
	const root = path.join(DOWNLOADS_DIR, API.ARKHAM_BUILD_REPO_FOLDER_NAME);
	const cssFile = path.join(root, CSS_PATH);
	const fontFile = path.join(root, FONT_PATH);

	if (!fs.existsSync(cssFile) || !fs.existsSync(fontFile)) {
		showWarning(
			"arkham.build encounter icons skipped: font or css not downloaded",
		);
		return [];
	}

	const names = new Set(existing.map(({ properties }) => properties.name));
	const css = fs.readFileSync(cssFile, "utf8");
	const font = fontkit.openSync(fontFile);
	const icons: IIcoMoon.Icon[] = [];
	let id = existing.reduce((max, icon) => Math.max(max, icon.icon.id), 0);

	for (const match of css.matchAll(RULE)) {
		const name = match[1];
		if (names.has(name)) {
			continue;
		}

		const codePoint = Number.parseInt(match[2], 16);
		const outline = font.glyphForCodePoint(codePoint).path;
		if (outline.commands.length === 0) {
			showWarning(`arkham.build icon "${name}" has no glyph`);
			continue;
		}

		const normalized = normalizePath(outline.toSVG());
		if (!normalized) {
			showWarning(`arkham.build icon "${name}" has an empty outline`);
			continue;
		}

		names.add(name);
		id += 1;
		icons.push({
			properties: {
				name,
				iconSetName: ARKHAM_BUILD_ICON_SET,
			},
			icon: {
				id,
				paths: [normalized.d],
				width: normalized.width,
				grid: 0,
				tags: [name],
			},
		});
	}

	console.log(`arkham.build encounter icons: ${icons.length}`);
	return icons;
};

const normalizePath = (d: string) => {
	const pathData = new SVGPathData(d);
	pathData.scale(1, -1);
	const bounds = pathData.getBounds();
	const height = bounds.maxY - bounds.minY;
	const width = bounds.maxX - bounds.minX;
	if (height <= 0 || width <= 0) {
		return null;
	}

	const scale = DEFAULT_ICON_SIZE / height;
	pathData.translate(-bounds.minX, -bounds.minY).scale(scale, scale);

	return {
		d: pathData.encode(),
		width: Math.round(width * scale),
	};
};
