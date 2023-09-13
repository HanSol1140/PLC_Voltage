# pip install pymodbus
from pymodbus.client import ModbusTcpClient
import time
plcIp = '192.168.1.2'
plcPort = 2004
client = ModbusTcpClient(plcIp, plcPort)

def connect_to_plc():
    if client.connect():
        print("PLC Connect")
    else:
        print("PLC Connect Error")


def read_d920():
    try:
        print("D920 읽기 시작")
        result = client.read_holding_registers(920, 1)
        if not result.isError():
            return result.registers[0]
        else:
            print(f"D920 읽기 오류: {result}")
    except Exception as e:
        print("D920 값을 읽는 도중 오류 발생:", e)
        

def read_d1000():
    try:
        print("D1000 읽기 시작")
        result = client.read_holding_registers(1000, 1)
        if not result.isError():
            return result.registers[0]
        else:
            print(f"D1000 읽기 오류: {result}")
    except Exception as e:
        print("D1000 값을 읽는 도중 오류 발생:", e)


if __name__ == '__main__':
    connect_to_plc()
    time.sleep(1)
    d920 = read_d920()
    d1000 = read_d1000()
    print(f'D920 포트의 값: {d920}')
    print(f'D1000 포트의 값: {d1000}')

    client.close()
