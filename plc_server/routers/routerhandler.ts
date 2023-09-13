import express, { Request, Response, Router } from 'express';
import axios from 'axios';
import fs from 'fs';

const router: Router = express.Router();

router.get('/API/test', async (req: Request, res: Response) => {
    res.send("테스트");
    console.log("테스트!!!!");
});


// scale 값 설정
type ScaleData = {
    scale: number
}
router.get('/api/setscale', async (req: Request, res: Response) => {
    try {
        const scale = req.query.scale;

        if (!fs.existsSync('SetScale.json')) {
            fs.writeFileSync('SetScale.json', JSON.stringify([]));
        }

        // 파일에 쓰기
        fs.readFile('SetScale.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data: ScaleData[] = [];
            const newData: ScaleData = {
                scale: Number(scale),
            };
            data.push(newData); // 새로운 데이터를 배열에 추가
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync('SetScale.json', jsonData);
            console.log("scale 설정 완료");
            res.send("scale 설정 완료");
        });
        //

    } catch (error) {
        console.error('Error with API call:', error);

    }
});


// 측정값 리스트 추가
type MeasureData = {
    voltage: number,
    output: number
}
router.get('/api/setmeasure', async (req: Request, res: Response) => {
    try {
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);

        if (!fs.existsSync('SetMeasure.json')) {
            fs.writeFileSync('SetMeasure.json', JSON.stringify([]));
        }

        fs.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data: MeasureData[] = fileData ? JSON.parse(fileData) : [];

            const exists = data.some(item => item.voltage === voltage);
            if (exists) {
                return res.status(409).send("전압값이 중복입니다!");
            } else {
                const newData: MeasureData = { voltage, output };
                data.push(newData);

                // 오름차순 정렬
                data.sort((a, b) => a.voltage - b.voltage);

                const jsonData = JSON.stringify(data, null, 2);
                fs.writeFileSync('SetMeasure.json', jsonData);
                res.send("저장 완료");
            }


        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
});


// 브라우저에 출력
router.get("/api/readscale", async (req: Request, res: Response) => {
    fs.readFile('SetScale.json', 'utf8', (err, fileData) => {
        if (err) throw err;
        let data: ScaleData[] = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
});

router.get("/api/readmeasurelist", async (req: Request, res: Response) => {
    fs.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
        if (err) throw err;
        let data: MeasureData[] = fileData ? JSON.parse(fileData) : [];
        res.send(data);
    });
});

// 수정
router.get('/api/saveeditmeasure', async (req: Request, res: Response) => {
    try {
        const oldVoltage = Number(req.query.oldVoltage);
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);

        if (!fs.existsSync('SetMeasure.json')) {
            return res.status(404).send("파일을 찾을 수 없습니다.");
        }

        fs.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data: MeasureData[] = fileData ? JSON.parse(fileData) : [];

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
            fs.writeFileSync('SetMeasure.json', jsonData);
            res.send(data);
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
});

// 삭제
router.get('/api/deletemeasure', async (req: Request, res: Response) => {
    try {
        const oldVoltage = Number(req.query.oldVoltage);
        const voltage = Number(req.query.voltage);
        const output = Number(req.query.output);

        if (!fs.existsSync('SetMeasure.json')) {
            return res.status(404).send("파일을 찾을 수 없습니다.");
        }

        fs.readFile('SetMeasure.json', 'utf8', (err, fileData) => {
            if (err) throw err;
            let data: MeasureData[] = fileData ? JSON.parse(fileData) : [];

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
            fs.writeFileSync('SetMeasure.json', jsonData);
            res.send("수정 완료");
        });
    } catch (error) {
        console.error('Error', error);
        res.status(500).send("서버 오류");
    }
});

export default router;

