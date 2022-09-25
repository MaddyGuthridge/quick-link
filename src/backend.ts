import { readFileSync, writeFileSync } from 'fs';
import crypto from 'crypto';
import createPrompt from 'prompt-sync';

const prompt = createPrompt({});

interface IRedirect {
  from: string,
  to: string,
  description: string,
  owner: string,
  visible: boolean,
};

const HOME = require('os').homedir();

// Path to data file
const DATA_FILE = 'data.json';

// Map between original URL and redirect objects
let data: Map<string, IRedirect> = new Map();

let stored_hash = '';

const loadHash = () => {
  try {
    stored_hash = readFileSync(`${HOME}/.quick-link-pass`, { encoding: 'utf-8' });
  } catch {
    setup();
  }
}

const saveData = () => {
  writeFileSync(DATA_FILE, JSON.stringify(Array.from(data.entries())));
};

const loadData = () => {
  try {
    data = new Map(JSON.parse(readFileSync(DATA_FILE, { encoding: 'utf-8' })));
  } catch { }
  // Add missing fields
  let changed = false;
  for (const [k, v] of data.entries()) {
    // Visible
    if (v.visible === undefined) {
      v.visible = false;
      data.set(k, v);
      changed = true;
    }
  }
  if (changed) {
    saveData();
  }
  loadHash();
};

export const clearData = () => {
  data = new Map();
};

export const setup = () => {
  console.log('Unable to read configuration, initialising setup');
  let password = '';
  while (password.length == 0) {
    console.log('Enter a password to use when adding redirects');
    password = prompt.hide('> ');
  }
  stored_hash = crypto.createHash('sha256').update(password).digest('hex');
  writeFileSync(`${HOME}/.quick-link-pass`, stored_hash, { encoding: 'utf-8' });
  console.log('Password saved!');
}

export const getMapping = (from: string): IRedirect => {
  const result = data.get(from);
  if (result === undefined) throw Error(`No mapping found for ${from}`);
  return result;
};

export const addMapping = (
    from: string,
    to: string,
    description: string,
    owner: string,
    visible: boolean,
  ) => {
    if (data.get(from) !== undefined) throw Error(`Mapping for ${from} already exists`);
    data.set(from, {
      from,
      to,
      description,
      owner,
      visible,
    });
    saveData();
}

export const getStats = () => {
  return {
    size: data.size
  }
}

export const listMappings = (): IRedirect[] => {
  let ret: IRedirect[] = [];
  for (const v of data.values()) {
    // Filter to visible
    if (v.visible) {
      ret.push(v);
    }
  }
  return ret;
}

export const validatePassword = (password: string): boolean => {
  const hashed = crypto.createHash('sha256').update(password).digest('hex');
  return hashed === stored_hash;
}

loadData();
