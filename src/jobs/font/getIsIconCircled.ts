import sharp from "sharp"

export const getIsIconCircled = ({
  data,
  info
}: {
  data: Buffer,
  info: sharp.OutputInfo
}) => {
  const { width, height } = info;

  const ratio = width / height;
  const EPS = 0.03;

  const dR = Math.abs(1 - ratio);

  // non squared icon
  if (dR > EPS) {
    return false;
  }

  // RGBA
  const CHANNELS_COUNT = 4;
  const size = data.length;

  // circle center
  const cX = width / 2;
  const cY = height / 2;

  // radius scale coefficient
  const rK = 1.1;

  const r = Math.max(width, height) * rK / 2;

  for (let i = 0; i < size; i += CHANNELS_COUNT) {
    const a = data[i + 3];

    const isEmptyPixel = a === 0;
    const index = i / CHANNELS_COUNT;
    const x = index % width;
    const y = (index - x) / width;

    const isPixelInCircle = (x - cX) ** 2 + (y - cY) ** 2 <= r ** 2;

    // console.log(a)
    
    if (!isPixelInCircle && !isEmptyPixel) {

      // console.log(`[${x}][${y}]:${a} is not in a circle`)
      // console.log(`[${x}][${y}] is not in a circle`)
      return false;
    }
  }
  
  console.log(`icon is circled!`);

  return true;
}
