const { clear } = require('console');
const express = require('express');
const app = express();
const port = 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

app.get('/about', (req, res) => {
  res.send('This is the About Page.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
