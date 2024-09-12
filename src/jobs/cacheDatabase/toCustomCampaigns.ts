
import { difference, prop, propEq } from "ramda";

import { RETURN_CYCLE_PREFIX } from "@/api/arkhamDB/constants";
import { IArkhamCards } from "@/types/arkhamCards";
import { IArkhamDB } from "@/types/arkhamDB";
import { IDatabase } from "@/types/database.old";
import { IIconDB } from "@/components/arkhamCards/icons/IconDB";

import { getLinkedEncounterSets, getLinkedScenarios, toLinkedCampaign } from "./toLinkedCampaign";


export const getReturnToCode = (id: string, cycles: IArkhamDB.JSON.ExtendedCycle[]) => {
  const returnToCode = id.slice(0, RETURN_CYCLE_PREFIX.length);

  if (returnToCode !== RETURN_CYCLE_PREFIX) {
    return;
  }

  return cycles.find(propEq(returnToCode, 'code'))?.code;
}

type IToCustomCampaign = {
  cycles: IArkhamDB.JSON.ExtendedCycle[]
  customPacks: IArkhamCards.JSON.ExtendedPack[]
  iconDB: IIconDB
}

export const toCustomCampaign = ({ cycles, customPacks, iconDB }: IToCustomCampaign) =>
  (campaign: IArkhamCards.Parsed.Campaign): IDatabase.Campaign => {
    const {
      id,
      name,
      position,
      campaign_type,
      custom,
      pack_code,
      cycle_code
    } = campaign;

    const pack = customPacks.find(
      ({ encounter_sets }) => encounter_sets.some(propEq(id, 'code'))
    );

    if (!pack) {
      console.log(`pack for custom campaign ${id} not found!`);
    }

    const returnSetCode = getReturnToCode(id, cycles);
    const linkedCampaigns = [campaign];

    const scenarios = getLinkedScenarios(linkedCampaigns);
    const arkhamCampaigns = linkedCampaigns.map(toLinkedCampaign);
    const encounterSets = getLinkedEncounterSets(linkedCampaigns);
    const packSets = pack?.encounter_sets.map(prop('code')) || [];

    const isCanonical = pack?.is_canonical || false

    const packs = pack_code ? [pack_code] : [];

    return {
      id,
      is_size_supported: false,
      name,
      packs,
      cycle_code,
      icon: iconDB.getId(id),
      position,
      is_canonical: Boolean(isCanonical),
      is_custom: Boolean(custom),
      campaign_type,
      return_set_code: returnSetCode,
      custom_content: custom,
      encounter_sets: packSets,
      extra_encounter_sets: difference(encounterSets, packSets),
      arkham_cards_scenarios: scenarios,
      arkham_cards_campaigns: arkhamCampaigns
    }
  }