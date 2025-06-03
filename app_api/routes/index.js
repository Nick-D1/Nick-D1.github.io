const express = require("express");
const router = express.Router();

const TripsController = require("../controllers/trips");

router
.route("/trips")
.get(TripsController.tripsList);

router
    .route('/trips/:tripCode')
    .get(TripsController.tripsFindByCode);
    

module.exports = router;
