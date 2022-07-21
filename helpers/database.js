const Sequelize = require('sequelize');
const sequelize = new Sequelize('oblongsquare', 'root', 'Solomon33', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;