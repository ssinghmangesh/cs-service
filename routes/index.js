const routes = require('express').Router();
const userManager = require("./userManager") 

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});



module.exports = {
  routes,
  userManager
};