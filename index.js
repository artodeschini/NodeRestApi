const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;
const connection = require("./database/database");
const gamesController = require('./games/GamesController');
const cors = require('cors');

app.use(cors());

//decode send data
app.use(bodyParser.urlencoded({extended: false}));

// allow send and response json
app.use(bodyParser.json());
// pp.use(express.static(__dirname+'/html'))

// database
connection.authenticate()
    .then(() => {
        console.log("connection with mysql database is done!");
    }).catch((error) => {
        console.log(error);
    });

// router.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname+'/index.html'));
// });

app.use("/games", gamesController);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.listen(port, () =>{
    console.log("App start!")
});
