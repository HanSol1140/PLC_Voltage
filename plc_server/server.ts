import express from 'express';
import cors from 'cors';
import path from 'path';
// 라우터
import ipRoutes from '/home/nanonix/PLC_Voltage/plc_server/routers/ipRoutes';
import scaleRoutes from '/home/nanonix/PLC_Voltage/plc_server/routers/scaleRoutes';
import measureRoutes from '/home/nanonix/PLC_Voltage/plc_server/routers/measureRoutes';

// 컨트롤러 호출
import * as IPController from '/home/nanonix/PLC_Voltage/plc_server/controller/ipController';
import * as MeasureController from '/home/nanonix/PLC_Voltage/plc_server/controller/measureController';
import * as ScaleController from '/home/nanonix/PLC_Voltage/plc_server/controller/scaleController';
import * as PLC from '/home/nanonix/PLC_Voltage/plc_server/controller/plcController';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8888;


const server = app.listen(PORT, () => {
    console.log("서버시작 : PORT " + PORT);
});

// 리액트 페이지 접속
app.use(express.static('build'));
app.get('/', (req, res) => {
    res.redirect('//home/nanonix/PLC_Voltage/plc_server/build');
});

// 라우터 분리
app.use('/', ipRoutes);
app.use('/', scaleRoutes);
app.use('/', measureRoutes);

// 모든경로 index.html로 라우팅(SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/home/nanonix/PLC_Voltage/plc_server/build/index.html'), function(err){
        if(err){
            res.status(500).send(err);
        }
    });
});

 

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

let previousVoltage:any = 0;

setInterval(async() => {
    var inputVoltage = await PLC.readVoltage(910); // 910번을 읽음
    console.log("inputVoltage : " + inputVoltage + " // previousVoltage : " + previousVoltage );
    if(inputVoltage !== undefined && inputVoltage !== previousVoltage){    
        previousVoltage = inputVoltage;
        dataChange(inputVoltage);
    }
}, 1000);

// ====================================================================================================
// ====================================================================================================


// 입력값 반환하기
async function dataChange (inputValue: number) {
    if(inputValue < measureData[0].sendVoltage || inputValue > measureData[measureData.length - 1].sendVoltage){
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
                for(var j = 0; j < inputValue - prevVoltage; j++){
                    VVCFVoltage = VVCFVoltage + (nextVVCFVoltage-prevVVCFVoltage) / (nextVoltage - prevVoltage);
                }
            // }
            let multiple =  (inputValue * inputScale) / VVCFVoltage;
            const D1000 = Math.round(inputValue * multiple);
            PLC.writeVoltage(1000, D1000);
            console.log("D1000에 입력" + D1000);


            // 돌아오는 값 보정해서 D1500에 쓰기
            var onePoint = (nextReceiveVoltage - prevReceiveVoltage) / (nextVoltage - prevVoltage);
            // 현재 넣은 값의 반환값
            var intputReceiveVoltage = prevReceiveVoltage + ((inputValue - prevVoltage) * onePoint);
            
            var convertScale = intputReceiveVoltage / inputScale;

            var calibration = VVCFVoltage/convertScale;

            const D1500 = Math.round((calibration * convertScale) * 10);
            PLC.writeVoltage(1500, D1500);
            console.log("D1500에 입력" + D1500);
        }
    }
}