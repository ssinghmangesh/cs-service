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
const authDripManager = require('./authDripManager');
const mailChimpManager = require('./mailChimpManager');
const activeCampaignManager = require('./activeCampaignManager');
const tagManager = require('./tagManager')

const { getSegments } = require('../controller/segment');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'it works!' });
});

routes.get('/health3', (re, res) => {
  res.status(200).send('working');
})

routes.get('/health', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});


routes.get('/cdn/test', (req, res) => {
  const { id } = req.query
  let data = getSegments(id)
  res.status(200).json({ status: true, id, data });

});


module.exports = {
  dripManager,
  routes,
  userManager,
  dataManager,
  authManager,
  authShopifyManager,
  authMailchimpManager,
  authDripManager,
  notificationsManager,
  shopifyManager,
  analyticsManager,
  tagManager,
  customerManager,
  whereClause,
  mailManager,
  segment,
  templateManager,
  orderManager,
  draftOrderManager,
  cartManager,
  productManager,
  productRecommendationsManager,
  klaviyoManager,
  mailChimpManager,
  activeCampaignManager,
};
