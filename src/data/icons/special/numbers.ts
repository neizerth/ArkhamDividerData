import { range } from "ramda";

const numbers = range(0, 10)
  .map(i => `num${i}`);

const signs = ['minus', 'plus'];

const height = 1024;

const chars = [
  ...numbers,
  ...signs,
]

const fill = chars.map(char => `${char}-fill-min`);

const outline = chars.map(
  char => `${char}-outline${char === 'num0' ? '_alt' : ''}-min`
)

const icons = [
  ...fill,
  ...outline
]

const iconWidth: Record<string, number> = {
  num0: 864,
  num1: 512,
  num2: 768,
  num3: 832,
  num4: 832,
  num5: 768,
  num6: 768,
  num7: 704,
  num8: 768,
  num9: 768,
  minus: 307,
  plus: 307
}

export default icons.map(icon => ({
  icon,
  height,
  width: iconWidth[icon]
}))