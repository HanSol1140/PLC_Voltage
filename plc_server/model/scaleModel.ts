import fs from 'fs';
const filePath = 'SetScale.json';

export const setScale = (scaleValue: number) => {
    const data = { scale: scaleValue };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

export const getScale = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};

