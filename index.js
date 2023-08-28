const express = require('express');
const app = express();
const port = 3000;

const a = 1;
console.log(a);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
