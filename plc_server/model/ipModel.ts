import fs from 'fs';
const filePath = 'SetIP.json';

export const setIPData = (ip:string) => {
    const data = { plcIP: ip };
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
export const getIP = () => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    }
    return null;
};  