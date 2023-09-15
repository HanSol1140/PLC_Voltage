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
exports.writeData = exports.readData = exports.connectToPLC = void 0;
const modbus_serial_1 = __importDefault(require("modbus-serial")); // 모듈 추가
const client = new modbus_serial_1.default();
const IP = '192.168.1.2';
const Port = 502;
// Modbus TCP로 연결
const MAX_RETRIES = 5; // 최대 재시도 횟수
const RETRY_INTERVAL = 5000; // 재시도 간격 (5초)
// Modbus TCP로 연결
const connectToPLC = (IP, Port) => __awaiter(void 0, void 0, void 0, function* () {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            yield client.connectTCP(IP, { port: Port, timeout: 3000 });
            console.log('PLC에 연결됨');
            return; // 연결 성공 시 함수를 종료합니다.
        }
        catch (error) {
            retries++;
            console.error(`PLC 연결 오류 (재시도 ${retries}/${MAX_RETRIES}):`, error);
            if (retries < MAX_RETRIES) {
                yield new Promise(res => setTimeout(res, RETRY_INTERVAL)); // 일정 간격 후 재시도
            }
            else {
                console.error('최대 재시도 횟수를 초과했습니다. PLC 연결에 실패했습니다.');
            }
        }
    }
});
exports.connectToPLC = connectToPLC;
const readData = (readDataAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield client.readHoldingRegisters(readDataAddress, 1);
        return value.data[0];
    }
    catch (error) {
        console.error('값을 읽는 도중 오류 발생:', error);
    }
});
exports.readData = readData;
const writeData = (writeDataAddress, writeValue) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.writeRegister(writeDataAddress, writeValue);
        console.log(writeDataAddress + '어드레스에 값 설정 완료:', writeValue);
    }
    catch (error) {
        console.error('값을 쓰는 도중 오류 발생:', error);
    }
});
exports.writeData = writeData;
