import express from 'express';
import cors from 'cors';
// 라우터
import scaleRoutes from './routers/scaleRoutes.js';
import measureRoutes from './routers/measureRoutes';
// 서비스
import { loadMeasureData, getMeasureData } from './service/measureService.js';
import { loadScaleData, getScaleData } from './service/scaleService.js';
const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8888;


const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});

app.use('/', scaleRoutes);
app.use('/', measureRoutes);

// 서비스
// SetScale.json 메모리에 로드 
loadScaleData();
var scale = getScaleData().scale;
// console.log(scale);

// SetMeasure.json 메모리에 로드
loadMeasureData();
var measureData = getMeasureData();
// console.log(measureData);

// ====================================================================================================
// PLC 통신 설정
import ModbusRTU from 'modbus-serial'; // 모듈 추가
const client = new ModbusRTU();

const plcIp = '192.168.1.2';
const plcPort = 502;

// Modbus TCP로 연결
async function connectToPLC() {
    try {
        await client.connectTCP(plcIp, { port: plcPort, timeout: 5000 });
        console.log('PLC에 연결됨');
    } catch (err) {
        console.error('PLC 연결 오류:', err);
    }
}
async function readD910() {
    try {
        console.log("D910 읽기 시작");
        const value = await client.readHoldingRegisters(910, 1);
        return value.data[0];
    } catch(err) {
        console.error('D910 값을 읽는 도중 오류 발생:', err);
    }
}

async function readD1000() {
    try {
        console.log("D1000 읽기 시작");
        const value = await client.readHoldingRegisters(1000, 1);
        return value.data[0];
    } catch(err) {
        console.error('D1000 값을 읽는 도중 오류 발생:', err);
    }
}


// 값 쓰기
async function writeD1000(value:number) {
    try {
        console.log("D1000 쓰기 시작");
        await client.writeRegister(1000, value);
        console.log('D1000 포트에 값 설정 완료:', value);
    } catch(err) {
        console.error('D1000 값을 쓰는 도중 오류 발생:', err);
    }
}
async function writeToPLC() {
    await writeD1000(2222); // 1000번 레지스터의 값을 '111'로 설정
}

async function main() {
    await connectToPLC();
    const d920 = await readD910();
    const d1000 = await readD1000();
    console.log('D910 포트의 값:', d920);
    console.log('D1000 포트의 값:', d1000);
    // writeToPLC();

}
main();



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


