import express, { Request, Response, Router } from 'express';
import * as MeasureModel from '../model/measureModel.js';

export const setMeasure = (req:Request, res:Response) => {
    try {
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        MeasureModel.setMeasureData({ voltage, output });
        res.send("저장 완료");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const readMeasureList = (req:Request, res:Response) => {
    try {
        const data = MeasureModel.getMeasureData();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const saveEditMeasure = (req:Request, res:Response) => {
    try {
        const oldVoltage = Number(req.query.oldVoltage);
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        MeasureModel.editMeasureData(oldVoltage, { voltage, output });
        res.send("수정 완료");
    } catch (error) {
        console.error("error", error);
        res.status(500).send("서버 오류");
    }
}

export const deleteMeasure = (req:Request, res:Response) =>{
    try{
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        MeasureModel.deleteMeasureData(voltage, output);
        res.send("삭제 완료");
    }catch(error){
        console.log("error", error);
    }

}