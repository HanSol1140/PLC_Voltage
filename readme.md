# 사용방법

##  기본적인 사용방법
  라즈베리파이와 PLC장치를 LAN선으로 연결 후 라즈베리파이에 전원을 넣으면 서버가 자동으로 실행됩니다.
  
  D910에 입력된 전압값을 읽어서
  
  D1000으로 전압이 아날로그로 변환된 입력값을 넣습니다. (들어가는 출력)
  
  D1500에 돌아오는 아날로그값을 전압으로 변환하여 값을 넣습니다.
  
  ※ D1500의 값을 받을때는 ((D1500의값)/10)V 로 받아야 합니다. (해당값은 소수점 표기가 안되서 *10시킨 값입니다.)
  
## PLC에 설정된 측정값 변경 방법
  REAL VNC 설치
  
  <a href="https://www.realvnc.com/en/connect/download/viewer/"> REAL VNC 다운로드 페이지</a>
  
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/dc3eceba-efd1-4f43-9c74-3106a8ec28a4)
  
  해당 페이지로 이동 후 다운로드해서 REAL VNC 설치

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/aaffb5b7-7e5f-4e34-a2e4-4e3bfe16d2d1)
  
  PC와 라즈베리파이를 LAN선으로 연결 후
  
  사전에 설정된 이더넷 IP를 입력하여 접속

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/a3e69ae3-5eb0-4955-a92e-a79718698cda)

  useername : nanonix
  
  password : nanonix
  <br>

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/2579a15e-329e-4744-b228-96d5315ab9f9)  
  
  원격 접속이 된것을 확인할 수 있습니다.

  라즈베리파이의 브라우저를 실행 후
  
  localhost:8888으로 접속하면 설정페이지에 접속됩니다.

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/4743b159-3f7b-44fd-957a-684aa2d325fb)

  여기서 원하는 값으로 변경 후 라즈베리파이를 재부팅해주세요.

  ### IP 설정하기
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/a498b8e5-fec4-4428-a189-5d1daef9d863)
  
  사전에 설정된 PLC의 IP주소입니다.

  ### scale 얻기
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/547c5bc8-632f-4ad8-98b9-ceab942e060f)
  
  전압 계산을위한 scale 설정값을 입력해주세요.
  
  ### 측정값 입력
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/4a41b497-ef36-4c64-b4c0-605aeb2cc4f0)
  
  기준이 될 측정값을 입력해주세요.
  수신값은 PLC에서 보이는 아날로그 값입니다.
  
  ex) inputScale이 12일때 입력 전압 60V => 720(60*12)일때 PLC에 출력되는 아날로그값 : 809 / V.V.C.F에서 출력된 값 : 65.8V





<br><br>
# 설치 과정
## 1. 라즈베리파이에 라즈비안 운영체제 설치

라즈베리파이와 SD카드, SD카드 리더기를 준비합니다.

<a href="https://www.raspberrypi.com/software/">라즈비안 이미저 다운로드</a>

![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/ea83d3af-177a-4a4b-9e2f-bb45b7276d37)

SD카드 리더기에 SD카드를 꽂고, PC에 연결하여 자신의 운영체제에 맞는 라즈비안 이미저를 설치합니다.

이후 운영체제 설치과정 생략

터미널을 입력후 다음 명령어를 실행해주세요
```
  sudo nano /etc/dhcpcd.conf
```
파일 편집기가 실행되면 제일 하단부로 이동하여


##. 2. 설치후 라즈베리파이에 한글설정

한글 설정을 해주지 않으면 영어는 사용할 수 있지만

특수문자 키배열이 달라서 각종 설치에 문제가 있으므로 가장 먼저 한글을 설치합니다.

먼저 터미널을 실행
```
  sudo apt-get update
  sudo raspi-config
  5 Localisation Options" > L1 Locale
  ko_KR.UTF-8 UTF-8을 선택하고, Ok를 누릅니다.
  그 다음 =설정할 기본 로캘로 ko_KR.UTF-8을 선택하고 다시 Ok를 누릅니다.
  raspi-config를 종료
```

