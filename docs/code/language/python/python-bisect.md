---
title: Python二分查找 - bisect
order: 8
category:
  - 笔记
  - API
tag:
  - Python
  - 二分查找
---

## 二分查找模块 bisect

`bisect_left(a, x, lo=0, hi=len(a))`

相当于 left_bound，返回目标值的左侧边界，其返回值的解读：

- 解读 1：将 x 插入有序数组 a 中的最左侧索引
- 解读 2：a 中小于 x 的值的数量
- 解读 3：有序数组 a 中大于等于 x 的最小元素索引

---

`bisect_right(a, x, lo=0, hi=len(a))`

`bisect(a, x, lo=0, hi=len(a))`

⚠️ 不相当于 right_bound，返回目标值的右侧边界+1，其返回值的解读：

- 解读 1：将 x 插入有序数组 a 中的最右侧索引
- 解读 2：a 中小于等于 x 的值的数量
- 解读 3：有序数组 a 中大于 x 的最小元素索引（返回的索引位置的值肯定不等于 x！！！

---

`insort_left(a, x, lo=0, hi=len(a))`

等价于 a.insert(bisect.bisect_left(a, x, lo, hi), x)

---

`insort_right(a, x, lo=0, hi=len(a))`
`insort(a, x, lo=0, hi=len(a))`

等价于 a.insert(bisect.bisect_right(a, x, lo, hi), x)

---

```python
#idx 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
a = [0, 1, 2, 3, 3, 3, 3, 3, 5, 8]

>>> bisect_left(a, 3)
3
>>> bisect_right(a, 3)  # bisect(a, 3)
8
>>> bisect_left(a, 4)
8
>>> bisect_right(a, 4)
8
```

## python3.10 之后的版本新增参数 key

类似 sort 的 key 参数，可以指定搜索时使用的具体的键

例子：

```python
# leetcode #875
class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        def canEatAll(k):
            if k == 0:
                return False
            cost_time = 0
            for pile in piles:
                cost_time += math.ceil(pile / k)
            return cost_time <= h
        return bisect_left(range(max(piles) + 1), True, key=canEatAll)
```

::: warning
若使用这种方法解题，a 要包括所有的答案域，且如果使用 range，尽量使用 range(max_ans+1)的形式，若使用 range(min_ans, max_ans+1)，需要给返回的结果添加偏置 min_ans！
:::

## 在有序列表中搜索

如何将 bisect 转换为一般的搜索方法：

```python
def index(a, x):
    'Locate the leftmost value exactly equal to x'
    i = bisect_left(a, x)
    if i != len(a) and a[i] == x:
        return i
    raise ValueError

def find_lt(a, x):
    'Find rightmost value less than x'
    i = bisect_left(a, x)
    if i:
        return a[i-1]
    raise ValueError

def find_le(a, x):
    'Find rightmost value less than or equal to x'
    i = bisect_right(a, x)
    if i:
        return a[i-1]
    raise ValueError

def find_gt(a, x):
    'Find leftmost value greater than x'
    i = bisect_right(a, x)
    if i != len(a):
        return a[i]
    raise ValueError

def find_ge(a, x):
    'Find leftmost item greater than or equal to x'
    i = bisect_left(a, x)
    if i != len(a):
        return a[i]
    raise ValueError
```
