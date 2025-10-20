import type { IIcoMoon } from "@/types/icomoon";
import { preservePaths } from "@/data/icons/transformation.json";
import { DEFAULT_ICON_SIZE } from "@/config/icons";

import { SVGPathData } from "svg-pathdata";
import sharp from "sharp";
import { getIsIconCircled } from "./getIsIconCircled";

import { reorient } from "svg-reorient";
import { optimize } from "svgo";

export const getIconContents = async (item: IIcoMoon.Icon) => {
	const { name } = item.properties;
	const preserve = preservePaths.includes(name) || name.startsWith("token_");

	const getIcon = preserve ? getDefaultIcon : getCroppedIcon;

	const icon = await getIcon(item);

	const { width, height, paths, circled } = icon;

	const svg = getSVG({
		paths,
		width,
		height,
	});

	return {
		svg,
		width,
		height,
		circled,
	};
};

export const getSVG = ({
	width,
	height,
	paths,
}: {
	width: number;
	height: number;
	paths: string[];
}) => {
	const pathContents = paths.map((d) => `<path d="${d}" />`).join(" ");

	const viewBox = `0 0 ${width} ${height}`;

	const xmlns = "http://www.w3.org/2000/svg";

	const attrs = `xmlns="${xmlns}" viewBox="${viewBox}" width="${width}" height="${height}"`;
	const svg = `<svg ${attrs}>${pathContents}</svg>`;

	return reorient(svg);
};

export const getCroppedIcon = async (item: IIcoMoon.Icon) => {
	const rect = await getSVGBoundingRect(item);
	const { width, height, circled } = rect;

	const paths = [];

	for (const path of item.icon.paths) {
		const translatedPath = await translatePath({
			path,
			rect,
		});

		paths.push(translatedPath);
	}

	return {
		width,
		height,
		circled,
		paths,
	};
};

export const getDefaultIcon = ({ icon }: IIcoMoon.Icon) => {
	const height = DEFAULT_ICON_SIZE;
	const { width = DEFAULT_ICON_SIZE, paths } = icon;

	return {
		width,
		height,
		paths,
		circled: false,
	};
};

export const translatePath = async ({
	path,
	rect,
}: {
	path: string;
	rect: ISVGBoundingRect;
}) => {
	const { top, left } = rect;

	const pathData = new SVGPathData(path);
	const dX = -left;
	const dY = -top;
	pathData.translate(dX, dY);

	return pathData.encode();
};

type ISVGBoundingRect = {
	top: number;
	left: number;
	width: number;
	height: number;
	size: number;
	circled?: boolean;
};

export const getSVGBoundingRect = async ({
	icon,
	properties,
}: IIcoMoon.Icon): Promise<ISVGBoundingRect> => {
	const { paths, width = DEFAULT_ICON_SIZE } = icon;
	const height = DEFAULT_ICON_SIZE;
	const svg = await getSVG({
		width,
		height,
		paths,
	});

	const buffer = Buffer.from(svg);
	const img = sharp(buffer).trim().raw();

	const response = await img.toBuffer({
		resolveWithObject: true,
	});

	const circled = getIsIconCircled(response);

	if (circled) {
		console.log(`icon "${properties.name}" is circled!`);
	}

	const { info } = response;

	const { trimOffsetLeft = 0, trimOffsetTop = 0 } = info;

	const size = Math.max(info.width, info.height);

	return {
		top: -trimOffsetTop,
		left: -trimOffsetLeft,
		width: info.width,
		height: info.height,
		size,
		circled,
	};
};
