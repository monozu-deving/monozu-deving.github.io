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
기존의 전통적인 Machine Learning 중에서도 지도 학습의 경우에는 데이터의 특징을 추출하는 Feature extraction의 과정을 사람이 진행해준다. 반면에 Deep learning은 input의 특징을 알아서 추출해서 주어진 output의 값이 나올 수 있도록 학습을 한다.  

분류 문제로 예를 든다면 동물 사진을 주고 호랑이를 구별한다고 할 때 전통적인 ML은 호랑이는 줄무니에 해당하는 특징 벡터가 있고, 꼬리라는 곡선의 특징 벡터가 존재해. 이런 특징 벡터를 가지고 있는게 호랑이야 라고 설명을 해주는 것이고, DL은 사진만 주고 이건 호랑이고 이게 아니면 호랑이가 아니야 라고 계속 학습을 하면서 신경망이 호랑이의 특징을 학습할 수 있도록 하는 것이다. 이 과정에서 신경망은 꼬리와 줄무니 같은 특징을 학습을 한다.  
(엄밀히 말하면 DL이 꼬리를 특징으로 지정하는지 줄무니를 특징으로 지정하는지는 알 수 없다. 이 부분은 뒤에서 설명되도록 하겠다.)

## Neural Network
일반적으로 사람의 신경망과 유사한 구조를 가지고 학습을 하는데 우선적으로 선형 분류 모델에 대해 알아보자. 일반적으로 전기 회로에서 사용되는 OR gate와 AND gate는 아래의 사진처럼 선형으로 구별할 수 있다.  
<p align="center">
  <img src="/assets/images/2025-10-06-deep_learning/orgate.JPEG" width="200"/>
  <img src="/assets/images/2025-10-06-deep_learning/andgate.JPEG" width="200"/>
</p>

$x_{1}$에서의 값이 1이거나, $x_{2}$에서의 값이 1이면 1이 나오는 or gate와 $x_{1}$의 값이 1이고, $x_{2}$의 값도 1이어야만 1이 나오는 and gate는 선형 모델로 분류가 가능하다. 그러나 여기서 $x_{1}$과 $x_{2}$의 값이 서로 달라야만 1이 되는 XOR 게이트는 선형 모델로는 구분이 불가능하다. (자세한 이유는 XOR의 선형 분리 불가능성 관련 자료를 참고하면 도움이 된다.) 실제로 인공지능으로 분류를 하거나 회귀를 하는 데이터의 경우에는 선형으로 분류해야 하는 경우가 존재하기 때문에 이런 문제에 대해서 곰곰히 생각해보아야 한다.

이를 해결하기 위해서 사람들은 비선형 함수(Activation Function)을 추가해주기 시작했다. 아래 사진을 보면 선형이 아닌 선으로 XOR gate를 구현할 수 있다는 것을 확인할 수 있다.  
<p align="center">
  <img src="/assets/images/2025-10-06-deep_learning/xorgate.JPEG" width="200"/>
</p>  
이런 식으로 비선형 함수를 사용하면 비선형적으로 분류할 수 있다.

## Activation Function(활성 함수)
그러면 Deep Learning에서 사용되는 비선형함수로는 무엇이 있을까?
<figure align="center">
  <img src="/assets/images/2025-10-06-deep_learning/activation_function.png" width="500" alt="activation function의 종류">
  <figcaption>
    Activation Function의 종류 
    (<a href="https://youtu.be/wEoyxE0GP2M?si=bQu32vs6_RjijKMB" target="_blank">출처: Oxford 강의</a>)
  </figcaption>
</figure>
위 사진을 본다면 일반적인 활성 함수의 종류들이 제시되어 있다. 간단하게 특징을 설명하자면 Sigmoid는 사진에 나온 식을 따라서 비선형성을 보이는 함수이고, tanh는 하이퍼볼릭 탄젠트 함수를 따라 만들어지는 함수이다. ReLU(Rectified Linear Unit)는 입력이 0보다 작으면 0을 출력하고, 0 이상이면 입력값을 그대로 출력하는 함수이다. ReLU는 sigmoid나 tanh에 비해 Gradient Vanishing 문제를 크게 완화하지만, 입력이 음수일 때 기울기가 0이 되어 학습이 멈추는 Dead ReLU 문제가 발생할 수 있다. 이를 보완하기 위해 Leaky ReLU, ELU, Maxout 등이 제안되었다.(하지만 ReLU 때문에 일어나는 Gradient Vanishing 문제는 잘 일어나지 않기도 하고, 계산도 단순하기 때문에 ReLU를 가장 많이 쓴다고 한다.)

