"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScaleData = exports.loadScaleData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'SetScale.json';
let scaleData = { scale: 0 };
const loadScaleData = () => {
    if (!fs_1.default.existsSync(filePath)) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs_1.default.readFileSync(filePath, 'utf8');
        scaleData = fileData ? JSON.parse(fileData) : [];
    }
    catch (error) {
        console.error('Error reading file:', error);
    }
};
exports.loadScaleData = loadScaleData;
const getScaleData = () => {
    return scaleData;
};
exports.getScaleData = getScaleData;
