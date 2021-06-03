const routes = require('express').Router();
const userManager = require("./userManager") 
const dataManager = require("./dataManager") 
const shopifyManager = require("./shopifyManager")
const authManager = require("./authManger")
const analyticsManager = require("./analyticsManager")
const customerManager = require("./customerManager")
const whereClause = require('./whereClause');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});




module.exports = {
  routes,
  userManager,
  dataManager,
  shopifyManager,
  authManager,
  analyticsManager,
  customerManager,
  whereClause,
};