## Forward / Backward Pass
일반적으로 일어나는 Deep Learning의 학습 방법은 아래의 순서를 따른다.  
1. 가중치 파라미터 w를 무작위 값으로 초기화 한다  
2. 데이터를 처리하고 예측한다  
3. 네트워크의 예측값과 실제 라벨 간의 오차를 계산한다  
4. 오차를 줄이는 방향으로 파라미터 w를 갱신한다  
5. 네트워크의 예측이 충분히 정확해질 때까지 2~4 단계를 반복하며 가중치를 수정한다

1번과 2번은 순전파(Forward pass, 또는 Feedforward), 3~5번은 역전파(Backward pass, 또는 Backpropagation) 과정에 해당한다. 이 과정에서는 가중치를 조절하면서 결과적으로 오차인 loss 값을 줄이는 것을 목표로 하고 이를 위해서 회귀에서는 MSE(Mean Squared Error), 분류에서는 CE(Cross Entropy)를 사용한다.

$$
\text{Regression Task} \quad \text{MSE} = \frac{1}{N}\sum_{i=1}^{N}\sum_{d=1}^{D}(y_{i}^{(d)} - \hat{y}_{i}^{(d)})^{2}
$$

$$
\text{Classification Task} \quad \text{CE} = -\frac{1}{N}\sum_{i=1}^{N}\sum_{d=1}^{D}y_{i}^{(d)}\log{\hat{y}_{i}^{(d)}}
$$  

## Backpropagation
<figure align="center">
  <img src="/assets/images/2025-10-06-deep_learning/backpropagation.png" width="500" alt="backpropagation">
  <figcaption>
    backpropagation 과정 
    (<a href="https://iq.opengenus.org/backpropagation-vs-gradient-descent/" target="_blank">출처: Backpropagation vs Gradient Descent
</a>)
  </figcaption>
</figure>  
위 사진을 보면 backpropagation의 계산하는 과정이 있다. 임의로 초기화(가중치 초기화 방법도 여러가지가 있으니 찾아보면 도움이 될 것 같다)된 가중치 w를 활용해서 CE 혹은 MSE에 값을 넣어서 계산한 후 이를 편미분을 활용해서 역전파를 하면 가중치의 값을 수정할 수 있다. (자세한 과정은 인터넷에 찾아보고 직접 계산해보는 걸 권장🤓)  
결과적으로 이 과정은 아래 사진과 같은 그래프가 있을 때 Loss의 값을 최소로 하는 가중치 조건을 찾아가는 과정이라고 볼 수 있다. 
<figure align="center">
  <img src="/assets/images/2025-10-06-deep_learning/gradient_descent.png" width="500" alt="gradient_descent">
  <figcaption>
    gradient descent 
    (<a href="https://iq.opengenus.org/backpropagation-vs-gradient-descent/" target="_blank">출처: Backpropagation vs Gradient Descent
</a>)
  </figcaption>
</figure>  

## 결론
결과적으로 딥러닝은 자신이 특징 벡터를 추출하기 위해 가중치를 조정하면서 최소의 Loss를 찾아가는 과정을 forward와 backward를 통해 도달하는 것이라고 볼 수 있다. 이때 학습된 가중치가 입력을 어떤 방식으로 처리하는지는 해석하기 어렵지만, 모델은 이 가중치를 조정하면서 출력이 목표값에 가까워지도록 스스로 학습한다.
좀 성급하게 마무리한 느낌이 있긴 한데, 이 부분은 설명을 하게 된다면 너무 자세히 설명을 해야되서 혼동이 올 수 있을 것 같아 오늘은 이정도만 정리하도록 해야될 것 같다. 추가적으로 궁금한 내용은 아래 댓글에 남겨주면 확인할 수 있으니 많이 남겨주면 좋겠다...  
설명을 봐도 잘 모르겠다 싶으면 "밑바닥부터 시작하는 딥러닝"이라는 책도 있으니 해당 책을 찾아보는 것도 괜찮고, 인터넷에 자료가 많이 올라와있으니 딥러닝이라고 찾으면 많은 정보를 얻을 수 있을 것이다. 

### 틀린 내용이나 궁금한 내용이 있으면 아래 댓글로 남겨주세요😎