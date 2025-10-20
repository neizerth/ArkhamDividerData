import { Downloader } from "nodejs-file-downloader";

export const download = async (
	url: string,
	directory: string,
	fileName: string,
) => {
	const downloader = new Downloader({
		url,
		directory,
		fileName,
	});

	await downloader.download();
};
