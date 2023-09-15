import { useState, useCallback, useEffect } from 'react';
import './Settings.css';
import axios from 'axios';

function Settings() {


    const [readVoltage, setReadVolatage] = useState([]);
    const [readOutput, setReadOutput] = useState([]);

    type MeasureData = {
        oldSendVoltage? :number,
        sendVoltage: number,
        receiveVoltage: number,
        vvcfVoltage: number,
    }
    const [readMeasureList, setReadMeasureList] = useState<MeasureData[]>([]);

    const [inputText, setInputText] = useState({
        readPLCIP: '',
        plcIP: '',
        inputScaleVoltage: '',
        inputScaleOutput: '',
        outputScaleVoltage: '',
        outputScaleOutput: '',
        sendVoltage: '',
        vvcfVoltage: '',
        receiveVoltage: '',
        inputScale: 0,
        outputScale: 0
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
                    inputScale: response.data.inputScale,
                    outputScale: response.data.outputScale,
                    
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
        if (!inputText.inputScaleVoltage || !inputText.inputScaleOutput || !inputText.outputScaleVoltage || !inputText.outputScaleVoltage) {
            alert("비어있는 값이 있습니다.");
            return
        }
        const inputScale = parseFloat(inputText.inputScaleOutput) / parseFloat(inputText.inputScaleVoltage);
        const outputScale = parseFloat(inputText.outputScaleOutput) / parseFloat(inputText.outputScaleVoltage);
        console.log(inputScale);
        console.log(outputScale);
        setInputText(prevState => ({
            ...prevState,
            inputScale: inputScale,
            outputScale: outputScale
        }));

        try {
            const response = await axios.get(`http://localhost:8888/api/setscale`, {
                params: {
                    inputScale: inputScale,
                    outputScale: outputScale
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
        if (!inputText.sendVoltage || !inputText.vvcfVoltage || !inputText.receiveVoltage) {
            alert("비어있는 값이 있습니다.");
            return;
        }
        try {

            const response = await axios.get(`http://localhost:8888/api/setmeasure`, {
                params: {
                    sendVoltage: inputText.sendVoltage,
                    receiveVoltage: inputText.receiveVoltage,
                    vvcfVoltage: inputText.vvcfVoltage,
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
    async function deleteMeasure(sendVoltage: number) {
        try {
            const response = await axios.get(`http://localhost:8888/api/deletemeasure`, {
                params: {
                    sendVoltage,
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
        sendVoltage: 0,
        receiveVoltage: 0,
        vvcfVoltage: 0,
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

    const startEditMeasure = (index: number, sendVoltage: number, receiveVoltage: number, vvcfVoltage:number) => {
        setEditInputText({
            sendVoltage,
            receiveVoltage,
            vvcfVoltage,
            oldSendVoltage: sendVoltage,
        });
        setEditingIndex(index);
    };

    const saveEditMeasure = useCallback(async (index: number) => {
        try {
            console.log(editInputText.sendVoltage);
            console.log(editInputText.receiveVoltage);
            console.log(editInputText.vvcfVoltage);
            const response = await axios.get(`http://localhost:8888/api/saveeditmeasure`, {
                params: {
                    oldSendVoltage: editInputText.oldSendVoltage,
                    sendVoltage: editInputText.sendVoltage,
                    receiveVoltage: editInputText.receiveVoltage,
                    vvcfVoltage: editInputText.vvcfVoltage,
                }
            });
            if (response.status === 200) {
                alert("수정된 전압 : " + response.data[index].sendVoltage + "\n"
                    + "수정된 수신값 : " + response.data[index].receiveVoltage + "\n"
                    + "수정된 V.V.C.F 측정값 : " + response.data[index].vvcfVoltage
                );
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
                <div className='scale'>
                    <ul >
                        <li>Input 아날로그값 <input type="number" id="inputScaleOutput" name="inputScaleOutput" placeholder='ex)4000' value={inputText.inputScaleOutput} onChange={onChange} /></li>
                        <li>Input 전압 <input type="number" id="inputScaleVoltage" name="inputScaleVoltage" placeholder='ex)330' value={inputText.inputScaleVoltage} onChange={onChange} /></li>
                        <h3>Scale : {inputText.inputScale}</h3><br />
                    </ul>
                    <ul>
                        <li>Output 아날로그값 <input type="number" id="outputScaleOutput" name="outputScaleOutput" placeholder='ex)4000' value={inputText.outputScaleOutput} onChange={onChange} /></li>
                        <li>Output 전압 <input type="number" id="outputScaleVoltage" name="outputScaleVoltage" placeholder='ex)330' value={inputText.outputScaleVoltage} onChange={onChange} /></li>
                        <h3>Scale : {inputText.outputScale}</h3><br />
                    </ul>
                    <button onClick={setScale}>저장</button>
                </div><br/>

                <ul className='input'>
                    <h3>측정 값 추가하기</h3>
                    <ul className='inputname'>
                        <li>입력값 </li>
                        <li>수신값 </li>
                        <li>V.V.C.F값 </li>
                    </ul>
                    <ul className='inputvalue'>
                        <li><input type="number" id="sendVoltage" name="sendVoltage" placeholder='ex) 60' onChange={onChange} /></li>
                        <li><input type="number" id="receiveVoltage" name="receiveVoltage" placeholder='ex) 65.8' onChange={onChange} /></li>
                        <li><input type="number" id="vvcfVoltage" name="vvcfVoltage" placeholder='ex) 809' onChange={onChange} /></li>
                        <li><button onClick={setMeasure}>저장</button></li>
                    </ul>
                </ul>
            </div>
            <div id='line' />
            {/* ==================== */}
            <div className='measure'>
                <h3>입력한 측정리스트</h3>
                <ul className='measurename'>
                    <li><h4>입력전압</h4></li>
                    <li><h4>수신값</h4></li>
                    <li><h4>V.V.C.F값</h4></li>
                </ul>
                {readMeasureList.map((item, index) => (
                    editingIndex === index ? (
                        <ul className='measurelist' key={index}>
                            <li><input type="number" name="sendVoltage" value={editInputText.sendVoltage} onChange={onEditChange} onKeyDown={handleKeyPress}/></li>
                            <li><input type="number" name="receiveVoltage" value={editInputText.receiveVoltage} onChange={onEditChange} onKeyDown={handleKeyPress}/></li>
                            <li><input type="number" name="vvcfVoltage" value={editInputText.vvcfVoltage} onChange={onEditChange} onKeyDown={handleKeyPress}/></li>
                            <li>
                                <button onClick={() => saveEditMeasure(index)}>저장</button>
                                <button onClick={() => setEditingIndex(null)}>취소</button>
                            </li>
                        </ul>
                    ) : (
                        <ul className='measurelist' key={index}>
                            <li><h4>{item.sendVoltage}</h4></li>
                            <li><h4>{item.receiveVoltage}</h4></li>
                            <li><h4>{item.vvcfVoltage}</h4></li>
                            <li>
                                <button onClick={() => startEditMeasure(index, item.sendVoltage, item.receiveVoltage, item.vvcfVoltage)}>수정</button>
                                <button onClick={() => deleteMeasure(item.sendVoltage)}>삭제</button>
                            </li>
                        </ul>
                    )
                ))}
            </div>
        </section>
    );
};

export default Settings;