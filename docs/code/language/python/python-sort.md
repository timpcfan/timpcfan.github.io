---
title: Python排序 - sort
order: 7
category:
  - 笔记
  - API
tag:
  - Python
  - 排序
---

原文链接：[Sorting HOW TO - Python 3.10.4 documentation](https://docs.python.org/zh-cn/3.6/howto/sorting.html)

Python 列表内置的 list.sort()方法可以直接修改列表。另外 sorted()内置函数，可以传入迭代对象构建一个新的排序列表。

---

**`sorted`**(_iterable_, *\*\*, *key=None*, *reverse=False\*)

根据  *iterable*  中的项返回一个新的已排序列表。
具有两个可选参数，它们都必须指定为关键字参数。
*key*  指定带有单个参数的函数，用于从  *iterable*  的每个元素中提取用于比较的键 (例如  `key=str.lower`)。 默认值为  `None` (直接比较元素)。
*reverse*  为一个布尔值。 如果设为  `True`，则每个列表元素将按反向顺序比较进行排序。
使用  [functools.cmp_to_key()](https://docs.python.org/zh-cn/3.6/library/functools.html#functools.cmp_to_key)  可将老式的  *cmp*  函数转换为  *key*  函数。
内置的  [sorted()](https://docs.python.org/zh-cn/3.6/library/functions.html#sorted)  确保是稳定的。 如果一个排序确保不会改变比较结果相等的元素的相对顺序就称其为稳定的 — 这有利于进行多重排序（例如先按部门、再按薪级排序）。

---

## 基本排序

```python
>>> sorted([5, 2, 3, 1, 4])
[1, 2, 3, 4, 5]

>>> a = [5, 2, 3, 1, 4]
>>> a.sort()
>>> a
[1, 2, 3, 4, 5]
```

## key 函数

可以使用一个函数来指定排序使用的键

```python
>>> sorted("This is a test string from Andrew".split(), key=str.lower)
['a', 'Andrew', 'from', 'is', 'string', 'test', 'This']

>>> student_tuples = [
...     ('john', 'A', 15),
...     ('jane', 'B', 12),
...     ('dave', 'B', 10),
... ]
>>> sorted(student_tuples, key=lambda student: student[2])   # sort by age
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

## Operator 模块函数

上面显示的键函数模式非常常见，因此 Python 提供了便利功能，使访问器功能更容易，更快捷。  [operator](https://docs.python.org/zh-cn/3.6/library/operator.html#module-operator)  模块有  [itemgetter()](https://docs.python.org/zh-cn/3.6/library/operator.html#operator.itemgetter) 、 [attrgetter()](https://docs.python.org/zh-cn/3.6/library/operator.html#operator.attrgetter)  和  [methodcaller()](https://docs.python.org/zh-cn/3.6/library/operator.html#operator.methodcaller)  函数。

```python
>>> from operator import itemgetter, attrgetter

>>> sorted(student_tuples, key=itemgetter(2))
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
>>> sorted(student_objects, key=attrgetter('age'))
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]

# 也支持多级排序！
>>> sorted(student_tuples, key=itemgetter(1,2))
[('john', 'A', 15), ('dave', 'B', 10), ('jane', 'B', 12)]
>>> sorted(student_objects, key=attrgetter('grade', 'age'))
[('john', 'A', 15), ('dave', 'B', 10), ('jane', 'B', 12)]
```

## **升序和降序**

```python
>>> sorted(student_tuples, key=itemgetter(2), reverse=True)
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

## **排序稳定性和排序复杂度**

排序保证是  **[稳定](https://en.wikipedia.org/wiki/Sorting_algorithm#Stability)** 的。 这意味着当多个记录具有相同的键值时，将保留其原始顺序。

注意  *blue*  的两个记录如何保留它们的原始顺序，以便  `('blue', 1)`  保证在  `('blue', 2)`  之前。

这个美妙的属性允许你在一系列排序步骤中构建复杂的排序。例如，要按  *grade*  降序然后  *age*  升序对学生数据进行排序，请先  *age*  排序，然后再使用  *grade*  排序：

```python
>>> s = sorted(student_objects, key=attrgetter('age'))     # sort on secondary key
>>> sorted(s, key=attrgetter('grade'), reverse=True)       # now sort on primary key, descending
[('dave', 'B', 10), ('jane', 'B', 12), ('john', 'A', 15)]
```

Python 中使用的  [Timsort](https://en.wikipedia.org/wiki/Timsort)  算法可以有效地进行多种排序，因为它可以利用数据集中已存在的任何排序。

## **使用装饰-排序-去装饰的旧方法**

这个三个步骤被称为 Decorate-Sort-Undecorate ：

- 首先，初始列表使用控制排序顺序的新值进行修饰。
- 然后，装饰列表已排序。
- 最后，删除装饰，创建一个仅包含新排序中初始值的列表。

例如，要使用 DSU 方法按  *grade*  对学生数据进行排序：

```python
>>> decorated = [(student.grade, i, student) for i, student in enumerate(student_objects)]
>>> decorated.sort()
>>> [student for grade, i, student in decorated]               # undecorate
[('john', 'A', 15), ('jane', 'B', 12), ('dave', 'B', 10)]
```

这方法语有效是因为元组按字典顺序进行比较，先比较第一项；如果它们相同则比较第二个项目，依此类推。

不一定在所有情况下都要在装饰列表中包含索引  *i* ，但包含它有两个好处：

- 排序是稳定的——如果两个项具有相同的键，它们的顺序将保留在排序列表中。
- 原始项目不必具有可比性，因为装饰元组的排序最多由前两项决定。 因此，例如原始列表可能包含无法直接排序的复数。

这个方法的另一个名字是 Randal L. Schwartz 在 Perl 程序员中推广的  [Schwartzian transform](https://en.wikipedia.org/wiki/Schwartzian_transform)。

既然 Python 排序提供了键函数，那么通常不需要这种技术。

## 使用 cmp 参数的旧方法

本 HOWTO 中给出的许多结构都假定为 Python 2.4 或更高版本。在此之前，没有内置  [sorted()](https://docs.python.org/zh-cn/3.6/library/functions.html#sorted) ， [list.sort()](https://docs.python.org/zh-cn/3.6/library/stdtypes.html#list.sort)  也没有关键字参数。相反，所有 Py2.x 版本都支持  *cmp*  参数来处理用户指定的比较函数。

在 Py3.0 中， *cmp*  参数被完全删除（作为简化和统一语言努力的一部分，消除了丰富的比较与  `__cmp__()`  魔术方法之间的冲突）。

在 Py2.x 中， sort 允许一个可选函数，可以调用它来进行比较。该函数应该采用两个参数进行比较，然后返回负值为小于，如果它们相等则返回零，或者返回大于大于的正值。例如，我们可以这样做：

```python
>>> def numeric_compare(x, y):
...     return x - y
>>> sorted([5, 2, 4, 1, 3], cmp=numeric_compare)
[1, 2, 3, 4, 5]
```

或者你可反转比较的顺序：

```python
>>> def reverse_numeric(x, y):
...     return y - x
>>> sorted([5, 2, 4, 1, 3], cmp=reverse_numeric)
[5, 4, 3, 2, 1]
```

将代码从 Python 2.x 移植到 3.x 时，如果用户提供比较功能并且需要将其转换为键函数，则会出现这种情况。 以下包装器使这很容易：

```python
def cmp_to_key(mycmp):
    'Convert a cmp= function into a key= function'
    class K:
        def __init__(self, obj, *args):
            self.obj = obj
        def __lt__(self, other):
            return mycmp(self.obj, other.obj) < 0
        def __gt__(self, other):
            return mycmp(self.obj, other.obj) > 0
        def __eq__(self, other):
            return mycmp(self.obj, other.obj) == 0
        def __le__(self, other):
            return mycmp(self.obj, other.obj) <= 0
        def __ge__(self, other):
            return mycmp(self.obj, other.obj) >= 0
        def __ne__(self, other):
            return mycmp(self.obj, other.obj) != 0
    return K
```

要转换为键函数，只需包装旧的比较函数：

```python
>>> sorted([5, 2, 4, 1, 3], key=cmp_to_key(reverse_numeric))
[5, 4, 3, 2, 1]
```

在 Python 3.2 中， [functools.cmp_to_key()](https://docs.python.org/zh-cn/3.6/library/functools.html#functools.cmp_to_key)  函数被添加到标准库中的  [functools](https://docs.python.org/zh-cn/3.6/library/functools.html#module-functools)  模块中。
