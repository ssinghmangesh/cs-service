const routes = require('express').Router();
const userManager = require("./userManager") 
const dataManager = require("./dataManager") 

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});



module.exports = {
  routes,
  userManager,
  dataManager
};