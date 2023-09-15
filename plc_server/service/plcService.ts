
import ModbusRTU from 'modbus-serial'; // 모듈 추가
const client = new ModbusRTU();

const IP = '192.168.1.2';
const Port = 502;

// Modbus TCP로 연결



const MAX_RETRIES = 10; // 최대 재시도 횟수
const RETRY_INTERVAL = 5000; // 재시도 간격 (5초)

// Modbus TCP로 연결
export const connectToPLC = async(IP:string, Port:number) => {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        try {
            await client.connectTCP(IP, { port: Port, timeout: 3000 });
            console.log('PLC에 연결됨');
            return; // 연결 성공 시 함수를 종료합니다.
        } catch (error) {
            retries++;
            console.error(`PLC 연결 오류 (재시도 ${retries}/${MAX_RETRIES}):`, error);
            if (retries < MAX_RETRIES) {
                await new Promise(res => setTimeout(res, RETRY_INTERVAL)); // 일정 간격 후 재시도
            } else {
                console.error('최대 재시도 횟수를 초과했습니다. PLC 연결에 실패했습니다.');
            }
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





