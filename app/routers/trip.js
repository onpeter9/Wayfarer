import express from 'express';
import Trips from '../controllers/trip';
import Authorization from '../middlewares/authorization';

const router = express.Router();

/**
 * Admin can create trips
 */
router.post('/trips', Authorization.verifyAdmin, Trips.createTrip);

module.exports = router;
