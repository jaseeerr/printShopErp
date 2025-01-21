var express = require('express');
var router = express.Router();
const Data = require('../models/businessCardSchema')
const Auth = require('../auth/auth')
const userController = require('../controller/userController')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express WOkrin' });
});


router.post('/signup', userController.signup)
router.post('/login', userController.login)
router.post('/loginSu', Auth.userAuth, userController.loginSu)

router.put('/updatePassword',Auth.userAuth,userController.changePassword)


router.post('/addProduct',Auth.userAuth, userController.addProduct)
router.get('/getAllProducts',Auth.userAuth, userController.getAllProducts)
router.put('/editProduct/:id',Auth.userAuth, userController.editProduct)
router.get('/getProduct/:id',Auth.userAuth, userController.getProduct)
router.put('/stockout/:id',Auth.userAuth, userController.stockout)
router.put('/addStock/:id',Auth.userAuth, userController.addStock)





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

router.get('/getFlyerRates', userController.getFlyerRates)
router.post('/addFlyerRates', userController.addFlyerRates)
router.post('/updateFlyerRates', userController.updateFlyerRates)

router.get('/getWeddingCardRates', userController.getWeddingCardRates)
router.post('/addWeddingCardRates', userController.addWeddingCardRates)
router.post('/updateWeddingCardRates', userController.updateWeddingCardRates)




















module.exports = router;
