import { getContents, getWithPrefix } from "@/api/fileRepo";
import {
	ARKHAM_BUILD_FAN_REPO_FOLDER_NAME,
} from "@/config/api";
import { DOWNLOADS_DIR } from "@/config/app";
import type { IArkhamBuildFan } from "@/types/arkhamBuildFan";
import fs from "fs";
import path from "path";

const PROJECTS_DIR = "projects";

const getFanJSON = getWithPrefix(ARKHAM_BUILD_FAN_REPO_FOLDER_NAME);
const getFanContents = getContents(ARKHAM_BUILD_FAN_REPO_FOLDER_NAME);

export const loadProjects = async (): Promise<IArkhamBuildFan.Project[]> => {
	const projectsPath = path.join(
		DOWNLOADS_DIR,
		ARKHAM_BUILD_FAN_REPO_FOLDER_NAME,
		PROJECTS_DIR,
	);

	if (!fs.existsSync(projectsPath)) {
		return [];
	}

	const { data: files = [] } = await getFanContents(PROJECTS_DIR);

	const projects: IArkhamBuildFan.Project[] = [];

	for (const file of files) {
		if (!file.endsWith(".json")) {
			continue;
		}

		const { data } = await getFanJSON<IArkhamBuildFan.Project | undefined>(
			`${PROJECTS_DIR}/${file}`,
			{ defaultData: undefined },
		);

		if (data?.meta?.name && data.data?.cards && data.data?.encounter_sets) {
			projects.push(data);
		}
	}

	return projects;
};
