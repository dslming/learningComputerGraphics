[B样条教程](https://www.cnblogs.com/WhyEngine/p/4020380.html)

### 样条曲线-CatmullRom

#### 1、样条曲线

所谓**样条曲线**是指给定一组控制点而得到一条曲线，曲线的大致形状由这些点予以控制，一般可分为`插值样条`和`逼近样条`两种。

**插值样条:**

- 要求必须经过给定所有数据点
- 代表算法有: `CatmullRom`
![alt](002.png)

**逼近样条：**

- 不要求一定要经过数据点
- 代表算法有: `B样条`
![alt](001.png)

#### 2、参数连续性

> 参考: 计算机图形学(第4版)-第14章第2节

![alt](003.png)
![alt](004.png)

#### 3、CatmullRom原理

[参考资料1](https://blog.csdn.net/u012154588/article/details/98977717?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task)
[参考资料2](https://wenku.baidu.com/view/bb7f8ff4910ef12d2bf9e70d.html)

![alt](005.png)

![alt](006.gif)
经过4个点($P_0$,$P_1$,$P_2$,$P_3$)的曲线方程为:
$$
B(t) = c_0 + c_1 t + c_2 t^2 + c_3 t^3
$$


其切线方程为:
$$
C(t) = c_1 + 2 c_2 t + 3 c_3 t^2
$$

满足如下条件:

~~~math
\begin{aligned}
B(0) &= P_1, 故 c_0 = P_1 \\

C(0) &= \frac{P_2-P_1}{2}, 故c_1 = \frac{P_2-P_1}{2} \\

B(1) &= P_2, 故c_0+c_1+c_2+c_3 = P_2 \\

C(1) &= \frac{P_3-P1}{2}, 故 c_1+2c_2+3c_3 = \frac{P_3-P1}{2}

\end{aligned}
~~~

由上式可推出:

~~~math
\begin{aligned}

c_0 &= P_1      \\
c_1 &= \frac{P_2-P_1}{2}   \\
c_2 &= \frac{2P_0-5P_1+4P_2-P_3}{2} \\
c_3 &= \frac{-P_0+3P_1-3P_2+P_3}{2}

\end{aligned}
~~~

那么样条的表达式:
$$
Q(t) = [(2 * P_1) + (-P_0 + P_2) * t + (2P_0 - 5P_1 + 4P_2 - P_3) * t^2 + (-P0 + 3P_1- 3P_2 + P_3) * t^3 ] * \frac{1}{2}
$$

矩阵形式:
$$
Q(t) = \frac{1}{2} *
\left[
  \begin{matrix}
  1 & t & t^2 & t^3 \\
  \end{matrix}
\right]
*
\left[
  \begin{matrix}
  0 & 2 & 0 & 0  \\
  -1 & 0 & 1 & 0  \\
  2 & -5 & 4 & -1  \\
  -1 & 3 & -3 & 1
  \end{matrix}
\right]
*
\left[
  \begin{matrix}
  P_0 \\
  P_1 \\
  P_2 \\
  P_3 \\
  \end{matrix}
\right]
$$

这个公式$y=x+1$是

$$
\theta = x+1
$$
<全文结束>
