import fs from 'fs';

export const createJSONWriter = <T = string>(dir: string) => (name: T, data: object) => {

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const contents = JSON.stringify(data, null, 2);

  const filename = dir + '/' + name + '.json';

  fs.writeFileSync(filename, contents);
}

export const createJSONReader = <T = string>(dir: string) => <R>(name: T, defaultValue?: R): R => {
  if (!fs.existsSync(dir)) {
    return defaultValue as R;
  }

  const filename = dir + '/' + name + '.json';

  if (!fs.existsSync(filename)) {
    return defaultValue as R;
  }

  const data = fs.readFileSync(filename);
  const json = JSON.parse(data.toString());

  return json;
}