import express, { Request, Response, Router } from 'express';
import * as MeasureModel from '../model/measureModel.js';

export const setMeasure = (req:Request, res:Response) => {
    try {
        const sendVoltage = Number(req.query.sendVoltage);
        const receiveVoltage = Number(req.query.receiveVoltage);
        const vvcfVoltage = Number(req.query.vvcfVoltage);
        MeasureModel.setMeasureData({ sendVoltage, receiveVoltage, vvcfVoltage });
        res.send("측정값 저장 완료");
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
        const oldSendVoltage = Number(req.query.oldSendVoltage);
        const receiveVoltage = Number(req.query.receiveVoltage);
        const sendVoltage = Number(req.query.sendVoltage);
        const vvcfVoltage = Number(req.query.vvcfVoltage);
        const data = MeasureModel.editMeasureData(oldSendVoltage, sendVoltage, receiveVoltage, vvcfVoltage);
        res.send(data);
    } catch (error) {
        console.error("error", error);
        res.status(500).send("서버 오류");
    }
}

export const deleteMeasure = (req:Request, res:Response) =>{
    try{
        const sendVoltage = Number(req.query.sendVoltage);
        MeasureModel.deleteMeasureData(sendVoltage);
        res.send("삭제 완료");
    }catch(error){
        console.log("error", error);
    }

}
export const getMeasureList = () => {
    try {
        const data = MeasureModel.getMeasureData();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}