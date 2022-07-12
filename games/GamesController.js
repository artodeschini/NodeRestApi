const express = require("express");
const router = express.Router();
const Game = require("./Game");
const jwt = require('jsonwebtoken');
const JWTSecrect = "jwtSecret123"; // o secret pode ser qualquer coisa mesmo

// middleware authorization
function auth(req, res, next) {
    const authorization = req.headers['authorization'];

    if (authorization != undefined) {
        let token = authorization.split(' ')[1];

        jwt.verify(token, JWTSecrect, (error, data) => {
            if (error) {
                res.status(401);
                res.send({message:"Token verificado invalido"});

            } else {
               
                console.log(data);
                req.token = token;
                req.loggedUser = {'id': data.id, email: data.email};

                next();
            }
        });

    } else {
        res.status(401);
        res.send({message:"Token invalido"});
    }
 }

router.get("/", auth, (req, res) => {
    Game.findAll().then(games => {
        res.status(200);
        res.json(games);

    }).catch((err) => {
        res.status(500);
        res.json({message: "error to retrive "});
    });    
});

// find by id
router.get("/:id", auth, (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.status(400);
        res.send("id need to be a number");

    } else {

        let id = parseInt(req.params.id);

        Game.findByPk(id).then(game => {
            if (game != undefined) {
                res.statusCode = 200;
                res.json(game);
            } else {
                res.statusCode = 404;
                res.send({message: "not found"});
            }
        });
    }
});

// create
router.post("/", auth, (req, res) => {

    let {name,year, price} = req.body;
    
    if (name == undefined || year == undefined || price == undefined) {

        res.status(400);
        res.send({message:"Send correct data to create new game"});

    } else {

        let newGame = {name,year, price};

        Game.create(newGame).then((result) => {
            
            const dataObj = result.get({plain:true})
            
            res.status(201);
            res.send(dataObj);

        }).catch((err) => {
            res.status(500);
            res.send({message:"Send correct data to create new game"});
        });
    }
});

router.delete("/:id", auth, (req, res) => {

    if (isNaN(req.params.id)) {
        res.statusCode = 400;
        res.send("id need to be a number");

    } else {

        let id = parseInt(req.params.id);

        if (id != undefined) {
            if (!isNaN(id)) { // verifica se é um numero numero
                
                Game.destroy({
                    where: {id: id}
                }).then(() => {
                    res.statusCode = 204;
                    res.send("id need to be a number");
                }); 

            } else {

                res.status(400);
                res.send("id need to be a number");
            }
        } else {
            res.statusCode = 400;
            res.send("id need to be a number");
        }
    }
});

// update by id
router.put("/:id", auth, (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.status(400);
        res.send("id need to be a number");

    } else {
        
        let id = parseInt(req.params.id);

        let {name,year,price} = req.body;
        
        Game.findByPk(id).then(game => {
            console.log(game);
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

                Game.update(
                    {'id': game.id, 'name': name, 'year': year, 'price': price },
                    {where: { id:id }}
                ).then(() => {
                    res.status(202);
                    res.json(game);

                }).catch((err) => {
                    res.status(500);
                    res.json({message: 'Erro to update Game'});
                });

            } else {
                res.status(404);
                res.send({message: "not found"});
            }
        });
    }
});

module.exports = router;