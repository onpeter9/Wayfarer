import express from 'express';
import Bookings from '../controllers/booking';
import Authorization from '../middlewares/authorization';

const router = express.Router();

/**
 * User can book a seat
 */
router.post('/bookings', Authorization.verifyUser, Bookings.bookTrip);

module.exports = router;
