import * as API from "@/api/arkhamBuildFan/api";
import type { createCustomContent } from "@/components/custom/createCustomContent";
import { showInfo, showWarning } from "@/util/console";
import {
	findEncounterSize,
	findFanProject,
	getSizesByEncounterName,
} from "./projectSizes";

type CustomContent = ReturnType<typeof createCustomContent>;

/**
 * Attach encounter-set sizes from arkham-build/fan-made-content projects
 * to custom content, matching stories by meta.name and sets by name.
 */
export const enrichCustomContentSizes = async (
	customContent: CustomContent[],
): Promise<CustomContent[]> => {
	const projects = await API.loadProjects();

	if (projects.length === 0) {
		showWarning("Fan content: no projects found in downloads");
		return customContent;
	}

	showInfo(`Fan content: loaded ${projects.length} projects`);

	return customContent.map((content) => {
		const project = findFanProject(
			{
				name: content.story.name,
				type: content.story.type,
				encounterSets: content.encounterSets,
			},
			projects,
		);

		if (!project) {
			showWarning(
				`Fan content: no project match for "${content.story.name}"`,
			);
			return content;
		}

		showInfo(
			`Fan content: matched "${content.story.name}" → "${project.meta.name}"`,
		);

		const sizesByName = getSizesByEncounterName(project);

		const encounterSets = content.encounterSets.map((encounterSet) => {
			const matched = findEncounterSize(encounterSet.name, sizesByName);

			if (!matched) {
				showWarning(
					`Fan content: no encounter set match for "${content.story.name}" / "${encounterSet.name}"`,
				);
				return encounterSet;
			}

			return {
				...encounterSet,
				size: matched.size,
				types: matched.types,
			};
		});

		const sizedCount = encounterSets.filter((set) => Boolean(set.size)).length;
		const is_size_supported =
			content.story.is_size_supported ||
			(encounterSets.length > 0 && sizedCount === encounterSets.length);

		return {
			...content,
			encounterSets,
			story: {
				...content.story,
				is_size_supported,
			},
		};
	});
};
