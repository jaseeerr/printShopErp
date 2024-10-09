var express = require('express');
var router = express.Router();
const Data = require('../models/businessCardSchema')
const userController = require('../controller/userController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express WOkrin' });
});


router.post('/addBusinessCardRates', userController.addBusinessCardRates)
router.get('/getBusinessCardRates', userController.getBusinessCardRates)







module.exports = router;
