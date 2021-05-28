const routes = require('express').Router();
const userManager = require("./userManager") 
const dataManager = require("./dataManager") 
const shopifyManager = require("./shopifyManager")
const analyticsManager = require("./analyticsManager")
const customerManager = require("./customerManager")

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});



module.exports = {
  routes,
  userManager,
  dataManager,
  shopifyManager,
  analyticsManager,
  customerManager,
};