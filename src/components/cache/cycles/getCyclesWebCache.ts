import { JSDOM } from 'jsdom';

import { loadPacks, loadSearchPageContents } from "@/api/arkhamDB/api"
import { IArkhamDB } from '@/types/arkhamDB';
import { whereEquals } from '@/util/criteria';
import { RETURN_CYCLE_CODE } from '@/api/arkhamDB/constants';
import { withCode, withoutCode } from '@/api/arkhamDB/criteria';
import { withReturnSetCode } from '@/api/arkhamDB/util';

export const getCyclesWebCache = async () => {
  const cyclesWebData = await getCyclesData();
  const packs = await loadPacks();

  const cycles = cyclesWebData.map(updateCycleSet(packs))

  const returnCycle = cycles.find(whereEquals({
    code: RETURN_CYCLE_CODE
  })) as IArkhamDB.Web.ExtendedCycle;
  
  return cycles
    .filter(withoutCode(RETURN_CYCLE_CODE))
    .map(withReturnSetCode(returnCycle.sets));
}

export const updateCycleSetInfo = (packs: IArkhamDB.API.Pack[]) => (cycleSet: IArkhamDB.Web.Set): IArkhamDB.API.Pack => 
  packs.find(withCode(cycleSet.code)) as IArkhamDB.API.Pack;

export const updateCycleSet = (packs: IArkhamDB.API.Pack[]) => (cycle: IArkhamDB.Web.ExtendedCycle) => {
  const sets = cycle.sets.map(updateCycleSetInfo(packs));
  const position = sets[0]?.cycle_position
  return {
    ...cycle,
    position,
    sets
  }
}

export const getCyclesData = async () => {
  const contents = await loadSearchPageContents();
  const { window } = new JSDOM(contents);
  const { document } = window;

  const links = [...document.querySelectorAll('a[href*="/cycle/"]')] as HTMLAnchorElement[];
  return links.map(mapCycle);
}

export const mapCycle = (link: HTMLAnchorElement): IArkhamDB.Web.ExtendedCycle => {
  const coreRe = /\/cycle\/([^\/]+)/;
  const url = link.href;
  const matches = url.match(coreRe) || [];
  const code = matches[1];

  const sets = parseCycleSets(link);

  return {
    name: link.textContent || '',
    url,
    code,
    sets
  }
}

export const parseCycleSets = (link: HTMLAnchorElement) => {
  const parent = link.closest('li');
  if (!parent) {
    return []
  }
  const links = [...parent.querySelectorAll('ol a[href*="/set/"]')] as HTMLAnchorElement[];

  return links.map(mapCycleSet);
}

export const mapCycleSet = (link: HTMLAnchorElement) => {
  const coreRe = /\/set\/([^\/]+)/;
  const url = link.href;
  const matches = url.match(coreRe) || [];
  const code = matches[1];

  return {
    name: link.textContent || '',
    url,
    code
  }
}

// export const parseSets