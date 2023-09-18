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
const path_1 = __importDefault(require("path"));
// 라우터
const ipRoutes_js_1 = __importDefault(require("/home/nanonix/PLC_Voltage/plc_server/routers/ipRoutes.js"));
const scaleRoutes_js_1 = __importDefault(require("/home/nanonix/PLC_Voltage/plc_server/routers/scaleRoutes.js"));
const measureRoutes_js_1 = __importDefault(require("/home/nanonix/PLC_Voltage/plc_server/routers/measureRoutes.js"));
// 컨트롤러 호출
const IPController = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/controller/ipController.js"));
const MeasureController = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/controller/measureController.js"));
const ScaleController = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/controller/scaleController.js"));
const PLC = __importStar(require("/home/nanonix/PLC_Voltage/plc_server/controller/plcController.js"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 8888;
const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});
// 리액트 페이지 접속
// 라우터 분리
app.use('/', ipRoutes_js_1.default);
app.use('/', scaleRoutes_js_1.default);
app.use('/', measureRoutes_js_1.default);
// 리액트 페이지 staic 설정
app.use(express_1.default.static('/home/nanonix/PLC_Voltage/plc_server/build/'));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '/home/nanonix/PLC_Voltage/plc_server/build', 'index.html'));
});
// 모든경로 index.html로 라우팅(SPA)
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '/home/nanonix/PLC_Voltage/plc_server/build/index.html'));
// });
// SetIP.json 메모리에 로드
const plcIP = IPController.getIP().plcIP;
// console.log("PLC의 IP : " + plcIP);
// SetScale.json 메모리에 로드
var inputScale = ScaleController.getScale().inputScale;
var outputScale = ScaleController.getScale().outputScale;
// console.log("스케일 : " + scale);
// SetMeasure.json 메모리에 로드
var measureData = MeasureController.getMeasureList();
console.log(measureData);
// console.log("측정값중 제일 낮은 전압 : " + measureData[0].voltage);
// ====================================================================================================
// PLC 통신 설정
// 5초마다 접속시도, 5번까지 시도함
PLC.connect(plcIP, 502);
let previousVoltage = 0;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    var inputVoltage = yield PLC.readVoltage(910); // 910번을 읽음
    console.log("inputVoltage : " + inputVoltage + " // previousVoltage : " + previousVoltage);
    if (inputVoltage !== undefined && inputVoltage !== previousVoltage) {
        previousVoltage = inputVoltage;
        dataChange(inputVoltage);
    }
}), 1000);
// ====================================================================================================
// ====================================================================================================
// 입력값 반환하기
function dataChange(inputValue) {
    return __awaiter(this, void 0, void 0, function* () {
        if (inputValue < measureData[0].sendVoltage || inputValue > measureData[measureData.length - 1].sendVoltage) {
            console.log("설정된 값의 범위를 벗어났습니다.");
            return -1;
        }
        for (let i = 0; i < measureData.length - 1; i++) {
            if (inputValue >= measureData[i].sendVoltage && inputValue < measureData[i + 1].sendVoltage) {
                const prevVoltage = measureData[i].sendVoltage;
                const nextVoltage = measureData[i + 1].sendVoltage;
                const prevReceiveVoltage = measureData[i].receiveVoltage;
                const nextReceiveVoltage = measureData[i + 1].receiveVoltage;
                const prevVVCFVoltage = measureData[i].vvcfVoltage;
                const nextVVCFVoltage = measureData[i + 1].vvcfVoltage;
                // 전송값 만들어서 D1000에 쓰기
                let VVCFVoltage = prevVVCFVoltage;
                // if(inputValue - prevVoltage > 0){
                for (var j = 0; j < inputValue - prevVoltage; j++) {
                    VVCFVoltage = VVCFVoltage + (nextVVCFVoltage - prevVVCFVoltage) / (nextVoltage - prevVoltage);
                }
                // }
                let multiple = (inputValue * inputScale) / VVCFVoltage;
                const D1000 = Math.round(inputValue * multiple);
                PLC.writeVoltage(1000, D1000);
                console.log("D1000에 입력" + D1000);
                // 돌아오는 값 보정해서 D1500에 쓰기
                var onePoint = (nextReceiveVoltage - prevReceiveVoltage) / (nextVoltage - prevVoltage);
                // 현재 넣은 값의 반환값
                var intputReceiveVoltage = prevReceiveVoltage + ((inputValue - prevVoltage) * onePoint);
                var convertScale = intputReceiveVoltage / outputScale;
                var calibration = VVCFVoltage / convertScale;
                const D1500 = Math.round((calibration * convertScale) * 10);
                PLC.writeVoltage(1500, D1500);
                console.log("D1500에 입력" + D1500);
            }
        }
    });
}
