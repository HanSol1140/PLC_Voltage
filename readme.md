LS산전 XGB시리즈 PLC

P01 / P02같은 address를 주면

해당 좌표에서 값을 읽어서 읽거나 쓰면 됨,


<!-- PLC와 라즈베리파이 연결후 PLC IP찾기  -->
XBM-DN32H
XBF-AH04A


<설정방법>
<PC>
LAN선으로 PLC와 노트북을 연결
시작 - 네트워크 연결 보기 - 이더넷 - 속성 인터넷프로토콜 버전4(TCP/IPv4)
다음 ip 주소사용 => 192.168.1.15(자유인데 PLC와 앞 IP주소가 같아야함, 192.168.x.x)


LS산전에서 XG5000 프로그램 다운로드

LAN선으로 연결 후 프로젝트 - PLC로부터열기 - 접속옵션설정 - 이더넷 모듈 - 설정 - ip찾기 - 확인 - 접속

좌측에 네트워크 구성 - 기본 네트워크 - LSPLC (B0S1 내장 FEnet) - 우클릭 - 열기

드라이버 설정 - 모드버스 설정

상단 메뉴 온라인 - 쓰기 / 온라인 - 리셋

이후 server.js에서 서버를 접속하면 접속됨

<라즈베리파이>
sudo nano /etc/dhcpcd.conf

제일 밑에
interface eth0
static ip_address=192.168.1.20/24
static routers=192.168.1.1
static domain_name_servers=192.168.1.1

Ctrl + S => Ctrl + X

sudo service dhcpcd restart

sudo reboot

ip a

eth0에 192:168.1.20이 나오면 성공

이제 server.js를 실행시켜서 확인


<계산>

먼저 D910에 들어온 전압을 읽어서 프로그램에서 아날로그값으로 변환시켜서 D1000번에 쓰기

D620값을 읽어서 프로그램에서 아날로그값으로 계산하여 디지털로 변환시켜 D1400에 표시