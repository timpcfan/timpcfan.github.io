---
title: Python字符数字之间的转换函数
order: 20
category:
  - 笔记
  - API
tag:
  - Python
---

| 函数                     | 说明                                                  |
| ------------------------ | ----------------------------------------------------- |
| int(x [,base ])          | 将 x 转换为一个整数                                   |
| long(x [,base ])         | 将 x 转换为一个长整数                                 |
| float(x )                | 将 x 转换到一个浮点数                                 |
| complex(real [,imag ])   | 创建一个复数                                          |
| str(x )                  | 将对象  x  转换为字符串                               |
| repr(x )                 | 将对象  x  转换为表达式字符串                         |
| eval(str )               | 用来计算在字符串中的有效 Python 表达式,并返回一个对象 |
| tuple(s )                | 将序列  s  转换为一个元组                             |
| list(s )                 | 将序列  s  转换为一个列表                             |
| chr(x )                  | 将一个整数转换为一个字符                              |
| unichr(x )               | 将一个整数转换为 Unicode 字符                         |
| bin(x)                   | 将数字转换为二进制字符串                              |

```python
chr(65) = 'A'
ord('A') = 65

int('2') = 2
str(2) = '2'
```
