import fs from 'fs';
const filePath = 'SetMeasure.json';
interface MeasuerData {
    voltage : number,
    output : number
}
let measureData: MeasuerData[] = [];

export const loadMeasureData = () => {
    if (!fs.existsSync(filePath)) {
        console.error("File not found");
        return;
    }
    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        measureData = fileData ? JSON.parse(fileData) : [];

    } catch (error) {
        console.error('Error reading file:', error);
    }
}

export const getMeasureData = () => {
    return measureData;
}