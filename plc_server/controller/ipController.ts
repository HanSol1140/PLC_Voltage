import { Request, Response, Router } from 'express';
import * as IPModel from '../model/ipModel.js';


export const setIP = (req:Request, res:Response) => {
    try {
        console.log("ip저장시도");
        const ip = req.query.plcIP;
        console.log(ip);
        IPModel.setIPData(String(ip));
        res.send("IP저장 완료");
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};  

export const readIP = (req:Request, res:Response) => {
    try {
        const data = IPModel.getIP();
        res.send(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};

export const getIP = () => {
    try {
        const data = IPModel.getIP();
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
};