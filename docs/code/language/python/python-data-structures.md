---
title: Python常用数据结构
order: 5
category:
  - 笔记
  - API
tag:
  - Python
  - 数据结构
---

## 列表 list

### 列表方法

- list.append(obj)
- list.count(obj)
- list.extend(seq)
- list.index(obj)
- list.insert(index, obj)
- list.pop([index=-1])
- list.remove(obj)
- list.reverse()
- list.sort(cmp=None, key=None, reverse=False)

### 列表脚本操作符

| Python 表达式                | 结果                         | 描述                 |
| ---------------------------- | ---------------------------- | -------------------- |
| len([1, 2, 3])               | 3                            | 长度                 |
| [1, 2, 3] + [4, 5, 6]        | [1, 2, 3, 4, 5, 6]           | 组合                 |
| ['Hi!'] \* 4                 | ['Hi!', 'Hi!', 'Hi!', 'Hi!'] | 重复                 |
| 3 in [1, 2, 3]               | True                         | 元素是否存在于列表中 |
| for x in [1, 2, 3]: print x, | 1 2 3                        | 迭代                 |

### 列表截取

| Python 表达式 | 结果                 | 描述                     |
| ------------- | -------------------- | ------------------------ |
| L[2]          | 'Taobao'             | 读取列表中第三个元素     |
| L[-2]         | 'Runoob'             | 读取列表中倒数第二个元素 |
| L[1:]         | ['Runoob', 'Taobao'] | 从第二个元素开始截取列表 |

## 双向队列 deque

```python
class collections.deque([iterable[, maxlen]])
```

::: warning
若当作一个**单向队列**，append(x) 与 popleft() 才是一对。。。

- 若当作一个**栈**，append(x)与 pop()就是一对
  :::

### 方法

- append(x) 添加到右侧
- appendleft(x) 添加到左侧
- pop() 从右侧出队
- popleft() 从左侧出队
- clear()
- copy()
- count(x)
- extend(iter)
- extendleft(iter)
- index(x[, start[, stop]])
- insert(i, x)
- remove(x) 删除从左到右的第一个 x
- reverse()
- rotate(n=1)
- maxlen

### Recipes

#### 1. 用于实现 tail 程序

```python
def tail(filename, n=10):
    'Return the last n lines of a file'
    with open(filename) as f:
        return deque(f, n)
```

设置 maxlen=n，可以实现保留文本最后 n 行的功能。

#### 2. 用于维持一个定长的近期添加元素序列

```python
def moving_average(iterable, n=3):
    # moving_average([40, 30, 50, 46, 39, 44]) --> 40.0 42.0 45.0 43.0
    # http://en.wikipedia.org/wiki/Moving_average
    it = iter(iterable)
    d = deque(itertools.islice(it, n-1))
    d.appendleft(0)
    s = sum(d)
    for elem in it:
        s += elem - d.popleft()
        d.append(elem)
        yield s / n
```

#### 3. 实现一个 round-robin scheduler

```python
def roundrobin(*iterables):
    "roundrobin('ABC', 'D', 'EF') --> A D E B F C"
    iterators = deque(map(iter, iterables))
    while iterators:
        try:
            while True:
                yield next(iterators[0])
                iterators.rotate(-1)
        except StopIteration:
            # Remove an exhausted iterator.
            iterators.popleft()
```

#### 4. 删除第 n 个元素

可以使用 rotate(n)来轻松删除第 n 个元素

```python
def delete_nth(d, n):
    d.rotate(-n)
    d.popleft()
    d.rotate(n)
```

## 最小堆 heapq

**函 数**                                                        **描 述**

heappush(heap, x)                                将 x 压入堆中

heappop(heap)                                      从堆中弹出最小的元素

heapify(heap)                                         让列表具备堆特征

heapreplace(heap, x)                            弹出最小的元素，并将 x 压入堆中

nlargest(n, iter, key=None)                                      返回 iter 中 n 个最大的元素

nsmallest(n, iter, key=None)                                   返回 iter 中 n 个最小的元素

merge(\*iters, key=None, reverse=False) 合并多个有序列表形成单独一个有序列表

```python
>>> from heapq import *
>>> from random import shuffle
>>> data = list(range(10))
>>> shuffle(data)
>>> heap = []
>>> for n in data:
... heappush(heap, n)
...
>>> heap
[0, 1, 3, 6, 2, 8, 4, 7, 9, 5]
>>> heappush(heap, 0.5)
>>> heap
[0, 0.5, 3, 6, 1, 8, 4, 7, 9, 5, 2]
```

