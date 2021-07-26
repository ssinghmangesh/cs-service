const routes = require('express').Router();
const dripManager = require('./dripManager');
const userManager = require("./userManager") 
const dataManager = require("./dataManager") 
const shopifyManager = require("./shopifyManager")
const authManager = require("./authManger")
const authShopifyManager = require("./authShopifyManager")
const analyticsManager = require("./analyticsManager")
const customerManager = require("./EntityManager/customerManager")
const whereClause = require('./whereClause');
const mailManager = require('./mailManager');
const segment = require('./segment');
const templateManager = require('./templateManager');
const notificationsManager = require('./notificationsManager');
const orderManager = require('./EntityManager/orderManager');
const draftOrderManager = require('./EntityManager/draftOrderManager');
const cartManager = require('./EntityManager/cartManager')
const productManager = require('./EntityManager/productManager')
const productRecommendationsManager = require('./EntityManager/productRecommendationsManager')
const klaviyoManager = require('./klaviyoManager');
const authMailchimpManager = require('./authMailchimpManager');
const mailChimpManager = require('./mailChimpManager');
const activeCampaignManager = require('./activeCampaignManager');

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
  dripManager,
  routes,
  userManager,
  dataManager,
  shopifyManager,
  authManager,
  authShopifyManager,
  authMailchimpManager,
  analyticsManager,
  customerManager,
  whereClause,
  mailManager,
  segment,
  templateManager,
  notificationsManager,
  orderManager,
  draftOrderManager,
  cartManager,
  productManager,
  productRecommendationsManager,
  klaviyoManager,
  mailChimpManager,
  activeCampaignManager,
};
