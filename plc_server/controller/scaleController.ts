import { Request, Response, Router } from 'express';
import * as ScaleModel from '/home/nanonix/PLC_Voltage/plc_server/model/scaleModel.js';


export const setScale = (req:Request, res:Response) => {
    try {
        const inputScale = req.query.inputScale;
        const outputScale = req.query.outputScale;

  
        if (inputScale && outputScale) {
            ScaleModel.setScaleData(Number(inputScale), Number(outputScale));
            res.send("scale 설정 완료");
        } else {
            res.status(400).send("Invalid scale value");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const readScale = (req:Request, res:Response) => {
    try {
        const data = ScaleModel.getScaleData();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const getScale = () => {
    try {
        const data = ScaleModel.getScaleData();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
