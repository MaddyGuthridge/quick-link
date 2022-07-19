import express, { json } from 'express';
import { getMapping, addMapping } from './backend';

const app = express();
app.use(json());

app.get('/', (req, res) => {
  res.send(`
    Hello world!!!

    This is my super simple URL shortener!
  `);
});

app.post('/new', (req, res) => {
  const { from, to, description, owner, password } = req.body;
  // FIXME: Add some actual security
  if (password != 'this is an example password that Im using as a placeholder until I bother to add some proper security') {
    throw new Error('Yikes');
  }
  addMapping(from, to, description, owner);
  res.send('{}');
});

app.get('/inspect', (req, res) => {
  const from = req.query.from as string;
  res.send(getMapping(from));
});

app.get('/:from', (req, res) => {
  const from = req.params.from;
  res.redirect(getMapping(from).to);
});

app.listen(5923, () => console.log('Listening on port 5923'));
