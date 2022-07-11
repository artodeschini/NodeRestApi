const Sequelize = require("sequelize");
const connection = require("../database/database");

const Game = connection.define('game', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    year: {
        type: Sequelize.INTEGER,
        allowNull: false
    },

    price: {
        type: Sequelize.DECIMAL,
        allowNull: false
    }
});

// Game.sync({force: true});

module.exports = Game;