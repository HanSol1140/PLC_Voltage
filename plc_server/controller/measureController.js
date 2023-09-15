"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasureList = exports.deleteMeasure = exports.saveEditMeasure = exports.readMeasureList = exports.setMeasure = void 0;
const MeasureModel = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/model/measureModel.js"));
const setMeasure = (req, res) => {
    try {
        const sendVoltage = Number(req.query.sendVoltage);
        const receiveVoltage = Number(req.query.receiveVoltage);
        const vvcfVoltage = Number(req.query.vvcfVoltage);
        MeasureModel.setMeasureData({ sendVoltage, receiveVoltage, vvcfVoltage });
        res.send("측정값 저장 완료");
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.setMeasure = setMeasure;
const readMeasureList = (req, res) => {
    try {
        const data = MeasureModel.getMeasureData();
        res.send(data);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.readMeasureList = readMeasureList;
const saveEditMeasure = (req, res) => {
    try {
        const oldSendVoltage = Number(req.query.oldSendVoltage);
        const receiveVoltage = Number(req.query.receiveVoltage);
        const sendVoltage = Number(req.query.sendVoltage);
        const vvcfVoltage = Number(req.query.vvcfVoltage);
        const data = MeasureModel.editMeasureData(oldSendVoltage, sendVoltage, receiveVoltage, vvcfVoltage);
        res.send(data);
    }
    catch (error) {
        console.error("error", error);
        res.status(500).send("서버 오류");
    }
};
exports.saveEditMeasure = saveEditMeasure;
const deleteMeasure = (req, res) => {
    try {
        const sendVoltage = Number(req.query.sendVoltage);
        MeasureModel.deleteMeasureData(sendVoltage);
        res.send("삭제 완료");
    }
    catch (error) {
        console.log("error", error);
    }
};
exports.deleteMeasure = deleteMeasure;
const getMeasureList = () => {
    try {
        const data = MeasureModel.getMeasureData();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.getMeasureList = getMeasureList;
