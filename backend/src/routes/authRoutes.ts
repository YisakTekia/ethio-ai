import express from 'express';
import { subscribe, unsubscribe, renewal, login,checkPhone } from '../controllers/authController';

const router = express.Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.post('/renewal', renewal);

router.post('/login', login);
router.post('/check', checkPhone);

export default router;