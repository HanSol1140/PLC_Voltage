"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScaleData = exports.setScaleData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = '/home/nanonix/PLC_Voltage/plc_server/SetScale.json';
const setScaleData = (inputScale, outputScale) => {
    const data = {
        inputScale: inputScale,
        outputScale: outputScale
    };
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.setScaleData = setScaleData;
const getScaleData = () => {
    if (fs_1.default.existsSync(filePath)) {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};
exports.getScaleData = getScaleData;