만약, 기본 로캘 설정에 ko_KR.UTF-8이 없다면
```
  locale -a
  ko_KR.UTF-8이 있는지 확인하고 만약 없다면
  sudo nano /etc/locale.gen
  입력하여 편집기에서 ko_KR.UTF-8이 주석처리 되어있나 확인하고 주석처리를 제거(앞 부분에 #, 공백 제거)
  (Ctrl + S)로 저장 후 (Ctrl + X)로 편집기 종료
  sudo locale-gen
  sudo update-locale LANG=ko_KR.UTF-8
```

이후 나머지 설치
```
    글꼴 설치 -> 설치후 설정을 해줘야 네모가 출력되지 않음
    sudo apt-get install -y fonts-nanum*

    한글 입력기 설치
    sudo apt-get install -y ibus ibus-hangul
    ibus를 기본 입력방법으로 설정
    im-config -n ibus
    입력기에 한글 추가하기
    터미널에
    ibus-setup
    => input Method => Add => Korean => hangul
    
    원래 있던 언어를 제거합니다. (한글만 설치해도 영어사용가능)
    sudo reboot


    ※ 이때 ibus-setup일때 오류가 뜨면서 안켜질 수 있는데
    1. 재부팅후 다시 실행
    2. 그래도 안된다면 sudo ibus-setup 후 오류메세지가 출력될텐데
       무시하고 Hangul설정후 재부팅후 다시 ibus-setup으로 접속해서 한글이 추가되었는지 확인해보세요.
```
## 3. node.js 설치
터미널 실행
```
  sudo apt-get update
  sudo apt-get install -y nodejs npm
  node -v
  npm -v
```

node와 npm이 구버전임을 확인할 수 있습니다.

nodejs 홈페이지로 이동 후

다운로드 페이지 Linux Binaries (ARM) - ARM8 다운로드 후 home/hostname 경로로 이동시키기

node-v18.16.1-linux-armv7l.tar.xz 압축해제

터미널을 실행합니다.
```
  echo 'export PATH=$HOME/node-v18.17.1-linux-armv64/bin:$PATH' > ~/.bashrc
  source ~/.bashrc
```
버전을 확입합니다.
```
 npm -v
 node -v
```
확인됬다면 reboot해주세요.


## 4. 프로그램 다운로드
  <a href="https://github.com/HanSol1140/PLC_Voltage">https://github.com/HanSol1140/PLC_Voltage</a>
  해당 경로로 이동

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/b1c5aa36-5653-4ba8-ad90-8555e2b8fd8e)

  해당 파일을 다운로드 후 홈 경로에 압축해제

  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/3a6c32a7-3e35-4d33-b45d-5d542a1fa4ce)

  
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/84e9f9f9-d70a-4751-b054-63bb2707cdc3)

  압축 해제된 폴더의 폴더명에서 '-master'부분을 지워주세요
  
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/f9c881f0-6bf7-4608-8cf8-25645a0670c8)

  이제 터미널을 켜서 압축 해제된 PLC_Voltage에 접속해 리액트와 서버를 실행해봅니다
  
  서버 실행 확인
  ```
    cd PLC_Voltage
    cd plc_server
    node server.js
  ```


  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/af7fa0a2-d4af-4d8c-88b7-0368e733d189)
  <br>
  서버가 실행됬다면 브라우저를 실행해 localhost:8888로 접속해봅니다.
  <br>
  
  ![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/9aa6c40b-a2cd-477f-92ed-92bfbacc5f4b)

  실행이 확인되고, IP, scale, 측정값 추가/수정/삭제 기능이 확인됬다면, 이제 pm2를 이용해 서버를 자동실행 해줍니다.

## 5. pm2를 이용하여 서버 자동실행하기

