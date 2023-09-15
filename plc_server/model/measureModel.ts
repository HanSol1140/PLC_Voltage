import fs from 'fs';
const filePath = 'SetMeasure.json';
interface MeasuerData {
    voltage : number,
    output : number
}
export const setMeasureData = (data: MeasuerData) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    }
    const uploadData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    uploadData.push(data);
    uploadData.sort((a: {voltage: number, output: number}, b: {voltage: number, output: number}) => a.voltage - b.voltage);
    fs.writeFileSync(filePath, JSON.stringify(uploadData, null, 2));
}

export const getMeasureData = () => {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export const editMeasureData = (oldVoltage:number, newMeasureData: { voltage: number, output: number }) => {

    if (!fs.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const index = data.findIndex((item: { voltage: number, output: number }) => item.voltage === oldVoltage);
    if (index === -1) {
        throw new Error("전압을 찾을 수 없습니다.");
    }
    data[index] = newMeasureData;
    data.sort((a: { voltage: number }, b: { voltage: number }) => a.voltage - b.voltage);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export const deleteMeasureData = (voltage:number, output:number) =>{
    console.log("voltage:", voltage);
    console.log("output:", output);
    if (!fs.existsSync(filePath)) {
        throw new Error("파일을 찾을 수 없습니다.");
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const filterData = data.filter((item: { voltage: number, output: number }) => item.voltage !== voltage);
    filterData.sort((a: { voltage: number }, b: { voltage: number }) => a.voltage - b.voltage);
    
    if (data.length === filterData.length) {
        throw new Error("해당 전압 값이 목록에 없습니다.");
    }
    
    fs.writeFileSync(filePath, JSON.stringify(filterData, null, 2));
}
