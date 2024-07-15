const express = require('express');

const app = express();
require('dotenv').config()
console.log(process.env) 
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

