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
exports.getScale = exports.readScale = exports.setScale = void 0;
const ScaleModel = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/model/scaleModel.js"));
const setScale = (req, res) => {
    try {
        const inputScale = req.query.inputScale;
        const outputScale = req.query.outputScale;
        if (inputScale && outputScale) {
            ScaleModel.setScaleData(Number(inputScale), Number(outputScale));
            res.send("scale 설정 완료");
        }
        else {
            res.status(400).send("Invalid scale value");
        }
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.setScale = setScale;
const readScale = (req, res) => {
    try {
        const data = ScaleModel.getScaleData();
        res.send(data);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.readScale = readScale;
const getScale = () => {
    try {
        const data = ScaleModel.getScaleData();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.getScale = getScale;
