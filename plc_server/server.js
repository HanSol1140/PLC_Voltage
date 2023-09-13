"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// 라우터
const scaleRoutes_js_1 = __importDefault(require("./routers/scaleRoutes.js"));
const measureRoutes_1 = __importDefault(require("./routers/measureRoutes"));
// 서비스
const measureService_js_1 = require("./service/measureService.js");
const scaleService_js_1 = require("./service/scaleService.js");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8888;
const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});
app.use('/', scaleRoutes_js_1.default);
app.use('/', measureRoutes_1.default);
// 서비스
// SetScale.json 메모리에 로드 
(0, scaleService_js_1.loadScaleData)();
var scale = (0, scaleService_js_1.getScaleData)().scale;
// console.log(scale);
// SetMeasure.json 메모리에 로드
(0, measureService_js_1.loadMeasureData)();
var measureData = (0, measureService_js_1.getMeasureData)();
// console.log(measureData);
// ====================================================================================================
// PLC 통신 설정
const modbus_serial_1 = __importDefault(require("modbus-serial")); // 모듈 추가
const client = new modbus_serial_1.default();
const plcIp = '192.168.1.2';
const plcPort = 502;
// Modbus TCP로 연결
function connectToPLC() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connectTCP(plcIp, { port: plcPort, timeout: 5000 });
            console.log('PLC에 연결됨');
        }
        catch (err) {
            console.error('PLC 연결 오류:', err);
        }
    });
}
function readD910() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("D910 읽기 시작");
            const value = yield client.readHoldingRegisters(910, 1);
            return value.data[0];
        }
        catch (err) {
            console.error('D910 값을 읽는 도중 오류 발생:', err);
        }
    });
}
function readD1000() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("D1000 읽기 시작");
            const value = yield client.readHoldingRegisters(1000, 1);
            return value.data[0];
        }
        catch (err) {
            console.error('D1000 값을 읽는 도중 오류 발생:', err);
        }
    });
}
// 값 쓰기
function writeD1000(value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("D1000 쓰기 시작");
            yield client.writeRegister(1000, value);
            console.log('D1000 포트에 값 설정 완료:', value);
        }
        catch (err) {
            console.error('D1000 값을 쓰는 도중 오류 발생:', err);
        }
    });
}
function writeToPLC() {
    return __awaiter(this, void 0, void 0, function* () {
        yield writeD1000(2222); // 1000번 레지스터의 값을 '111'로 설정
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectToPLC();
        const d920 = yield readD910();
        const d1000 = yield readD1000();
        console.log('D910 포트의 값:', d920);
        console.log('D1000 포트의 값:', d1000);
        // writeToPLC();
    });
}
main();
// 입력값 반환하기
function interpolate(inputValue) {
    // 첫 번째 값보다 작거나 같은 경우
    if (inputValue <= measureData[0].voltage) {
        return measureData[0].output;
    }
    // 마지막 값보다 크거나 같은 경우
    if (inputValue >= measureData[measureData.length - 1].voltage) {
        return measureData[measureData.length - 1].output;
    }
    for (let i = 0; i < measureData.length - 1; i++) {
        if (inputValue >= measureData[i].voltage && inputValue < measureData[i + 1].voltage) {
            const x1 = measureData[i].voltage;
            const y1 = measureData[i].output;
            const x2 = measureData[i + 1].voltage;
            const y2 = measureData[i + 1].output;
            // 선형 보간법
            const result = y1 + (inputValue - x1) * (y2 - y1) / (x2 - x1);
            // 소수점 둘째자리까지 반환
            return Math.round(result);
        }
    }
    // inputValue가 데이터의 범위 밖에 있는 경우 예외 처리
    throw new Error("입력 값이 데이터의 범위를 벗어났습니다.");
}
// console.log(interpolate(110)); // 60 - 330
