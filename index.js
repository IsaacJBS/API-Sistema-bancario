const express = require('express');
const roteador = require('./roteador.js');

const app = express();

app.use(express.json());
app.use(roteador);
app.listen(8000);