### **python 如何实现最大堆？**

```python
# 最简单的方案就是，给你的堆的元素加一个值，使值逆序排列。以下是示例代码。
import heapq
sss = 'abecgfidhjk'
ll = list(sss)
heapq.heapify(ll)
print(ll)
# ['a', 'b', 'e', 'c', 'g', 'f', 'i', 'd', 'h', 'j', 'k']
# 此时若想得到大顶堆
newl = [(-i, ll[i]) for i in range(len(ll))]
#print(newl)
heapq.heapify(newl)
# 此时已经按照第一个值变成了小顶堆，即变成了逆序
max_heap = list()
while newl:
    _, s = heapq.heappop(newl)
    max_heap.append(s)
```

## 计数器 Counter

```python
class collections.Counter([iterable-or-mapping])
```

Counter 是一个 dict 的子类，存着每个元素出现的次数，若访问不存在的元素会返回 0。

```python
c = Counter()                           # a new, empty counter
c = Counter('gallahad')                 # a new counter from an iterable
c = Counter({'red': 4, 'blue': 2})      # a new counter from a mapping
c = Counter(cats=4, dogs=8)             # a new counter from keyword args
```

直接以字典的方式去访问 Counter

```python
c['cats']         # return 4
c['cats'] += 1    # add one more cat
c['pigs']         # missing value will return 0
```

**elements()** 返回一个 iterator 根据每个元素的数量来访问所有元素（会忽略数量为 0 或负的元素）

```python
>>> c = Counter(a=4, b=2, c=0, d=-2)
>>> sorted(c.elements())
['a', 'a', 'a', 'a', 'b', 'b']
```

\***\*most_common\*\***([*n*]) 返回一个 tuple 列表，包含按元素数量排序的最常见的元素列表

```python
>>> Counter('abracadabra').most_common(3)
[('a', 5), ('b', 2), ('r', 2)]
```

\***\*subtract\*\***([*iterable-or-mapping*]) 两个 Counter 可以相减

```python
>>> c = Counter(a=4, b=2, c=0, d=-2)
>>> d = Counter(a=1, b=2, c=3, d=4)
>>> c.subtract(d)
>>> c
Counter({'a': 3, 'b': 0, 'c': -3, 'd': -6})
```

\***\*fromkeys\*\***(_iterable_) 没有对 Counter 实现该方法（dict 的类方法，用于根据 dict 的键生成一个新的 dict）

\***\*update\*\***([*iterable-or-mapping*]) 与 dict 的 update 一样

其他的一些操作：

```python
sum(c.values())                 # total of all counts
c.clear()                       # reset all counts
list(c)                         # list unique elements
set(c)                          # convert to a set
dict(c)                         # convert to a regular dictionary
c.items()                       # convert to a list of (elem, cnt) pairs
Counter(dict(list_of_pairs))    # convert from a list of (elem, cnt) pairs
c.most_common()[:-n-1:-1]       # n least common elements
+c                              # remove zero and negative counts

>>> c = Counter(a=3, b=1)
>>> d = Counter(a=1, b=2)
>>> c + d                       # add two counters together:  c[x] + d[x]
Counter({'a': 4, 'b': 3})
>>> c - d                       # subtract (keeping only positive counts)
Counter({'a': 2})
>>> c & d                       # intersection:  min(c[x], d[x])
Counter({'a': 1, 'b': 1})
>>> c | d                       # union:  max(c[x], d[x])
Counter({'a': 3, 'b': 2})

>>> c = Counter(a=2, b=-4)
>>> +c
Counter({'a': 2})
>>> -c
Counter({'b': 4})
```

## 随机队列 RandomizedQueue

::: info
自创数据结构，在工作中使用
:::

```python
class RandomizedQueue:
    def __init__(self, _iter=[]):
        self.arr = [*_iter]
    def append(self, val):
        self.arr.append(val)
    def remove(self, idx):
        if idx >= len(self.arr):
            return
        r = self.arr[idx]
        self.arr[idx] = self.arr[-1]  # 将最后一个元素移动到删除的元素位置
        self.arr.pop()
        return r
    def getRandom(self):
        if len(self.arr) == 0:
            return
        return self.arr[int(random.random() * len(self.arr))]
    def popRandom(self):
        if len(self.arr) == 0:
            return
        idx = int(random.random() * len(self.arr))
        return self.remove(idx)
    def __len__(self):
        return len(self.arr)
```

- 入队：O(1)
- 获取随机元素：O(1)
- 随机出队：O(1)
- 删除指定位置的元素：O(1)
