import express, { Router } from 'express';
import * as ScaleController from '../controller/scaleController.js';

const router: Router = express.Router();

// scale 값 설정 및 브라우저에 출력
router.get('/api/setscale', ScaleController.setScale);
router.get("/api/readscale", ScaleController.readScale);

export default router;
