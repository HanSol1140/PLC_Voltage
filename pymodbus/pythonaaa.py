import numpy as np
from sklearn.linear_model import LinearRegression

# 주어진 데이터
bojeong = np.array([651, 713, 773, 835, 895, 956, 1017, 1079, 1139])  # 보정(전송)
pm_measurement = np.array([66.3, 71.2, 76.2, 81.1, 86.2, 91.1, 96.1, 101, 106])  # P.M 측정

# 선형 회귀 모델 학습
reg = LinearRegression().fit(bojeong.reshape(-1, 1), pm_measurement)

# 예측 (bojeong 값에 대한 P.M 측정 값 예측)
predicted_pm = reg.predict(bojeong.reshape(-1, 1))

print("Predicted P.M Measurements:", predicted_pm)

# 새로운 보정(전송) 값에 대한 P.M 측정값을 예측하려면 다음과 같이 사용합니다.
new_bojeong = np.array([68])
predicted_new_pm = reg.predict(new_bojeong.reshape(-1, 1))
print("Predicted P.M Measurements for new values:", predicted_new_pm)