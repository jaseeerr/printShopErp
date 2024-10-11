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
router.post('/updateBusinessCardRates', userController.updateBusinessCardRates)

router.post('/addUniformRates', userController.addUniformRares)
router.post('/updateUniformRates', userController.updateUniformRares)
router.get('/getUniformRates', userController.getUniformRates)








module.exports = router;
