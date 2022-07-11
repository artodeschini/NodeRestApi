const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 8080;


//decode send data
app.use(bodyParser.urlencoded({extended: false}));

// allow send and response json
app.use(bodyParser.json());

//mock
let DB = {
    games: [
        {
            id: 1,
            name: "Super Mario World",
            year: 1990,
            price: 10
        },
        {
            id: 2,
            name: "Call of duty ME",
            year: 2025,
            price: 40
        },
        {
            id: 3,
            name: "Diablo",
            year: 2012,
            price: 40
        }

    ]
};

// find all
app.get("/games", (req, res) => {
    res.statusCode = 200;
    res.json(DB.games);
});

// find by id
app.get("/games/:id", (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.statusCode = 400;
        res.send("id need to be a number");

    } else {
        
        let id = parseInt(req.params.id);
        let game = DB.games.find(g => g.id == id);

        if (game != undefined) {
            res.statusCode = 200;
            res.json(game);

        } else {
            res.statusCode = 404;
            res.send({message: "not found"});
        }
    }
});

// create
app.post("/games", (req, res) => {
    // let name = req.body.name;
    // let year = req.body.year;
    // let price = req.body.price; 
    // simple form
    let {name,year, price} = req.body;
    
    if (name == undefined || year == undefined || price == undefined) {

        res.statusCode = 500;
        res.send({message:"Send correct data to create new game"});

    } else {
        let id = Math.floor(Math.random() * 100) + 1;
        let newGame = {id, name,year, price};

        DB.games.push(newGame);

        res.statusCode = 201
        res.send(newGame);
    }
});

app.delete("/games/:id", (req, res) => {

    if (isNaN(req.params.id)) {
        res.statusCode = 400;
        res.send("id need to be a number");

    } else {

        let id = parseInt(req.params.id);
        let i = DB.games.findIndex(g => g.id == id);

        if (i != -1) {
            DB.games.splice(i, 1); // remove desse index 1 element
            res.statusCode = 200;
            res.send({message: "Game is delete"});
            
        } else {
            res.statusCode = 404;
            res.send({message: "Game Not found"});
        }
    }
});

// update by id
app.put("/games/:id", (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.statusCode = 400;
        res.send("id need to be a number");

    } else {
        
        let id = parseInt(req.params.id);
        let game = DB.games.find(g => g.id == id);

        let {name,year,price} = req.body;

        if (game != undefined) {

            if (name != undefined) {
                game.name = name;
            }

            if (year != undefined) {
                game.year = year;
            }

            if (price != undefined) {
                game.price = price
            }


            res.statusCode = 200;
            res.json(game);

        } else {
            res.statusCode = 404;
            res.send({message: "not found"});
        }
    }
});

app.listen(port, () =>{
    console.log("App start!")
});