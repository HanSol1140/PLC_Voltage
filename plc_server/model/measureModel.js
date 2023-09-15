"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMeasureData = exports.editMeasureData = exports.getMeasureData = exports.setMeasureData = void 0;
const fs_1 = __importDefault(require("fs"));
const filePath = 'SetMeasure.json';
const setMeasureData = (data) => {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.writeFileSync(filePath, JSON.stringify([]));
    }
    const uploadData = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
    uploadData.push(data);
    uploadData.sort((a, b) => a.sendVoltage - b.sendVoltage);
    fs_1.default.writeFileSync(filePath, JSON.stringify(uploadData, null, 2));
};
exports.setMeasureData = setMeasureData;
const getMeasureData = () => {
    if (!fs_1.default.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
};
exports.getMeasureData = getMeasureData;
const editMeasureData = (oldSendVoltage, sendVoltage, receiveVoltage, vvcfVoltage) => {
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
    const index = data.findIndex((item) => item.sendVoltage === oldSendVoltage);
    if (index === -1) {
        throw new Error("전압을 찾을 수 없습니다.");
    }
    data[index] = {
        sendVoltage: sendVoltage,
        receiveVoltage: receiveVoltage,
        vvcfVoltage: vvcfVoltage,
    };
    x ``;
    data.sort((a, b) => a.sendVoltage - b.sendVoltage);
    fs_1.default.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
};
exports.editMeasureData = editMeasureData;
const deleteMeasureData = (sendVoltage) => {
    console.log(sendVoltage);
    if (!fs_1.default.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs_1.default.readFileSync(filePath, 'utf8'));
    const filterData = data.filter((item) => item.sendVoltage !== sendVoltage);
    data.sort((a, b) => a.sendVoltage - b.sendVoltage);
    if (data.length === filterData.length) {
        throw new Error("해당 전압 값이 목록에 없습니다.");
    }
    fs_1.default.writeFileSync(filePath, JSON.stringify(filterData, null, 2));
};
exports.deleteMeasureData = deleteMeasureData;
