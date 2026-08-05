const express = require('express');
const app = express();
const PORT = 5000;

app.get('/', function (req, res) {
    res.send("Welcome to the server");
})

app.listen(PORT, function () {
    console.log(`Server is running on port ${PORT}`);
})