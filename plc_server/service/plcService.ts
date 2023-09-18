
import ModbusRTU from 'modbus-serial'; // 모듈 추가
const client = new ModbusRTU();

const IP = '192.168.1.2';
const Port = 502;

// Modbus TCP로 연결
const RETRY_INTERVAL = 5000; // 재시도 간격 (5초)

// Modbus TCP로 연결 시도(연결될때까지)
export const connectToPLC = async(IP:string, Port:number) => {
    while (true) {
        try {
            await client.connectTCP(IP, { port: Port, timeout: 3000 });
            console.log('PLC에 연결됨');
            return; // 연결 성공 시 함수를 종료합니다.
        } catch (error) {
            console.error(`PLC 연결 오류, 재시도 중...:`, error);
            await new Promise(res => setTimeout(res, RETRY_INTERVAL)); // 일정 간격 후 재시도
        }
    }
}


export const readData = async(readDataAddress:number) => {
    try {
        const value = await client.readHoldingRegisters(readDataAddress, 1);
        return value.data[0];
    } catch(error) {
        console.error('값을 읽는 도중 오류 발생:', error);
    }
}


export const writeData = async(writeDataAddress:number, writeValue:number) => {
    try {
        await client.writeRegister(writeDataAddress, writeValue);
        console.log(writeDataAddress + '어드레스에 값 설정 완료:', writeValue);
    } catch(error) {
        console.error('값을 쓰는 도중 오류 발생:', error);
    }
}





