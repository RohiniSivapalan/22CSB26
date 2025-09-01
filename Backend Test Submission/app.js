const express = require('express');
const app = express();

app.use(express.json());
const routes = require('./routes');

app.use('/', routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING AT PORT : ${PORT}`);
});