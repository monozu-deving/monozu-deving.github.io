---
title: "DL이란?"
layout: single
toc: true              # ✅ 목차 활성화
toc_label: "📑 목차"   # (선택) 목차 제목
toc_sticky: true       # ✅ 스크롤 시 오른쪽 고정
comments: true
author_profile: true
categories: ['ai']

---

# Deep Learning(딥러닝)
기존의 근본적인 Machine Learning 중에서도 지도 학습의 경우에는 데이터의 특징을 추출하는 Feature extraction의 과정을 사람이 진행해준다. 반면에 Deep learning은 input의 특징을 알아서 추출해서 주어진 output의 값이 나올 수 있도록 학습을 한다.  

분류 문제로 예를 든다면 동물 사진을 주고 호랑이를 구별한다고 할 때 근본적인 ML은 호랑이는 줄무니에 해당하는 특징 벡터가 있고, 꼬리라는 곡선의 특징 벡터가 존재해. 이런 특징 벡터를 가지고 있는게 호랑이야 라고 설명을 해주는 것이고, DL은 사진만 주고 이건 호랑이고 이게 아니면 호랑이가 아니야 라고 계속 학습을 하면서 신경망이 호랑이의 특징을 학습할 수 있도록 하는 것이다. 이 과정에서 신경망은 꼬리와 줄무니 같은 특징을 학습을 한다.  
(엄밀히 말하면 DL이 꼬리를 특징으로 지정하는지 줄무니를 특징으로 지정하는지는 알 수 없다. 이 부분은 뒤에서 설명되도록 하겠다.)

## Neural Network
일반적으로 사람의 신경망과 유사한 구조를 가지고 학습을 하는데 우선적으로 선형 분류 모델에 대해 알아보자. 일반적으로 전기 회로에서 사용되는 OR gate와 AND gate는 아래의 사진처럼 선형으로 구별할 수 있다.  
<p align="center">
  <img src="/assets/images/2025-10-06-deep_learning/orgate.JPEG" width="200"/>
  <img src="/assets/images/2025-10-06-deep_learning/andgate.JPEG" width="200"/>
</p>

