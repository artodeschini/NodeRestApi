const express = require("express");
const router = express.Router();
const User = require("./User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const JWTSecrect = "jwtSecret123"; // o secret pode ser qualquer coisa mesmo
const secret_salt = 10;

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

            let hash = bcrypt.hashSync(password, secret_salt);
    
            User.create({
                'email': email,
                'password': hash,
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

// editar usuario
router.put("/:id", (req, res) => {
    let idValue = req.params.id;
    let {nome,password, email} = req.body;
    
    if (idValue == undefined || nome == undefined || email == undefined || password == undefined) {

        res.status(400);
        res.send({message:"Send correct data to create new user"});
    }

    let id = parseInt(idValue);

    User.findOne({
        where: {id: id}
    }).then(user => {
        if (user != undefined) {
            
            let hash = bcrypt.hashSync(password, secret_salt);
        
            User.update(
                {   id:id,
                    'email': email,
                    'password': hash,
                    'nome': nome
                },
                {
                    where: { id:id }
                }
            ).then(() => {
                res.status(201);
                res.json({message:"Usuario editado com no banco de dados"});
            }).catch((err) => {
                console.log(err);
                //res.redirect("/admin/users");
                res.status(400);
                res.json({message:"Erro ao criar usuario"});
            })

        } else {
            console.log(`Usuario com id ${id} nao encontrado`);
            res.status(404);
            res.json({message:"Usuario nao encontrado"});
        }
    }).catch((err) => {
        console.log(err);
        res.status(500);
        res.json({message:"Erro ao tentar recuperar usuario pelo id"});
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
            
            let result = bcrypt.compareSync(password, user.password);
            console.log(result); // true

            if (result) {

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