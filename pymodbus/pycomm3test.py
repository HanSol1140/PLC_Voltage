# pip install pycomm3
from pycomm3 import LogixDriver

with LogixDriver('192.168.1.2', port=2002) as plc:
    print(plc)