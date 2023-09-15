import { useState, useCallback, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';

function Settings() {


    const [readVoltage, setReadVolatage] = useState([]);
    const [readOutput, setReadOutput] = useState([]);

    type MeasureData = {
        voltage: number,
        output: number,
        oldVoltage?: number,
    }
    const [readMeasureList, setReadMeasureList] = useState<MeasureData[]>([]);

    const [inputText, setInputText] = useState({
        readPLCIP: '',
        plcIP: '',
        maxVoltage: '',
        maxOutput: '',
        voltage: '',
        output: '',
        scale: 0,
    });
    // IP값 가져오기
    async function readPLCIP() {
        try {
            let response = await axios.get('http://localhost:8888/api/readplcip');
            if (response.status === 200) {
                console.log(response.data);
                setInputText(prevState => ({
                    ...prevState,
                    readPLCIP: response.data.plcIP
                }));
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    // scale값 가져오기
    async function readScale() {
        try {
            let response = await axios.get('http://localhost:8888/api/readscale');
            if (response.status === 200) {
                // console.log(response.data.scale);
                setInputText(prevState => ({
                    ...prevState,
                    scale: response.data.scale
                }));
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    // measure(측정)값 가져오기
    async function readMeasure() {
        try {
            let response = await axios.get('http://localhost:8888/api/readmeasurelist');
            if (response.status === 200) {
                setReadMeasureList(response.data);
                console.log(response.data);
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    useEffect(() => {
        readScale();
        readMeasure();
        readPLCIP();
    }, []);


    const onChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(e => {
        const { name, value } = e.target;
        setInputText(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        console.log(e.target.value);
    }, []);

    // IP 값 저장
    async function setPlcIP() {
        if (!inputText.plcIP) {
            alert("비어있는 값이 있습니다.");
            return
        }
        try {
            const response = await axios.get(`http://localhost:8888/api/setplcip`, {
                params: {
                    plcIP: inputText.plcIP
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                alert(response.data);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 스케일 값 저장
    async function setScale() {
        if (!inputText.maxVoltage || !inputText.maxOutput) {
            alert("비어있는 값이 있습니다.");
            return
        }
        var scale = parseFloat(inputText.maxOutput) / parseFloat(inputText.maxVoltage);

        setInputText(prevState => ({
            ...prevState,
            scale: scale
        }));

        try {
            const response = await axios.get(`http://localhost:8888/api/setscale`, {
                params: {
                    scale: scale
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                alert(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    }

    // 측정값 추가하기
    async function setMeasure() {
        if (!inputText.voltage || !inputText.output) {
            alert("비어있는 값이 있습니다.");
            return;
        }
        try {

            const response = await axios.get(`http://localhost:8888/api/setmeasure`, {
                params: {
                    voltage: inputText.voltage,
                    output: inputText.output
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                alert(response.data);
                readMeasure();
            }
        } catch (error:any) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            console.error(error);
        }
    }

    // 측정값 삭제
    async function deleteMeasure(voltage: number, output: number) {
        try {
            const response = await axios.get(`http://localhost:8888/api/deletemeasure`, {
                params: {
                    voltage,
                    output
                }
            });
            if (response.status === 200) {
                console.log(response.data);
                // alert(response.data);
                readMeasure();
            }
        } catch (error) {
            console.error("error", error);
        }
    }

    // 수정
    const [editInputText, setEditInputText] = useState<MeasureData>({
        voltage: 0,
        output: 0,
        oldVoltage: 0
    });

    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const onEditChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(e => {
        const { name, value } = e.target;
        setEditInputText(prevForm => ({
            ...prevForm,
            [name]: value
        }));
        // console.log(e.target.value);
    }, []);

    const startEditMeasure = (index: number, voltage: number, output: number) => {
        setEditInputText({
            voltage,
            output,
            oldVoltage: voltage // 현재 전압 값을 oldVoltage에 저장
        });
        setEditingIndex(index);
    };

    const saveEditMeasure = useCallback(async (index: number) => {
        try {
            const response = await axios.get(`http://localhost:8888/api/saveeditmeasure`, {
                params: {
                    oldVoltage: editInputText.oldVoltage,
                    voltage: editInputText.voltage,
                    output: editInputText.output
                }
            });
            if (response.status === 200) {
                // alert("수정된 전압 : " + response.data[index].voltage + "\n" + "수정된 출력 : " + response.data[index].output);
                readMeasure();
            }
        } catch (error:any) {
            if(error.response.status === 409){
                alert(error.response.data);
            }
            console.error('Error', error);
        }
        setEditingIndex(null); // 수정 모드 종료
    }, [editInputText]);

    const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
        if (e.key === 'Enter') {
            saveEditMeasure(editingIndex!);  // 현재 편집 중인 항목의 index를 사용
        }
    }, [saveEditMeasure, editingIndex]);
    

    return (
        <section id='Settings'>
            <div>
                <h3>IP 설정하기</h3>
                <ul className='ip'>
                    <li>IP 입력하기 <input type="text" id="plcIP" name="plcIP" placeholder='ex)192.168.1.2' value={inputText.plcIP} onChange={onChange}></input></li>
                    <li></li>
                    <li><button onClick={setPlcIP}>저장</button></li>
                </ul>
                <h3>ip : {inputText.readPLCIP}</h3><br />
                <h3>scale 얻기</h3>
                <ul className='scale'>
                    <li>최대 전압 <input type="number" id="maxVoltage" name="maxVoltage" placeholder='ex)330' value={inputText.maxVoltage} onChange={onChange} /></li>
                    <li>최대 출력 <input type="number" id="maxOutput" name="maxOutput" placeholder='ex)4000' value={inputText.maxOutput} onChange={onChange} /></li>
                    <li><button onClick={setScale}>저장</button></li>
                </ul>
                <h3>scale : {inputText.scale}</h3><br />

                <ul className='input'>
                    <h3>측정 값 추가하기</h3>
                    <ul className='inputname'>
                        <li>입력전압 </li>
                        <li>측정값 </li>
                    </ul>
                    <ul className='inputvalue'>
                        <li><input type="number" id="voltage" name="voltage" placeholder='입력전압' onChange={onChange} /></li>
                        <li><input type="number" id="output" name="output" placeholder='측정값' onChange={onChange} /></li>
                        <li><button onClick={setMeasure}>저장</button></li>
                    </ul>
                </ul>
            </div>
            <div id='line' />
            {/* ==================== */}
            <div className='measure'>
                <h3>입력한 측정리스트</h3>
                <ul className='measurename'>
                    <li><h4>전압</h4></li>
                    <li><h4>측정</h4></li>
                </ul>
                {readMeasureList.map((item, index) => (
                    editingIndex === index ? (
                        <ul className='measurelist' key={index}>
                            <li><input type="number" name="voltage" value={editInputText.voltage} onChange={onEditChange} onKeyDown={handleKeyPress}/></li>
                            <li><input type="number" name="output" value={editInputText.output} onChange={onEditChange} onKeyDown={handleKeyPress}/></li>
                            <li>
                                <button onClick={() => saveEditMeasure(index)}>저장</button>
                                <button onClick={() => setEditingIndex(null)}>취소</button>
                            </li>
                        </ul>
                    ) : (
                        <ul className='measurelist' key={index}>
                            <li><h4>{item.voltage}</h4></li>
                            <li><h4>{item.output}</h4></li>
                            <li>
                                <button onClick={() => startEditMeasure(index, item.voltage, item.output)}>수정</button>
                                <button onClick={() => deleteMeasure(item.voltage, item.output)}>삭제</button>
                            </li>
                        </ul>
                    )
                ))}
            </div>
        </section>
    );
};

export default Settings;