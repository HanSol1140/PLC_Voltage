# 1. 라즈베리파이에 라즈비안 운영체제 설치

라즈베리파이와 SD카드, SD카드 리더기를 준비합니다.

<a href="https://www.raspberrypi.com/software/">라즈비안 이미저 다운로드</a>

![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/ea83d3af-177a-4a4b-9e2f-bb45b7276d37)

SD카드 리더기에 SD카드를 꽂고, PC에 연결하여 자신의 운영체제에 맞는 라즈비안 이미저를 설치합니다.

설치과정 생략

#. 2. 설치후 라즈베리파이에 한글설정

한글 설정을 해주지 않으면 영어는 사용할 수 있지만

특수문자 키배열이 달라서 각종 설치에 문제가 있으므로 가장 먼저 한글을 설치합니다.

먼저 터미널을 실행 후

  sudo apt-get update
  sudo raspi-config
  5 Localisation Options" > L1 Locale
  ko_KR.UTF-8 UTF-8을 선택하고, Ok를 누릅니다.
  그 다음 =설정할 기본 로캘로 ko_KR.UTF-8을 선택하고 다시 Ok를 누릅니다.
  raspi-config를 종료

만약, 기본 로캘 설정에 ko_KR.UTF-8이 없다면
  터미널을 실행
  locale -a
  
  ko_KR.UTF-8이 있는지 확인하고 만약 없다면
  
  sudo nano /etc/locale.gen
  입력하여 편집기에서 ko_KR.UTF-8이 주석처리 되어있나 확인하고 주석처리를 제거(앞 부분에 #, 공백 제거)
  (Ctrl + S)로 저장 후 (Ctrl + X)로 편집기 종료
  
  sudo locale-gen

  sudo update-locale LANG=ko_KR.UTF-8

# 설치방법 LS산전 XGB시리즈 PLC

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

1400번은 620의 값을 읽어서 표시되기때문에 변환이 불가능함

그래서 나오는 볼트값을 1400번에서 받은후 라즈베리파이(프로그램)에서 변환후 1500번으로 써줘야함


1. 910번에 값을 읽느다
2. 값이 변한다면 1000번에 910 * scale의 값을 쓰기
3. 1400번의 전압을 읽어서 변환
4. 1500번에 변환한 값을 넣기

