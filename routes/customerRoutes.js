const express = require('express');

const router = express.Router();

const customerController = require('../controllers/customerController');

router.get('/', customerController.getAllApartments);

router.post('/', customerController.postSelectedApartments);

router.get('/apartment/:idApartment', customerController.getDetailedApartment);
router.post('/apartment/:idApartment', customerController.postNewReservation); // nueva

module.exports = router;