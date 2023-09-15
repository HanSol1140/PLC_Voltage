import * as PLCService from '../service/plcService';

export const connect = (ip:string, port:number) => {
    try {
        PLCService.connectToPLC(ip, port);
    } catch (error) {
        console.error('Error:', error);
    }
}
export const readVoltage = async (ip:string, port:number) => {
    try {
        var data = await PLCService.readData(910);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
export const writeVoltage = (inputVoltage:number) => {
    PLCService.writeData(1000, inputVoltage);
    return;
}
export const readVoltage1120 = async (ip:string, port:number, number:number ) => {
    try {
        var data = await PLCService.readData(number);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}