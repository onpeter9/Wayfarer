import express from 'express';
import Users from '../controllers/user';

const router = express.Router();


/**
 * User can signup
 */
router.post('/auth/signup', Users.signUp);

module.exports = router;
