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
exports.getIP = exports.readIP = exports.setIP = void 0;
const IPModel = __importStar(require("../model/ipModel.js"));
const setIP = (req, res) => {
    try {
        console.log("ip저장시도");
        const ip = req.query.plcIP;
        console.log(ip);
        IPModel.setIPData(String(ip));
        res.send("IP저장 완료");
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.setIP = setIP;
const readIP = (req, res) => {
    try {
        const data = IPModel.getIP();
        res.send(data);
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).send("서버 오류");
    }
};
exports.readIP = readIP;
const getIP = () => {
    try {
        const data = IPModel.getIP();
        return data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};
exports.getIP = getIP;
