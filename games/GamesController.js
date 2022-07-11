const express = require("express");
const router = express.Router();
const Game = require("./Game");

router.get("/", (req, res) => {
    Game.findAll().then(games => {
        res.statusCode = 200;
        res.json(games);
    }).catch((err) => {
        res.statusCode = 500;
        res.json({message: "error to retrive "});
    });    
});

// find by id
router.get("/:id", (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.statusCode = 400;
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
router.post("/", (req, res) => {

    let {name,year, price} = req.body;
    
    if (name == undefined || year == undefined || price == undefined) {

        res.statusCode = 400;
        res.send({message:"Send correct data to create new game"});

    } else {

        let newGame = {name,year, price};

        Game.create(newGame).then((result) => {
            
            const dataObj = result.get({plain:true})
            
            res.statusCode = 201
            res.send(dataObj);

        }).catch((err) => {
            res.statusCode = 500;
            res.send({message:"Send correct data to create new game"});
        });
    }
});

router.delete("/:id", (req, res) => {

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

                res.statusCode = 400;
                res.send("id need to be a number");
            }
        } else {
            res.statusCode = 400;
            res.send("id need to be a number");
        }
    }
});

// update by id
router.put("/:id", (req, res) => {
    
    if (isNaN(req.params.id)) {    
        res.statusCode = 400;
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
                    res.statusCode = 202;
                    res.json(game);

                }).catch((err) => {
                    res.statusCode = 500;
                    res.json({message: 'Erro to update Game'});
                });

            } else {
                res.statusCode = 404;
                res.send({message: "not found"});
            }
        });
    }
});

module.exports = router;