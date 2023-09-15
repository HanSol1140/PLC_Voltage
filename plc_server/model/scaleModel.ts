import fs from 'fs';
const filePath = 'SetScale.json';

export const setScaleData = (inputScale: number :outputScale:number) => {
    const data = {
        inputScale: inputScale,
        outputScale: outputScale
     };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getScaleData = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};

