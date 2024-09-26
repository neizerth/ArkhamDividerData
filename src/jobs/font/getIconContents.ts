import { IIcoMoon } from "@/types/icomoon";
import getBounds from 'svg-path-bounds'

export const getIconContents = ({ icon }: IIcoMoon.Icon) => {

  const paths = icon.paths
    .map(d => `<path d="${d}"/>`)
    .join('');

  const bounds = icon.paths.reduce((target, d) => {
      const [left, top, right, bottom] = getBounds(d);

      return {
        top: Math.min(target.top, top),
        left: Math.min(target.left, left),
        right: Math.max(target.right, right),
        bottom: Math.max(target.bottom, bottom)
      };
    }, {
      top: Infinity,
      left: Infinity,
      right: -Infinity,
      bottom: -Infinity
    });
  
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const viewBox = `${bounds.left} ${bounds.top} ${width} ${height}`

  return `<svg viewBox="${viewBox}">${paths}</svg>`;
}