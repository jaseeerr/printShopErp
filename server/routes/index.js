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

router.post('/addBillBookRates', userController.addBillBookRates)
router.get('/getBillBookRates', userController.getBillBookRates)
router.post('/updateBillBookRates', userController.updateBillBookRates)

router.post('/addKeychainRates', userController.addKeychainRates)
router.get('/getKeychainRates', userController.getKeychainRates)
router.post('/updateKeychainRates', userController.updateKeychainRates)









module.exports = router;
