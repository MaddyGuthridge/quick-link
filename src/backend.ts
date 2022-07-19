import { readFileSync, writeFileSync } from 'fs';

interface IRedirect {
  from: string,
  to: string,
  description: string,
  owner: string,
};

// Path to data file
const DATA_FILE = 'data.json';

// Map between original URL and redirect objects
let data: Map<string, IRedirect> = new Map();

const saveData = () => {
  writeFileSync(DATA_FILE, JSON.stringify(Array.from(data.entries())));
};

const loadData = () => {
  try {
    data = new Map(JSON.parse(readFileSync(DATA_FILE, { encoding: 'utf-8' })));
  } catch {}
};

export const clearData = () => {
  data = new Map();
}

export const getMapping = (from: string): IRedirect => {
  const result = data.get(from);
  if (result === undefined) throw Error(`No mapping found for ${from}`);
  return result;
};

export const addMapping = (from: string, to: string, description: string, owner: string) => {
  if (data.get(from) !== undefined) throw Error(`Mapping for ${from} already exists`);
  data.set(from, {
    from,
    to,
    description,
    owner
  });
  saveData();
}

loadData();
