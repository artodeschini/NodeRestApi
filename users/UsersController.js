const express = require("express");
const router = express.Router();
const User = require("./User");
const jwt = require('jsonwebtoken');
// const bcrypt = require("bcryptjs");
// const adminAuth = require("../middlewares/adminAuth");

const JWTSecrect = "qualquer_coisa"; // o secret pode ser qualquer coisa mesmo

//router.post("/", adminAuth, (req, res) => {
// criar usuario
router.post("/", (req, res) => {
    let {nome,password, email} = req.body;
    
    if (nome == undefined || email == undefined || password == undefined) {

        res.status(400);
        res.send({message:"Send correct data to create new user"});
    }

    User.findOne({
        where: {email: email}
    }).then(user => {
        if (user == undefined) {
        
            User.create({
                'email': email,
                'password': password,
                'nome': nome
            }).then(() => {
                res.status(201);
                res.json({message:"Usuario criado com no banco de dados"});
            }).catch((err) => {
                console.log(err);
                //res.redirect("/admin/users");
                res.status(400);
                res.json({message:"Erro ao criar usuario"});
            })

        } else {
            console.log('existe outro usuario com o mesmo email');
        }
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.json({message:"Erro ao tentar recuperar usuario pelo email"});
    });
});

// router.get("/admin/users", adminAuth, (req, res) => {
router.get("/", (req, res) => {
    User.findAll().then(users => {
        res.status(200);
        res.json(users);
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.json({message:"Erro ao tentar recuperar usuario pelo email"});
    });
});

router.post("/auth", (req, res) => {
    let {password, email} = req.body;
    
    if (email == undefined || password == undefined) {

        res.status(400);
        res.json({message:"informe corretamente os campos"});
    }

    User.findOne({
        where: {
            'email': email
        }
    }).then(user => {
        if (user == undefined) {
            res.statusCode = 404;
            res.send({message:"Usuario nao encontrado"});
        } else {
            if (user.password == password) {

                jwt.sign(
                    {id: user.id, email: user.email},
                    JWTSecrect,
                    {expiresIn: '1h'},
                    (error, token) => {
                        if (error) {
                            res.status(400);
                            res.send({message:"Erro ao gerar o token"});
                        } else {
                            res.status(200);
                            res.send({'token': token});
                        }
                    }
                );
                
            } else {
                res.status(401);
                res.send({message:"Credenciais invalidas"});
            }
           
        }
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.json({message:"Erro ao tentar recuperar usuario pelo email"});
    });
});

module.exports = router;