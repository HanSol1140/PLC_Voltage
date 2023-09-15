import express, { Router } from 'express';
import * as MeasureController from '/home/nanonix/PLC_Voltage/plc_server/controller/measureController.js';

const router: Router = express.Router();

// scale 값 설정 및 브라우저에 출력
router.get('/api/setmeasure', MeasureController.setMeasure);
router.get("/api/readmeasurelist", MeasureController.readMeasureList);
router.get("/api/saveeditmeasure", MeasureController.saveEditMeasure);
router.get("/api/deletemeasure", MeasureController.deleteMeasure);

export default router;