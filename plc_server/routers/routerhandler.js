"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
router.get('/API/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("테스트");
    console.log("테스트!!!!");
}));
router.get('/api/setscale', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scale = req.query.scale;
        if (!fs_1.default.existsSync('SetScale.json')) {
            fs_1.default.writeFileSync('SetScale.json', JSON.stringify([]));
        }
        // 파일에 쓰기
        fs_1.default.readFile('SetScale.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = [];
            const newData = {
                scale: Number(scale),
            };
            data.push(newData); // 새로운 데이터를 배열에 추가
            const jsonData = JSON.stringify(data, null, 2);
            fs_1.default.writeFileSync('SetScale.json', jsonData);
            console.log("scale 설정 완료");
            res.send("scale 설정 완료");
        });
        //
    }
    catch (error) {
        console.error('Error with API call:', error);
    }
}));
router.get('/api/setmeasure', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        if (!fs_1.default.existsSync('SetMeasure.json')) {
            fs_1.default.writeFileSync('SetMeasure.json', JSON.stringify([]));
        }
        fs_1.default.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const exists = data.some(item => item.voltage === voltage);
            if (exists) {
                return res.status(409).send("전압값이 중복입니다!");
            }
            else {
                const newData = { voltage, output };
                data.push(newData);
                // 오름차순 정렬
                data.sort((a, b) => a.voltage - b.voltage);
                const jsonData = JSON.stringify(data, null, 2);
                fs_1.default.writeFileSync('SetMeasure.json', jsonData);
                res.send("저장 완료");
            }
        });
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
}));
// 브라우저에 출력
router.get("/api/readscale", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.readFile('SetScale.json', 'utf8', (err, fileData) => {
        if (err)
            throw err;
        let data = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
}));
router.get("/api/readmeasurelist", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    fs_1.default.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
        if (err)
            throw err;
        let data = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
}));
// 수정
router.get('/api/saveeditmeasure', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldVoltage = Number(req.query.oldVoltage);
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        if (!fs_1.default.existsSync('SetMeasure.json')) {
            return res.status(404).send("파일을 찾을 수 없습니다.");
        }
        fs_1.default.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const index = data.findIndex(item => item.voltage === oldVoltage);
            if (index === -1) {
                return res.status(404).send("전압을 찾을 수 없습니다.");
            }
            const exists = data.some(item => item.voltage === voltage);
            if (exists && oldVoltage !== voltage) {
                return res.status(409).send("전압값이 중복입니다!");
            }
            data[index].voltage = voltage;
            data[index].output = output;
            // 오름차순 정렬
            data.sort((a, b) => a.voltage - b.voltage);
            const jsonData = JSON.stringify(data, null, 2);
            fs_1.default.writeFileSync('SetMeasure.json', jsonData);
            res.send(data);
        });
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
}));
// 삭제
router.get('/api/deletemeasure', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const oldVoltage = Number(req.query.oldVoltage);
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);
        if (!fs_1.default.existsSync('SetMeasure.json')) {
            return res.status(404).send("파일을 찾을 수 없습니다.");
        }
        fs_1.default.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err)
                throw err;
            let data = fileData ? JSON.parse(fileData) : [];
            const index = data.findIndex(item => item.voltage === oldVoltage);
            if (index === -1) {
                return res.status(404).send("전압을 찾을 수 없습니다.");
            }
            const exists = data.some(item => item.voltage === voltage);
            if (exists && oldVoltage !== voltage) {
                return res.status(400).send("전압값이 중복입니다!");
            }
            data[index].voltage = voltage;
            data[index].output = output;
            // 오름차순 정렬
            data.sort((a, b) => a.voltage - b.voltage);
            const jsonData = JSON.stringify(data, null, 2);
            fs_1.default.writeFileSync('SetMeasure.json', jsonData);
            res.send("수정 완료");
        });
    }
    catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
}));
exports.default = router;
