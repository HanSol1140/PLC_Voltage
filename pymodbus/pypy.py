# -*- coding: utf-8 -*-
# pip show pymodbus
import time
# # ==========================================================================
# import socket

# UDP_IP = "192.168.1.15"
# UDP_PORT = 12345

# sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)  # UDP 소켓 생성
# sock.bind((UDP_IP, UDP_PORT))

# while True:
#     data, addr = sock.recvfrom(1024)  # 버퍼 크기 1024
#     print(f"received message from {addr}: {data}")
# ==========================================================================
# pip install pycomm3
# from pycomm3 import LogixDriver

# with LogixDriver('192.168.1.2/1') as plc:
#     d920_value = plc.read('D920')
#     d1000_value = plc.read('D1000')
    
#     print(f'D920 값: {d920_value}')
#     print(f'D1000 값: {d1000_value}')
# ===========================================================================
# pip install pymodbus
from pymodbus.client import ModbusTcpClient
plcIp = '192.168.1.2'
plcPort = 2002
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
