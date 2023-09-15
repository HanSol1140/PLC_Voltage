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
const ipRoutes_1 = __importDefault(require("./routers/ipRoutes"));
const scaleRoutes_1 = __importDefault(require("./routers/scaleRoutes"));
const measureRoutes_1 = __importDefault(require("./routers/measureRoutes"));
// 컨트롤러 호출
const IPController = __importStar(require("./controller/ipController"));
const MeasureController = __importStar(require("./controller/measureController"));
const ScaleController = __importStar(require("./controller/scaleController"));
const PLC = __importStar(require("./controller/plcController"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8888;
const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});
// 
app.use('/', ipRoutes_1.default);
app.use('/', scaleRoutes_1.default);
app.use('/', measureRoutes_1.default);
// SetIP.json 메모리에 로드
const plcIP = IPController.getIP().plcIP;
// console.log("PLC의 IP : " + plcIP);
// SetScale.json 메모리에 로드
var scale = ScaleController.getScale().scale;
// console.log("스케일 : " + scale);
// SetMeasure.json 메모리에 로드
var measureData = MeasureController.getMeasureList();
// console.log("측정값중 제일 낮은 전압 : " + measureData[0].voltage);
// 1120 => 910에서 읽어서 넣는 값
// ====================================================================================================
// PLC 통신 설정
PLC.connect(plcIP, 502);
let previousVoltage = 0;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    var inputVoltage = yield PLC.readVoltage(plcIP, 502); // 910번을 읽음
    var inputVoltage2 = yield PLC.readVoltage1120(plcIP, 502, 620); // 1120 읽음
    console.log(inputVoltage2);
    console.log("inputVoltage : " + inputVoltage + " // previousVoltage : " + previousVoltage);
    if (inputVoltage !== undefined && inputVoltage !== previousVoltage) {
        previousVoltage = inputVoltage;
        // PLC.writeVoltage(interpolate(inputVoltage)); // 1000번에 값 넣기
        PLC.writeVoltage(732); // 1000번에 값 넣기
        // console.log(interpolate(inputVoltage));
    }
}), 1000);
// 입력값 반환하기
function interpolate(inputValue) {
    if (inputValue < measureData[0].voltage || inputValue > measureData[measureData.length - 1].voltage) {
        console.log("입력한 값의 범위를 벗어났습니다.");
        return -1;
    }
    // 첫 번째 값인 경우
    if (inputValue == measureData[0].voltage) {
        const result = measureData[0].output;
        return Math.round(result);
    }
    // 마지막 값보다 큰 경우
    if (inputValue == measureData[measureData.length - 1].voltage) {
        const result = measureData[measureData.length - 1].output;
        return Math.round(result);
    }
    for (let i = 0; i < measureData.length - 1; i++) {
        if (inputValue >= measureData[i].voltage && inputValue < measureData[i + 1].voltage) {
            const x1 = measureData[i].voltage;
            const y1 = measureData[i].output;
            const x2 = measureData[i + 1].voltage;
            const y2 = measureData[i + 1].output;
            // 선형 보간법
            const result = (inputValue * scale) + (x2 - x1) * scale;
            // 소수점 둘째자리까지 반환
            return Math.round(result);
        }
    }
    // inputValue가 데이터의 범위 밖에 있는 경우 예외 처리
    return -1;
}
