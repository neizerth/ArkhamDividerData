
import { ICONS_CACHE_DIR } from '@/config/app';
import * as Cache from '@/util/cache';
import { showError, showInfo, showWarning } from '@/util/console';
import fs from 'fs';
import { last } from 'ramda';

export const getCodepoints = () => {
  const glyphMap = Cache.getLastGlyphMap();

  if (!glyphMap) {
    showError('No glyph map found');
    return;
  }

  const lastCodepoint = last(Object.values(glyphMap))

  console.log('last glyph map codepoint', lastCodepoint);

  if (!lastCodepoint) {
    return;
  }

  const files = fs.readdirSync(ICONS_CACHE_DIR)
    .filter(file => file.endsWith('.svg'))
    .map(file => file.replace('.svg', ''))
  
  const newIcons = files.filter(
    name => glyphMap[name] === undefined
  )

  if (newIcons.length === 0) {
    showWarning('No new icons found');
    return glyphMap;
  }

  showInfo(`found ${newIcons.length} new icons`)
  
  const update: typeof glyphMap = newIcons.reduce(
    (acc, icon, index) => {
      acc[icon] = lastCodepoint + index + 1;
      return acc;
    }, {});
  
  return {
    ...glyphMap,
    ...update
  }
}