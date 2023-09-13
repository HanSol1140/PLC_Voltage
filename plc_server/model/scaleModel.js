"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScale = exports.setScale = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'SetScale.json';
const setScale = (scaleValue) => {
    const data = { scale: scaleValue };
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.setScale = setScale;
const getScale = () => {
    if (fs_1.default.existsSync(filePath)) {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};
exports.getScale = getScale;
