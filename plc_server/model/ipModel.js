"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIP = exports.setIPData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'SetIP.json';
const setIPData = (ip) => {
    const data = { plcIP: ip };
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
exports.setIPData = setIPData;
const getIP = () => {
    if (fs_1.default.existsSync(filePath)) {
        const data = fs_1.default.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};
exports.getIP = getIP;
