import { ARKHAM_BUILD_CDN_BASE_URL } from "@/config/api";
import axios from "axios";
import fs from "fs";
import path from "path";

export const optimizedCardImageUrl = (cardCode: string) =>
	`${ARKHAM_BUILD_CDN_BASE_URL}/optimized/${cardCode}.webp`;

export type DownloadImageResult =
	| { status: "cached" | "downloaded"; path: string }
	| { status: "missing"; path: string }
	| { status: "error"; path: string; error: string };

/**
 * Download CDN optimized card scan into `targetPath` if missing.
 * Returns `missing` on HTTP 404.
 */
export const downloadOptimizedCardImage = async (
	cardCode: string,
	targetPath: string,
): Promise<DownloadImageResult> => {
	if (fs.existsSync(targetPath)) {
		return { status: "cached", path: targetPath };
	}

	fs.mkdirSync(path.dirname(targetPath), { recursive: true });

	const url = optimizedCardImageUrl(cardCode);

	try {
		const response = await axios.get<ArrayBuffer>(url, {
			responseType: "arraybuffer",
			validateStatus: (status) => status === 200 || status === 404,
		});

		if (response.status === 404) {
			return { status: "missing", path: targetPath };
		}

		fs.writeFileSync(targetPath, Buffer.from(response.data));
		return { status: "downloaded", path: targetPath };
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		return { status: "error", path: targetPath, error: message };
	}
};
