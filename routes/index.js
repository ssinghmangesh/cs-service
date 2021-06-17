const routes = require('express').Router();
const userManager = require("./userManager") 
const dataManager = require("./dataManager") 
const shopifyManager = require("./shopifyManager")
const authManager = require("./authManger")
const authShopifyManager = require("./authShopifyManager")
const analyticsManager = require("./analyticsManager")
const customerManager = require("./customerManager")
const whereClause = require('./whereClause');
const mailManager = require('./mailManager');
const segment = require('./segment');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'it works!' });
});

routes.get('/health3', (re, res) => {
  res.status(200).send('working');
})

routes.get('/health', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});




module.exports = {
  routes,
  userManager,
  dataManager,
  shopifyManager,
  authManager,
  analyticsManager,
  authShopifyManager,
  customerManager,
  whereClause,
  mailManager,
  segment,
};
