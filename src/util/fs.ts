import fs from 'fs';
import path from 'path';

export const createWriter = <T = string, D = string>({
  dir,
  extension = '',
  serialize = f => f as string
}: {
  dir: string,
  extension?: string
  serialize?: (data: D) => string 
}) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const getFilename = createFilenameResolver(dir, extension);

  return (name: T, data: D) => {
  
    const contents = serialize(data);
  
    const filename = getFilename(name as string);
  
    fs.writeFileSync(filename, contents);
  }
}

export const createJSONWriter = (dir: string) => createWriter<string, object>({
  dir,
  extension: 'json',
  serialize: data => JSON.stringify(data, null, 2)
});

export const createReader = <T = string, D = string>({
  dir,
  extension = '',
  unserialize = f => f as D
}: {
  dir: string,
  extension: string,
  unserialize?: (data: string) => D
}) => {
  const getFilename = createFilenameResolver(dir, extension);
  return <R extends D>(name: T, defaultValue?: R): R => {
    if (!fs.existsSync(dir)) {
      return defaultValue as R;
    }
  
    const filename = getFilename(name as string);
  
    if (!fs.existsSync(filename)) {
      return defaultValue as R;
    }
  
    const data = fs.readFileSync(filename);
    return unserialize(data.toString()) as R;
  }
}

export const createJSONReader = (dir: string) => createReader({
  dir,
  extension: 'json',
  unserialize: JSON.parse
});

export const createFilenameResolver = (dir: string, extension: string) => 
  (name: string) => 
    path.join(dir + '/' + name + '.' + extension);

export const createJSONResolver = (dir: string) => createFilenameResolver(dir, 'json');

export const mkDir = (dir: string) => !fs.existsSync(dir) && fs.mkdirSync(dir); 

export const rmDir = (dir: string) => fs.existsSync(dir) && fs.rmSync(dir, { recursive: true }); 