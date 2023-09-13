import express, { Request, Response, Router } from 'express';
import * as ScaleModel from '../model/scaleModel.js';


export const setScale = (req:Request, res:Response) => {
    try {
        const scale = req.query.scale;
  
        if (scale) {
            ScaleModel.setScale(Number(scale));
            res.send("scale 설정 완료");
        } else {
            res.status(400).send("Invalid scale value");
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const readScale = async (req:Request, res:Response) => {
    try {
        const data = ScaleModel.getScale();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};


