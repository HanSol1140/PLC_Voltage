"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeasureData = exports.loadMeasureData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'SetMeasure.json';
let measureData = [];
const loadMeasureData = () => {
    if (!fs_1.default.existsSync(filePath)) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        measureData = fileData ? JSON.parse(fileData) : [];
    }
    catch (error) {
        console.error('Error reading file:', error);
    }
};
exports.loadMeasureData = loadMeasureData;
const getMeasureData = () => {
    return measureData;
};
exports.getMeasureData = getMeasureData;
