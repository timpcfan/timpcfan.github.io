---
title: Python异步I/O与协程
order: 31
category:
  - 笔记
  - API
tag:
  - Python
  - 并发
  - 异步IO
  - 协程
---

::: warning
这里实际上就是官方文档的搬运，非常不完整，建议直接看[官方文档](https://docs.python.org/zh-cn/3.10/library/asyncio.html)。
:::

## asyncio — 异步 I/O & 协程

协程运行的原理见： [协程的原理以及代码](python-concurrent.md#协程的原理以及代码)

asyncio 是用来编写  **并发**  代码的库，使用  **async/await**  语法。

asyncio 被用作多个提供高性能 Python 异步框架的基础，包括网络和网站服务，数据库连接库，分布式任务队列等等。

asyncio 往往是构建 IO 密集型和高层级  **结构化**  网络代码的最佳选择。

asyncio 提供一组  **高层级** API 用于:

- 并发地  [运行 Python 协程](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#coroutine)  并对其执行过程实现完全控制;
- 执行  [网络 IO 和 IPC](https://docs.python.org/zh-cn/3.10/library/asyncio-stream.html#asyncio-streams);
- 控制  [子进程](https://docs.python.org/zh-cn/3.10/library/asyncio-subprocess.html#asyncio-subprocess);
- 通过  [队列](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio-queues)  实现分布式任务;
- [同步](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio-sync)  并发代码;

此外，还有一些  **低层级** API 以支持  *库和框架的开发者*  实现:

- 创建和管理  [事件循环](https://docs.python.org/zh-cn/3.10/library/asyncio-eventloop.html#asyncio-event-loop)，以提供异步 API 用于  [网络化](https://docs.python.org/zh-cn/3.10/library/asyncio-eventloop.html#asyncio.loop.create_server), 运行  [子进程](https://docs.python.org/zh-cn/3.10/library/asyncio-eventloop.html#asyncio.loop.subprocess_exec)，处理  [OS 信号](https://docs.python.org/zh-cn/3.10/library/asyncio-eventloop.html#asyncio.loop.add_signal_handler)  等等;
- 使用  [transports](https://docs.python.org/zh-cn/3.10/library/asyncio-protocol.html#asyncio-transports-protocols)  实现高效率协议;
- 通过 async/await 语法  [桥接](https://docs.python.org/zh-cn/3.10/library/asyncio-future.html#asyncio-futures)  基于回调的库和代码。

## 协程与任务 [^1]

[^1]: [协程与任务](https://docs.python.org/zh-cn/3/library/asyncio-task.html)

### 协程

通过 async/await 关键字来定义的协程是一种被推荐的编写异步程序的方式。

下面的代码定义并运行了一个协程：

```python
>>> import asyncio

>>> async def main():
...     print('hello')
...     await asyncio.sleep(1)
...     print('world')

>>> asyncio.run(main())
hello
world
```

注意：简单地调用一个协程并不会使其被调度执行。

```python
>>> main()
<coroutine object main at 0x1053bb7c8>
```

要正在运行一个协程，asyncio 提供了三种主要机制：

1. `asyncio.run()` 函数用来运行最高层级的入口点 “main()” 函数
2. `await` 一个协程。以下代码会在等待 1 秒后打印“hello”，然后等待 2 秒后打印“world”。（await 一个协程会让其开始运行，并等待其完成）

   ```python
   import asyncio
   import time

   async def say_after(delay, what):
       await asyncio.sleep(delay)
       print(what)

   async def main():
       print(f"started at {time.strftime('%X')}")

       await say_after(1, 'hello')
       await say_after(2, 'world')

       print(f"finished at {time.strftime('%X')}")

   asyncio.run(main())

   # started at 17:13:52
   # hello
   # world
   # finished at 17:13:55
   ```

3. `asyncio.create_task()` 函数用来并发运行作为 asyncio 任务的多个协程。（create_task()之后会使任务出于就绪状态随时准备运行，而 await task 则是等待这个任务运行完成）

   ```python
   async def main():
       task1 = asyncio.create_task(
           say_after(1, 'hello'))

       task2 = asyncio.create_task(
           say_after(2, 'world'))

       print(f"started at {time.strftime('%X')}")

       # Wait until both tasks are completed (should take
       # around 2 seconds.)
       await task1
       await task2

       print(f"finished at {time.strftime('%X')}")

   # 比上面的要快1秒，因为两个task是同时运行的
   # started at 17:14:32
   # hello
   # world
   # finished at 17:14:34
   ```

### 可等待对象 awaitable objects

如果一个对象可以在 await 语句中使用，那么它就是 awaitable 对象。许多 asyncio API 都被设计为接受 awaitable 对象。

可等待 对象有三种主要类型：协程（Coroutine）、任务（Task）、Future。

### 协程

Python 协程属于可等待对象，因此可以在其他协程中被等待：

```python
import asyncio

async def nested():
    return 42

async def main():
    # Nothing happens if we just call "nested()".
    # A coroutine object is created but not awaited,
    # so it *won't run at all*.
    nested()  # 这个不会运行，只是单纯返回了一个coroutine对象

    # Let's do it differently now and await it:
    print(await nested())  # will print "42".  # 这里会运行，因为有await

asyncio.run(main())
```

**重要**

在本文档中 "协程" 可用来表示两个紧密关联的概念:

- _协程函数_: 定义形式为  `[async def](https://docs.python.org/zh-cn/3/reference/compound_stmts.html#async-def)`  的函数;
- _协程对象_: 调用  *协程函数*  所返回的对象。

### 任务

Task 被用来 “并行地” 调度协程。

当一个协程通过 asyncio.create_task() 等函数被封装为了一个 Task，该协程会被自动调度执行：

```python
import asyncio

async def nested():
    return 42

async def main():
    # Schedule nested() to run soon concurrently
    # with "main()".
    task = asyncio.create_task(nested())  # 这里 task 就开始运行了

    # "task" can now be used to cancel "nested()", or
    # can simply be awaited to wait until it is complete:
    await task  # 这里只是单纯地等待其运行完

asyncio.run(main())
```

### Futures

Future 是一种特殊的 **低层级** 可等待对象，表示一个异步操作的 **最终结果**。

当一个 Future 对象 _被等待_，这意味着协程将保持等待直到该 Future 对象在其他地方操作完毕。

在 asyncio 中需要 Future 对象以便允许 async/await 使用基于回调的代码。

通常情况下 **没有必要** 在应用层级的代码中创建 Future 对象。

Future 对象有时会由库和某些 asyncio API 暴露给用户，用作可等待对象：

```python
async def main():
    await function_that_returns_a_future_object()

    # this is also valid:
    await asyncio.gather(
        function_that_returns_a_future_object(),
        some_python_coroutine()
    )
```

一个很好的返回对象的低层级函数的示例是：loop.run_in_executor()

### 运行 asyncio 程序

`asyncio.run(coro, *, debug=False)`

执行 coro 并返回结果。

吃函数会运行传入的协程，负责管理 asyncio 事件循环，终结异步生成器，并关闭线程池。

但有其他 asyncio 事件循环在同一线程中运行时，此函数不能被调用。

如果 debug 为 True，事件循环将以调试模式运行。

此函数**总是会创建一个新的事件循环**并在结束时关闭之。它应当用作 asyncio 程序的主入口点，理想情况下应当只被调用一次。

```python
async def main():
    await asyncio.sleep(1)
    print('hello')

asyncio.run(main())
```

### 创建任务

`asyncio.create_task(coro, *, name=None)`

将 coro 封装为一个 Task 并调度其执行。返回 Task 对象。

name 不为 None 时，它将使用 Task.set_name() 来设为任务的名称。

该任务会在 get_running_loop() 返回的循环中执行，如果当前线程没有在运行的循环则会引发 RuntimeError。

::: info
需要保存这个方法返回值 Task 的引用，因为 event_loop 中只会保存一个弱引用，如果不保存引用，可能这个协程没有被执行完毕就被垃圾回收给清理了。
:::

```python
background_tasks = set()

for i in range(10):
    task = asyncio.create_task(some_coro(param=i))

    # Add task to the set. This creates a strong reference.
    background_tasks.add(task)

    # To prevent keeping references to finished tasks forever,
    # make each task remove its own reference from the set after
    # completion:
    task.add_done_callback(background_tasks.discard)
```

### 休眠

`coroutine asyncio.sleep(delay, result=None)`

阻塞 delay 指定的秒数。

如果指定了 result，则当协程完成时 result 其返回给调用者。

sleep() 总是会挂起当前任务，以允许其他任务运行。

将 delay 设为 0 将提供一个经优化的路径以允许其他任务运行。 这可供长期间运行的函数使用以避免在函数调用的全过程中阻塞事件循环。

以下协程示例运行 5 秒，每秒显示一次当前日期:

```python
import asyncio
import datetime

async def display_date():
    loop = asyncio.get_running_loop()
    end_time = loop.time() + 5.0
    while True:
        print(datetime.datetime.now())
        if (loop.time() + 1.0) >= end_time:
            break
        await asyncio.sleep(1)

asyncio.run(display_date())
```

### 并发运行任务

`awaitable asyncio.gather(*aws, return_exceptions=False)`

_并发_ 运行 aws 序列中的 可等待对象。

如果 aws 中的某个可等待对象为协程，它将自动被作为一个任务调度。

如果所有可等待对象都成功完成，结果将是一个由所有返回值聚合而层的列表。结果值的顺序与 aws 中可等待对象的**顺序一致**。

如果 return_exceptions 为 False，所引发的首个异常会立即传播给等待 gather() 的任务。aws 序列中的其他可等待对象 **不会被取消** 并继续运行。

如果 return_exceptions 为 True，异常会和成功的结果一样处理，并聚合至结果列表。

如果 gather() 被取消，所有被提交（尚未完成）的可等待对象也会 被取消。

如果 aws 序列中的任一 Task 或 Future 对象 被取消，它将被当作引发了 CancelledError 一样处理 — 在此情况下 gather() 调用 **不会** 被取消。这是为了防止一个已提交的 Task/Future 被取消导致其他 Tasks/Future 也被取消。

```python
import asyncio

async def factorial(name, number):
    f = 1
    for i in range(2, number + 1):
        print(f"Task {name}: Compute factorial({number}), currently i={i}...")
        await asyncio.sleep(1)
        f *= i
    print(f"Task {name}: factorial({number}) = {f}")
    return f

async def main():
    # Schedule three calls *concurrently*:
    L = await asyncio.gather(
        factorial("A", 2),
        factorial("B", 3),
        factorial("C", 4),
    )
    print(L)

asyncio.run(main())

# Expected output:
#
#     Task A: Compute factorial(2), currently i=2...
#     Task B: Compute factorial(3), currently i=2...
#     Task C: Compute factorial(4), currently i=2...
#     Task A: factorial(2) = 2
#     Task B: Compute factorial(3), currently i=3...
#     Task C: Compute factorial(4), currently i=3...
#     Task B: factorial(3) = 6
#     Task C: Compute factorial(4), currently i=4...
#     Task C: factorial(4) = 24
#     [2, 6, 24]
```

::: info
如果  *return_exceptions*  为 False，则在 gather() 被标记为已完成后取消它将不会取消任何已提交的可等待对象。 例如，在将一个异常传播给调用者之后，gather 可被标记为已完成，因此，在从 gather 捕获一个（由可等待对象所引发的）异常之后调用  `gather.cancel()`  将不会取消任何其他可等待对象。
:::

### 屏蔽取消操作

`awaitable asyncio.shield(aw)`

保护一个  [可等待对象](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio-awaitables)  防止其被  [取消](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task.cancel)。

如果  *aw*  是一个协程，它将自动被作为任务调度。

以下语句:

`res = **await** shield(something())`

相当于:

`res = **await** something()`

*不同之处*  在于如果包含它的协程被取消，在  `something()`  中运行的任务不会被取消。从  `something()`  的角度看来，取消操作并没有发生。然而其调用者已被取消，因此 "await" 表达式仍然会引发[CancelledError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.CancelledError)。

### 超时

`coroutine asyncio.wait_for(aw, timeout)`

等待  *aw* [可等待对象](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio-awaitables)  完成，指定 timeout 秒数后超时。

如果  *aw*  是一个协程，它将自动被作为任务调度。

*timeout*  可以为  `None`，也可以为 float 或 int 型数值表示的等待秒数。如果  *timeout*  为  `None`，则等待直到完成。

如果发生超时，任务将取消并引发  [asyncio.TimeoutError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.TimeoutError).

要避免任务  [取消](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task.cancel)，可以加上  [shield()](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.shield)。

此函数将等待直到 Future 确实被取消，所以总等待时间可能超过  *timeout*。 如果在取消期间发生了异常，异常将会被传播。

如果等待被取消，则  *aw*  指定的对象也会被取消。

```python
async def eternity():
    # Sleep for one hour
    await asyncio.sleep(3600)
    print('yay!')

async def main():
    # Wait for at most 1 second
    try:
        await asyncio.wait_for(eternity(), timeout=1.0)
    except asyncio.TimeoutError:
        print('timeout!')

asyncio.run(main())

# Expected output:
#
#     timeout!
```

### 简单等待

并发地运行  *aws*  可迭代对象中的  [可等待对象](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio-awaitables)  并进入阻塞状态直到满足  *return_when*  所指定的条件。

*aws*  可迭代对象必须不为空。

返回两个 Task/Future 集合: `(done, pending)`。

用法：

`done, pending = **await** asyncio.wait(aws)`

如指定  *timeout* (float 或 int 类型) 则它将被用于控制返回之前等待的最长秒数。

请注意此函数不会引发  [asyncio.TimeoutError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.TimeoutError)。当超时发生时，未完成的 Future 或 Task 将在指定秒数后被返回。

*return_when*  指定此函数应在何时返回。它必须为以下常数之一:

| 常量            | 描述                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------- |
| FIRST_COMPLETED | 函数将在任意可等待对象结束或取消时返回。                                                      |
| FIRST_EXCEPTION | 函数将在任意可等待对象因引发异常而结束时返回。当没有引发任何异常时它就相当于  ALL_COMPLETED。 |
| ALL_COMPLETED   | 函数将在所有可等待对象结束或取消时返回。                                                      |

`asyncio.as_completed(aws, *, timeout=None)`

并发地运行  *aws*  可迭代对象中的  [可等待对象](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio-awaitables)。 返回一个协程的迭代器。 所返回的每个协程可被等待以从剩余的可等待对象的可迭代对象中获得最早的下一个结果。

如果在所有 Future 对象完成前发生超时则将引发  [asyncio.TimeoutError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.TimeoutError)。

```python
for coro in as_completed(aws):
    earliest_result = await coro
    # ...
```

### 在线程中运行

`coroutine asyncio.to_thread(func, /, *args, **kwargs)`

在不同的线程中异步地运行函数  *func*。

向此函数提供的任何 *args 和 \*\*kwargs 会被直接传给  *func\*。 并且，当前  [contextvars.Context](https://docs.python.org/zh-cn/3/library/contextvars.html#contextvars.Context)  会被传播，允许在不同的线程中访问来自事件循环的上下文变量。

返回一个可被等待以获取  *func*  的最终结果的协程。

这个协程函数主要是用于执行在其他情况下会阻塞事件循环的 IO 密集型函数/方法。 例如:

```python
def blocking_io():
    print(f"start blocking_io at {time.strftime('%X')}")
    # Note that time.sleep() can be replaced with any blocking
    # IO-bound operation, such as file operations.
    time.sleep(1)
    print(f"blocking_io complete at {time.strftime('%X')}")

async def main():
    print(f"started main at {time.strftime('%X')}")

    await asyncio.gather(
        asyncio.to_thread(blocking_io),
        asyncio.sleep(1))

    print(f"finished main at {time.strftime('%X')}")

asyncio.run(main())

# Expected output:
#
# started main at 19:50:53
# start blocking_io at 19:50:53
# blocking_io complete at 19:50:54
# finished main at 19:50:54
```

在任何协程中直接调用  blocking_io() 将会在调用期间阻塞事件循环，导致额外的 1 秒运行时间。 而通过改用  asyncio.to_thread()，我们可以在不同的线程中运行它从而不会阻塞事件循环。

### 跨线程调度

`asyncio.run_coroutine_threadsafe(coro, loop)`

向指定事件循环提交一个协程。（线程安全）

返回一个  [concurrent.futures.Future](https://docs.python.org/zh-cn/3/library/concurrent.futures.html#concurrent.futures.Future)  以等待来自其他 OS 线程的结果。

此函数应该从另一个 OS 线程中调用，而非事件循环运行所在线程。示例:

```python
# Create a coroutine
coro = asyncio.sleep(1, result=3)

# Submit the coroutine to a given loop
future = asyncio.run_coroutine_threadsafe(coro, loop)

# Wait for the result with an optional timeout argument
assert future.result(timeout) == 3
```

如果在协程内产生了异常，将会通知返回的 Future 对象。它也可被用来取消事件循环中的任务:

```python
try:
    result = future.result(timeout)
except concurrent.futures.TimeoutError:
    print('The coroutine took too long, cancelling the task...')
    future.cancel()
except Exception as exc:
    print(f'The coroutine raised an exception: {exc!r}')
else:
    print(f'The coroutine returned: {result!r}')
```

参见  [concurrency and multithreading](https://docs.python.org/zh-cn/3/library/asyncio-dev.html#asyncio-multithreading)  部分的文档。

不同与其他 asyncio 函数，此函数要求显式地传入  *loop*  参数。

### 内省

`asyncio.**current_task**(*loop=None*)`

返回当前运行的  [Task](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task)  实例，如果没有正在运行的任务则返回  `None`。
如果  *loop*  为  `None`  则会使用  [get_running_loop()](https://docs.python.org/zh-cn/3/library/asyncio-eventloop.html#asyncio.get_running_loop)  获取当前事件循环。

`asyncio.**all_tasks**(*loop=None*)`

返回事件循环所运行的未完成的  [Task](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task)  对象的集合。
如果  *loop*  为  `None`，则会使用  [get_running_loop()](https://docs.python.org/zh-cn/3/library/asyncio-eventloop.html#asyncio.get_running_loop)  获取当前事件循环。

### Task 对象

`class asyncio.Task(coro, *, loop=None, name=None)`

一个与  `[Future 类似](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.Future)`  的对象，可运行 Python [协程](https://docs.python.org/zh-cn/3/library/asyncio-task.html#coroutine)。非线程安全。

Task 对象被用来在事件循环中运行协程。如果一个协程在等待一个 Future 对象，Task 对象会挂起该协程的执行并等待该 Future 对象完成。当该 Future 对象  *完成*，被打包的协程将恢复执行。

事件循环使用协同日程调度: 一个事件循环每次运行一个 Task 对象。而一个 Task 对象会等待一个 Future 对象完成，该事件循环会运行其他 Task、回调或执行 IO 操作。

使用高层级的  [asyncio.create_task()](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.create_task)  函数来创建 Task 对象，也可用低层级的  [loop.create_task()](https://docs.python.org/zh-cn/3/library/asyncio-eventloop.html#asyncio.loop.create_task)  或  [ensure_future()](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.ensure_future)  函数。不建议手动实例化 Task 对象。

要取消一个正在运行的 Task 对象可使用  [cancel()](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task.cancel)  方法。调用此方法将使该 Task 对象抛出一个  [CancelledError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.CancelledError)  异常给打包的协程。如果取消期间一个协程正在等待一个 Future 对象，该 Future 对象也将被取消。

[cancelled()](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task.cancelled)  可被用来检测 Task 对象是否被取消。如果打包的协程没有抑制  [CancelledError](https://docs.python.org/zh-cn/3/library/asyncio-exceptions.html#asyncio.CancelledError)  异常并且确实被取消，该方法将返回  `True`。

[asyncio.Task](https://docs.python.org/zh-cn/3/library/asyncio-task.html#asyncio.Task)  从  [Future](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.Future)  继承了其除  [Future.set_result()](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.Future.set_result)  和  [Future.set_exception()](https://docs.python.org/zh-cn/3/library/asyncio-future.html#asyncio.Future.set_exception)  以外的所有 API。

Task 对象支持  [contextvars](https://docs.python.org/zh-cn/3/library/contextvars.html#module-contextvars)  模块。当一个 Task 对象被创建，它将复制当前上下文，然后在复制的上下文中运行其协程。

- cancel(msg=None)：取消任务，这将抛出 CancelledError
- done()：如果 Task 对象已完成，则返回 true
- result()：返回 Task 的结果
- add_done_callback(callback, \*, context=None)：添加一个回调，在 Task 完成时调用。

## Stream 流 [^2]

[^2]: [Stream 流](https://docs.python.org/zh-cn/3.10/library/asyncio-stream.html)

流是用于处理网络连接的支持 async/await 的高层级原语。 流允许发送和接收数据，而不需要使用回调或低级协议和传输。

### Stream 函数

- open_connection
- start_server

### Unix 套接字（Socket）

- open_unix_connection
- start_unix_server

### StreamReader 与 StreamWriter

### 例子：echo 服务器与客户端

```python
import asyncio

async def handle_echo(reader, writer):
    data = await reader.read(100)
    message = data.decode()
    addr = writer.get_extra_info('peername')

    print(f"Received {message!r} from {addr!r}")

    print(f"Send: {message!r}")
    writer.write(data)
    await writer.drain()

    print("Close the connection")
    writer.close()

async def main():
    server = await asyncio.start_server(
        handle_echo, '127.0.0.1', 8888)

    addrs = ', '.join(str(sock.getsockname()) for sock in server.sockets)
    print(f'Serving on {addrs}')

    async with server:
        await server.serve_forever()

asyncio.run(main())
```

```python
import asyncio

async def tcp_echo_client(message):
    reader, writer = await asyncio.open_connection(
        '127.0.0.1', 8888)

    print(f'Send: {message!r}')
    writer.write(message.encode())

    data = await reader.read(100)
    print(f'Received: {data.decode()!r}')

    print('Close the connection')
    writer.close()

asyncio.run(tcp_echo_client('Hello World!'))
```

## 同步原语 [^3]

[^3]: [同步原语](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html)

asyncio 同步原语被设计为与  [threading](https://docs.python.org/zh-cn/3.10/library/threading.html#module-threading)  模块的类似，但有两个关键注意事项:

- asyncio 原语不是线程安全的，因此它们不应被用于 OS 线程同步 (而应当使用  [threading](https://docs.python.org/zh-cn/3.10/library/threading.html#module-threading))；
- 这些同步原语的方法不接受  *timeout*  参数；请使用  [asyncio.wait_for()](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio.wait_for)  函数来执行带有超时的操作。

asyncio 具有下列基本同步原语:

### Lock

`class asyncio.Lock`

实现一个用于 asyncio 任务的互斥锁。 非线程安全。

asyncio 锁可被用来保证对共享资源的独占访问。

使用 Lock 的推荐方式是通过  `[async with](https://docs.python.org/zh-cn/3.10/reference/compound_stmts.html#async-with)`  语句:

```python
lock = asyncio.Lock()

# ... later
async with lock:
    # access shared state
```

这等价于：

```python
lock = asyncio.Lock()

# ... later
await lock.acquire()
try:
    # access shared state
finally:
    lock.release()
```

`coroutine acquire()`

获取锁。
此方法会等待直至锁为  *unlocked*，将其设为  *locked*  并返回  `True`。
当有一个以上的协程在  [acquire()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Lock.acquire)  中被阻塞则会等待解锁，最终只有一个协程会被执行。
锁的获取是  *公平的*: 被执行的协程将是第一个开始等待锁的协程。

`release()`

释放锁。

当锁为  *locked*  时，将其设为  *unlocked*  并返回。

如果锁为  *unlocked*，则会引发  [RuntimeError](https://docs.python.org/zh-cn/3.10/library/exceptions.html#RuntimeError)。

`locked()`

如果锁为  *locked*  则返回  `True`。

### Event

`class asyncio.Event`

事件对象。 该对象不是线程安全的。

asyncio 事件可被用来通知多个 asyncio 任务已经有事件发生。

Event 对象会管理一个内部旗标，可通过  [set()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.set)  方法将其设为  *true*  并通过  [clear()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.clear)  方法将其重设为  *false*。 [wait()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.wait)  方法会阻塞直至该旗标被设为  *true*。 该旗标初始时会被设为  *false*。

```python
async def waiter(event):
    print('waiting for it ...')
    await event.wait()
    print('... got it!')

async def main():
    # Create an Event object.
    event = asyncio.Event()

    # Spawn a Task to wait until 'event' is set.
    waiter_task = asyncio.create_task(waiter(event))

    # Sleep for 1 second and set the event.
    await asyncio.sleep(1)
    event.set()

    # Wait until the waiter task is finished.
    await waiter_task

asyncio.run(main())
```

`coroutine wait()`

等待直至事件被设置。

如果事件已被设置，则立即返回  `True`。 否则将阻塞直至另一个任务调用  [set()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.set)。

`set()`

设置事件。

所有等待事件被设置的任务将被立即唤醒。

`clear()`

清空（取消设置）事件。

通过  [wait()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.wait)  进行等待的任务现在将会阻塞直至  [set()](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#asyncio.Event.set)  方法被再次调用。

`is_set()`

如果事件已被设置则返回  `True`。

### Condition

[https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#condition](https://docs.python.org/zh-cn/3.10/library/asyncio-sync.html#condition)

### Semaphore

### BoundedSemaphore

## 队列集合 [^4]

[^4]: [队列集合](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html)

asyncio 队列被设计成与  [queue](https://docs.python.org/zh-cn/3.10/library/queue.html#module-queue)  模块类似。尽管 asyncio 队列不是线程安全的，但是他们是被设计专用于 async/await 代码。

注意 asyncio 的队列没有  *timeout*  形参；请使用  [asyncio.wait_for()](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio.wait_for)  函数为队列添加超时操作。

参见下面的  [Examples](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#examples)  部分。

### Queue

`class asyncio.Queue(maxsize=0)`

FIFO 队列

如果  *maxsize*  小于等于零，则队列尺寸是无限的。如果是大于  `0`  的整数，则当队列达到  *maxsize*  时， `await put()`  将阻塞至某个元素被  [get()](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio.Queue.get)  取出。

不像标准库中的并发型  [queue](https://docs.python.org/zh-cn/3.10/library/queue.html#module-queue) ，队列的尺寸一直是已知的，可以通过调用  [qsize()](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio.Queue.qsize)  方法返回。

- maxsize
- empty()
- full()
- coroutine join()
- get_nowait() 不阻塞的出队
- coroutine join() 阻塞至队列中所有的元素都被接收和处理完毕。
  - 当条目添加到队列的时候，未完成任务的计数就会增加。每当消费协程调用  [task_done()](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio.Queue.task_done)表示这个条目已经被回收，该条目所有工作已经完成，未完成计数就会减少。当未完成计数降到零的时候， [join()](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio.Queue.join)阻塞被解除。
- coroutine put(item)
- put_nowait(item) 不阻塞的入队
- qsize()
- task_done() 表明前面排队的任务已经完成，即 get 出来的元素相关操作已经完成。

### 优先级队列

`class asyncio.PriorityQueue`

[Queue](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio.Queue)  的变体；按优先级顺序取出条目 (最小的先取出)。

条目通常是  `(priority_number, data)`  形式的元组。

### **后进先出队列**

`class asyncio.LifoQueue`

### 例子

```python
import asyncio
import random
import time

async def worker(name, queue):
    while True:
        # Get a "work item" out of the queue.
        sleep_for = await queue.get()

        # Sleep for the "sleep_for" seconds.
        await asyncio.sleep(sleep_for)

        # Notify the queue that the "work item" has been processed.
        queue.task_done()

        print(f'{name} has slept for {sleep_for:.2f} seconds')

async def main():
    # Create a queue that we will use to store our "workload".
    queue = asyncio.Queue()

    # Generate random timings and put them into the queue.
    total_sleep_time = 0
    for _ in range(20):
        sleep_for = random.uniform(0.05, 1.0)
        total_sleep_time += sleep_for
        queue.put_nowait(sleep_for)

    # Create three worker tasks to process the queue concurrently.
    tasks = []
    for i in range(3):
        task = asyncio.create_task(worker(f'worker-{i}', queue))
        tasks.append(task)

    # Wait until the queue is fully processed.
    started_at = time.monotonic()
    await queue.join()
    total_slept_for = time.monotonic() - started_at

    # Cancel our worker tasks.
    for task in tasks:
        task.cancel()
    # Wait until all worker tasks are cancelled.
    await asyncio.gather(*tasks, return_exceptions=True)

    print('====')
    print(f'3 workers slept in parallel for {total_slept_for:.2f} seconds')
    print(f'total expected sleep time: {total_sleep_time:.2f} seconds')

asyncio.run(main())
```

## 事件循环 [^5]

[^5]: [事件循环](https://docs.python.org/zh-cn/3.10/library/asyncio-eventloop.html)

### **前言**

事件循环是每个 asyncio 应用的核心。 事件循环会运行异步任务和回调，执行网络 IO 操作，以及运行子进程。

应用开发者通常应当使用高层级的 asyncio 函数，例如  [asyncio.run()](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio.run)，应当很少有必要引用循环对象或调用其方法。 本节所针对的主要是低层级代码、库和框架的编写者，他们需要更细致地控制事件循环行为。

## 高层级 API 索引 [^6]

[^6]: [高层级 API 索引](https://docs.python.org/zh-cn/3.10/library/asyncio-api-index.html)

这个页面列举了所有能用于 async/wait 的高层级 asyncio API 集。

### 任务

运行异步程序，创建 Task 对象，等待多件事运行超时的公共集。

| run()                      | 创建事件循环，运行一个协程，关闭事件循环。 |
| -------------------------- | ------------------------------------------ |
| create_task()              | 启动一个 asyncio 的 Task 对象。            |
| await sleep()              | 休眠几秒。                                 |
| await gather()             | 并发执行所有事件的调度和等待。             |
| await wait_for()           | 有超时控制的运行。                         |
| await shield()             | 屏蔽取消操作                               |
| await wait()               | 完成情况的监控器                           |
| current_task()             | 返回当前 Task 对象                         |
| all_tasks()                | 返回事件循环中所有的 task 对象。           |
| Task                       | Task 对象                                  |
| to_thread()                | 在不同的 OS 线程中异步地运行一个函数。     |
| run_coroutine_threadsafe() | 从其他 OS 线程中调度一个协程。             |
| for in as_completed()      | 用  for  循环监控完成情况。                |

**例子**

- [使用 asyncio.gather() 并行运行](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio-example-gather).
- [使用 asyncio.wait_for() 强制超时](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio-example-waitfor).
- [撤销协程](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio-example-task-cancel).
- [asyncio.sleep() 的用法](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio-example-sleep).
- 请主要参阅  [协程与任务文档](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#coroutine).

### **队列集**

队列集被用于多个异步 Task 对象的运行调度，实现连接池以及发布/订阅模式。

| Queue         | 先进先出队列   |
| ------------- | -------------- |
| PriorityQueue | 优先级队列。   |
| LifoQueue     | 后进先出队列。 |

**例子**

- [使用 asyncio.Queue 在多个并发任务间分配工作量](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio-example-queue-dist).
- 请参阅  [队列集文档](https://docs.python.org/zh-cn/3.10/library/asyncio-queue.html#asyncio-queues).

### 子进程集

用于生成子进程和运行 shell 命令的工具包。

| await create_subprocess_exec()  | 创建一个子进程。      |
| ------------------------------- | --------------------- |
| await create_subprocess_shell() | 运行一个 shell 命令。 |

**例子**

- [执行一个 shell 命令](https://docs.python.org/zh-cn/3.10/library/asyncio-subprocess.html#asyncio-example-subprocess-shell).
- 请参阅  [子进程 APIs](https://docs.python.org/zh-cn/3.10/library/asyncio-subprocess.html#asyncio-subprocess)  相关文档.

### 流

用于网络 IO 处理的高级 API 集。

| await open_connection()      | 建立一个 TCP 连接。                   |
| ---------------------------- | ------------------------------------- |
| await open_unix_connection() | 建立一个 Unix socket 连接。           |
| await start_server()         | 启动 TCP 服务。                       |
| await start_unix_server()    | 启动一个 Unix 套接字服务。            |
| StreamReader                 | 接收网络数据的高级 async/await 对象。 |
| StreamWriter                 | 发送网络数据的高级 async/await 对象。 |

**例子**

- [TCP 客户端样例](https://docs.python.org/zh-cn/3.10/library/asyncio-stream.html#asyncio-example-stream).
- 请参阅  [streams APIs](https://docs.python.org/zh-cn/3.10/library/asyncio-stream.html#asyncio-streams)  文档。

### **同步**

能被用于 Task 对象集的，类似线程的同步基元组件。

| Lock             | 互斥锁。       |
| ---------------- | -------------- |
| Event            | 事件对象。     |
| Condition        | 条件对象       |
| Semaphore        | 信号量         |
| BoundedSemaphore | 有界的信号量。 |

### **异常**

| asyncio.TimeoutError   | 类似  wait_for()  等函数在超时时候被引发。请注意  asyncio.TimeoutError  与内建异常  TimeoutError  无关。 |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| asyncio.CancelledError | 当一个 Task 对象被取消的时候被引发。请参阅  Task.cancel()。                                              |

**例子**

- [在取消请求发生的运行代码中如何处理 CancelledError 异常](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio-example-task-cancel).
- 请参阅完整的  [asyncio 专用异常](https://docs.python.org/zh-cn/3.10/library/asyncio-exceptions.html#asyncio-exceptions)  列表.

## 关于 never-awaited 协程

当协程函数被调用而不是被等待时 (即执行  `coro()`  而不是  `await coro()`) 或者协程没有通过  [asyncio.create_task()](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio.create_task)  被排入计划日程，asyncio 将会发出一条  [RuntimeWarning](https://docs.python.org/zh-cn/3.10/library/exceptions.html#RuntimeWarning):

```python
import asyncio

async def test():
    print("never scheduled")

async def main():
    test()

asyncio.run(main())

# test.py:7: RuntimeWarning: coroutine 'test' was never awaited
#  test()
```

通常的修复方法是 `await` 协程或者调用  [asyncio.create_task()](https://docs.python.org/zh-cn/3.10/library/asyncio-task.html#asyncio.create_task)  函数:

```python
async def main():
    await test()  # 开始运行并等待完成

async def main():
        task = asyncio.create_task(test())  # 开始运行
        await task  # 等待完成
```
