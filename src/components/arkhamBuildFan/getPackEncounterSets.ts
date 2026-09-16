import * as API from "@/api/arkhamBuildFan/api";
import {
	findEncounterSize,
	findFanProject,
	getSizesByEncounterName,
} from "@/components/arkhamBuildFan/projectSizes";
import { ICache } from "@/types/cache";
import * as Cache from "@/util/cache";
import { showInfo, showWarning } from "@/util/console";
import { encounterKeysMatch, encounterMatchKey } from "./matchName";

const FAN_PROJECT_TYPE_BY_CYCLE: Record<string, string> = {
	zcam: "campaign",
	zinv: "investigators",
};

/**
 * Encounter-set sizes from arkham-build/fan-made-content.
 * Used as a fallback for Arkham Cards fan packs that lack ArkhamDB / arkham.build sizes.
 * Matches pack → project by meta.name, then encounter code → fan set by name.
 */
export const getPackEncounterSets = async (): Promise<
	ICache.PackEncounterSet[]
> => {
	const projects = await API.loadProjects();

	if (projects.length === 0) {
		showWarning("Fan content: no projects found for pack encounter sizes");
		return [];
	}

	const packs = Cache.getPacks();
	const encounterDefs = Cache.getEncounterSets();
	const result: ICache.PackEncounterSet[] = [];

	let matchedPacks = 0;

	for (const pack of packs) {
		const project = findFanProject(
			{
				name: pack.name,
				type: FAN_PROJECT_TYPE_BY_CYCLE[pack.cycle_code],
			},
			projects,
		);

		if (!project) {
			continue;
		}

		matchedPacks += 1;
		showInfo(
			`Fan content: pack "${pack.name}" (${pack.code}) → "${project.meta.name}"`,
		);

		const sizesByName = getSizesByEncounterName(project);

		for (const fanSet of project.data.encounter_sets) {
			const sizeData = findEncounterSize(fanSet.name, sizesByName);
			if (!sizeData) {
				continue;
			}

			const fanKey = encounterMatchKey(fanSet.name);
			const def = encounterDefs.find((entry) =>
				encounterKeysMatch(encounterMatchKey(entry.name), fanKey),
			);

			if (!def) {
				showWarning(
					`Fan content: no local encounter code for "${pack.code}" / "${fanSet.name}"`,
				);
				continue;
			}

			result.push({
				cycle_code: pack.cycle_code,
				pack_code: pack.code,
				encounter_set_code: def.code,
				source: ICache.Source.ARKHAM_BUILD,
				size: sizeData.size,
				types: sizeData.types,
			});
		}
	}

	showInfo(
		`Fan content: sized encounter sets for ${matchedPacks} packs (${result.length} sets)`,
	);

	return result;
};
