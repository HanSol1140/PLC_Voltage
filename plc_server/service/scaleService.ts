import fs from 'fs';
const filePath = 'SetScale.json';
interface ScaleData {
    scale : number,

}
let scaleData: ScaleData = { scale : 0};

export const loadScaleData = () => {
    if (!fs.existsSync(filePath)) {
        console.error("File not found");
        return;
    }

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        scaleData = fileData ? JSON.parse(fileData) : [];

    } catch (error) {
        console.error('Error reading file:', error);
    }
}

export const getScaleData = () => {
    return scaleData;
}