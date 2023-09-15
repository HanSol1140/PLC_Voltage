import * as PLCService from '/home/nanonix/PLC_Voltage/plc_server/service/plcService';

export const connect = (ip:string, port:number) => {
    try {
        PLCService.connectToPLC(ip, port);
    } catch (error) {
        console.error('Error:', error);
    }
}
export const readVoltage = async (readAddress:number) => {
    try {
        var data = await PLCService.readData(readAddress);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
export const writeVoltage = (inputAddress:number, inputValue:number) => {
    PLCService.writeData(inputAddress, inputValue);
    return;
}

export const readVoltageChoice = async (number:number ) => {
    try {
        var data = await PLCService.readData(number);
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
