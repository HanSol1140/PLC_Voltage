
import ModbusRTU from 'modbus-serial'; // 모듈 추가
const client = new ModbusRTU();

const IP = '192.168.1.2';
const Port = 502;

// Modbus TCP로 연결
export const connectToPLC = async(IP:string, Port:number) => {
    try {
        await client.connectTCP(IP, { port: Port, timeout: 3000 });
        console.log('PLC에 연결됨');
    } catch (error) {
        console.error('PLC 연결 오류:', error);
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
        console.log(writeDataAddress + '포트에 값 설정 완료:', writeValue);
    } catch(error) {
        console.error('D1000 값을 쓰는 도중 오류 발생:', error);
    }
}





