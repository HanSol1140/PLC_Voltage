import fs from 'fs';
const filePath = '/home/nanonix/PLC_Voltage/plc_server/SetMeasure.json';
interface MeasuerData {
    sendVoltage: number,
    receiveVoltage : number,
    vvcfVoltage : number
}
export const setMeasureData = (data: MeasuerData) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const uploadData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    uploadData.push(data);
    uploadData.sort((a: {sendVoltage: number}, b: {sendVoltage: number}) => a.sendVoltage - b.sendVoltage);
    fs.writeFileSync(filePath, JSON.stringify(uploadData, null, 2));
}

export const getMeasureData = () => {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export const editMeasureData = (oldSendVoltage:number, sendVoltage: number, receiveVoltage: number, vvcfVoltage: number) => {

    if (!fs.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = data.findIndex((item: { sendVoltage: number, receiveVoltage: number, vvcfVoltage:number }) => item.sendVoltage === oldSendVoltage);
    if (index === -1) {
        throw new Error("전압을 찾을 수 없습니다.");
    }
    data[index] = {
        sendVoltage: sendVoltage,
        receiveVoltage: receiveVoltage,
        vvcfVoltage: vvcfVoltage,
    };

    data.sort((a: { sendVoltage: number }, b: { sendVoltage: number }) => a.sendVoltage - b.sendVoltage);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
}

export const deleteMeasureData = (sendVoltage:number) =>{
    console.log(sendVoltage);
    if (!fs.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filterData = data.filter((item: { sendVoltage: number }) => item.sendVoltage !== sendVoltage);
    data.sort((a: { sendVoltage: number }, b: { sendVoltage: number }) => a.sendVoltage - b.sendVoltage);

    
    if (data.length === filterData.length) {
        throw new Error("해당 전압 값이 목록에 없습니다.");
    } 
    fs.writeFileSync(filePath, JSON.stringify(filterData, null, 2));
}
