import express, { Router } from 'express';
import * as IPController from '../controller/ipController.js';

const router: Router = express.Router();

// scale 값 설정 및 브라우저에 출력
router.get('/api/setplcip', IPController.setIP);
router.get('/api/readplcip', IPController.readIP);
export default router;
