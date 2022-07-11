const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const connection = require("./database/database");
const gamesController = require('./games/GamesController');


//decode send data
app.use(bodyParser.urlencoded({extended: false}));

// allow send and response json
app.use(bodyParser.json());

// database
connection.authenticate()
    .then(() => {
        console.log("connection with mysql database is done!");
    }).catch((error) => {
        console.log(error);
    });

app.use("/", gamesController);

app.listen(port, () =>{
    console.log("App start!")
});
