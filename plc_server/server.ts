import express from 'express';
import cors from 'cors';
// 라우터
import ipRoutes from './routers/ipRoutes';
import scaleRoutes from './routers/scaleRoutes';
import measureRoutes from './routers/measureRoutes';

// 컨트롤러 호출
import * as IPController from './controller/ipController';
import * as MeasureController from './controller/measureController';
import * as ScaleController from './controller/scaleController';
import * as PLC from './controller/plcController';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8888;


const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});

// 
app.use('/', ipRoutes);
app.use('/', scaleRoutes);
app.use('/', measureRoutes);

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
let previousVoltage:any = 0;

setInterval(async() => {
    var inputVoltage = await PLC.readVoltage(plcIP, 502); // 910번을 읽음
    var inputVoltage2 = await PLC.readVoltage1120(plcIP, 502, 620); // 1120 읽음
    console.log(inputVoltage2);
    console.log("inputVoltage : " + inputVoltage + " // previousVoltage : " + previousVoltage );
    if(inputVoltage !== undefined && inputVoltage !== previousVoltage){    
        previousVoltage = inputVoltage;
        // PLC.writeVoltage(interpolate(inputVoltage)); // 1000번에 값 넣기
        PLC.writeVoltage(732); // 1000번에 값 넣기
        // console.log(interpolate(inputVoltage));
    }
}, 1000);

// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================
// ====================================================================================================

interface MeasureData {
    voltage: number;
    output: number;
}
// 입력값 반환하기
function interpolate(inputValue: number): number {
    if(inputValue < measureData[0].voltage || inputValue > measureData[measureData.length - 1].voltage){
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
            const result = (inputValue * scale) + (x2 - x1)*scale
            // 소수점 둘째자리까지 반환
            return Math.round(result);
        }
    }

    // inputValue가 데이터의 범위 밖에 있는 경우 예외 처리
    return -1;
}