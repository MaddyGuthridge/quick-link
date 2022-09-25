import express, { json } from 'express';
import {
  getMapping,
  addMapping,
  getStats,
  validatePassword,
  listMappings,
} from './backend';

const app = express();
app.use(json());

app.get('/', (req, res) => {
  res.send(`
    Hello world!!!

    This is my super simple URL shortener!

    Currently contains ${getStats().size} routes
  `);
});

app.post('/new', (req, res) => {
  const { from, to, description, visible, owner, password } = req.body;
  if (!validatePassword(password)) {
    res.status(403).send('No');
    return;
  }
  addMapping(from, to, description, owner, visible);
  res.send('{}');
});

app.get('/list/', (req, res) => {
  let str = listMappings().reduce((prev: string, curr) => {
    return `${prev}* ${curr.from} => ${curr.to} (${curr.description})\n<br>\n`;
  }, '').trim();
  if (str.length == 0) {
    res.send("No public mappings");
  } else {
    res.send(str);
  }
});

app.get('/inspect/:from', (req, res) => {
  const from = req.params.from as string;
  res.send(getMapping(from));
});

app.get('/:from', (req, res) => {
  const from = req.params.from;
  res.redirect(getMapping(from).to);
});

app.listen(5923, () => console.log('Listening on port 5923'));
