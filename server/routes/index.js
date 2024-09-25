var express = require('express');
var router = express.Router();
const Data = require('../models/businessCardSchema')
const userController = require('../controller/userController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express WOkrin' });
});


router.post('/addBusinessCard', userController.addBusinessCardRates)

router.get('/getBusinessCardItems', userController.getBusinessCardItems)

router.post('/editBusinessCardItem', userController.editBusinessCardRates)




module.exports = router;