pm2 설치
터미널에서 실행
```
  sudo npm install -g pm2
  npm audit fix

  만약 오류가 출력된다면
  $HOME/node-v18.17.1-linux-armv64/bin/npm install -g pm2
  해당 명령어로 pm2를 설치해보세요.  
```
pm2 설정
터미널에서 실행
```
  pm2 start /home/nanonix/PLC_Voltage/plc_server/server.js
  pm2 startup
  위의 명령어를 입력하면
  sudo env PATH=$PATH:/home/nanonix/node-v18.17.1-linux-armv64/bin /sur/local/lib/node_modules/pm2/bin startup systemd -u nanonix --hp /home/nanonix
  이와 같은 형태의 코드가 출력됩니다.
  해당 코드를 복사하여 터미널에 입력하고
  pm2 save
  이제 재부팅을 하면 자동으로 서버가 실행됩니다.
```

pm2 서버 자동실행 취소
```
  서버 자동실행 설정 취소하기
  pm2 stop server.js
  pm2 delete server.js
  pm2 unstartup
  startup과 똑같이 출력되는 명령어를 터미널에 복사붙여넣기해야합니다.
  pm2 save
```
## 6. PLC연결을 위한 이더넷 설정
LS산전 홈페이지에서 XG5000을 다운로드 받아서 설치

해당 프로그램은 윈도우에서만 사용이 가능하므로 라즈베리파이가 아닌 PC에서 설정해야합니다.

![image](https://github.com/HanSol1140/PLC_Voltage/assets/121269266/68378fb2-78a8-4610-9a27-390f69e1fd41)

PLC의 IP를 설정을 해준뒤 PLC에 설정 업로드 / 리셋

라즈베리파이의 터미널에서
```
sudo nano /etc/dhcpcd.conf

  제일 하단으로 이동후 
  interface eth0
  static ip_address=192.168.1.20/24       => 비어있는 IP 아무거나 사용하시면 됩니다.
  static routers=192.168.1.1
  static domain_name_servers=192.168.1.1
  해당 코드 추가

  Ctrl + S => Ctrl + X

  sudo service dhcpcd restart
  
  sudo reboot
  
  ip a
  
```
eth0에 192:168.1.20이 나오면 성공

이제 서버를 실행시킨뒤 PLC와 연결하면 됩니다.

## 7. 원격 접속을 위한 xrdp 다운로드
```
  라즈베리파이 터미널 실행
  sudo apt-get install xrdp -y
```





<!--

# 설치방법 LS산전 XGB시리즈 PLC

P01 / P02같은 address를 주면

해당 좌표에서 값을 읽어서 읽거나 쓰면 됨,



XBM-DN32H
XBF-AH04A

<설정방법>
<PC>
LAN선으로 PLC와 노트북을 연결
시작 - 네트워크 연결 보기 - 이더넷 - 속성 인터넷프로토콜 버전4(TCP/IPv4)
다음 ip 주소사용 => 192.168.1.15(자유)


LS산전에서 XG5000 프로그램 다운로드

LAN선으로 연결 후 프로젝트 - PLC로부터열기 - 접속옵션설정 - 이더넷 모듈 - 설정 - ip찾기 - 확인 - 접속

좌측에 네트워크 구성 - 기본 네트워크 - LSPLC (B0S1 내장 FEnet) - 우클릭 - 열기

드라이버 설정 - 모드버스 설정

상단 메뉴 온라인 - 쓰기 / 온라인 - 리셋

이후 server.js에서 서버를 접속하면 접속됨


<계산>

먼저 D910에 들어온 전압을 읽어서 프로그램에서 아날로그값으로 변환시켜서 D1000번에 쓰기

D620값을 읽어서 프로그램에서 아날로그값으로 계산하여 디지털로 변환시켜 D1400에 표시

1400번은 620의 값을 읽어서 표시되기때문에 변환이 불가능함

그래서 나오는 볼트값을 1400번에서 받은후 라즈베리파이(프로그램)에서 변환후 1500번으로 써줘야함


1. 910번에 값을 읽느다
2. 값이 변한다면 1000번에 910 * scale의 값을 쓰기
3. 1400번의 전압을 읽어서 변환
4. 1500번에 변환한 값을 넣기

