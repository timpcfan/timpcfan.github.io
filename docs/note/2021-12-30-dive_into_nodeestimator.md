---
title: 2021/12/30 - Euler框架源码解读：深入探究NodeEstimator
date: 2021-12-30
isOriginal: true
category:
  - 学习
tag:
  - Euler
  - GNN框架
---

## Euler框架源码解读：深入探究NodeEstimator

::: tip
本文一探Euler的图采样流程，从代码层面深入分析NodeEstimator。第一次写这种源码分析的文章，由于调用栈略深，且鄙人文字功底薄弱，致使行文稍显繁琐，还望读者见谅。
:::

## Estimator的创建

NodeEstimator在训练时，会创建一个tf.estimator.Estimator来进行训练，我们首先来看一下tf.estimator.Estimator是如何创建的。

首先，NodeEstimator为BaseEstimator的子类，主要是重写了

- train_input_fn()：直接返回batch_size，会被get_train_from_input() 接收
- get_train_from_input()：采样inputs个节点，返回n_id（1-D tensor of nodes）

```python
class NodeEstimator(BaseEstimator):

    def __init__(self, model_class, params, run_config):
        super(NodeEstimator, self).__init__(model_class, params, run_config)

    def get_train_from_input(self, inputs, params):
        result = tf_euler.sample_node(inputs, params['train_node_type']) # 访问euler服务器进行采样
        result.set_shape([self.params['batch_size']]) 
        # set_shape用于提供额外shape信息，因为不能通过计算图来infer
        return result

    def train_input_fn(self):
        return self.params['batch_size']

    ...
```

再回到父类 BaseEstimator，在训练时调用 train() 方法，该方法会创建一个 tf.estimator.Estimator，并使用其进行训练。

这里有几个重要的函数需要关注：

- input_fn：用于模型数据的提供，这里就是前文提到[train_input_fn()](craftdocs://open?blockId=D0ADA26B-9672-4CA3-A399-CA6F5BB180EC&spaceId=4725d35f-0536-9d85-0a69-346665ba7ebe)，直接返回batch_size
- model_fn：用于模型的训练，返回的是包装好训练逻辑的tf.estimator.EstimatorSpec，这里传入的是 BaseEstimator._model_fn()

```python
class BaseEstimator(object):
    ...
    def train(self):
        estimator = tf.estimator.Estimator(
                model_fn=self._model_fn,
                params=self.params,
                config=self.run_config,
                model_dir=self.params['model_dir'])

        if self.profiling:
            hooks = [tf.train.ProfilerHook(50, output_dir="prof_dir")]
        else:
            hooks = []
        print (self.profiling, hooks)
        total_step = None
        try:
            total_step = self.params['total_step']
        except:
            total_step = None
        estimator.train(input_fn=self.train_input_fn,
                        hooks=hooks,
                        #steps=self.params['total_step'])
                        steps=total_step)
    ...
```

继续看 BaseEstimator._model_fn()，他是 tf.estimator.Estimator 输入的 model_fn，其签名固定为 features, labels, mode, params：

- features：input_fn 返回的第一项
- labels：input_fn 返回的第二项（这里没有）
- mode：train or eval
- params：一个装有超参数的dict
- 返回 tf.estimator.EstimatorSpec（指明了如何训练）

```python
class BaseEstimator(object):
    ...
    def _model_fn(self, features, mode, params):
        model = self.model_function
        if mode == tf.estimator.ModeKeys.TRAIN:
            spec = self.train_model_init(model, features, mode, params)
        elif mode == tf.estimator.ModeKeys.EVAL:
            spec = self.evaluate_model_init(model, features, mode, params)
        else:
            spec = self.infer_model_init(model, features, mode, params)
        return spec
    ...
```

可以看到，在训练时调用了 BaseEstimator.train_model_init()

```python
class BaseEstimator(object):
    ...
    def train_model_init(self, model, features, mode, params):
        source = self.get_train_from_input(features, params)  # 输入 features=batch_size 输出 n_id
        _, loss, metric_name, metric = model(source) # 输入 n_id 输出 loss（采样在内部进行）
        global_step = tf.train.get_or_create_global_step()
        optimizer = tf_euler.utils.optimizers.get(
                             params.get('optimizer', 'adam'))(
                             params.get('learning_rate', 0.001))
        train_op = optimizer.minimize(loss, global_step)
        hooks = []
        tensor_to_log = {'step': global_step,
                         'loss': loss,
                         metric_name: metric}
        hooks.append(
                tf.train.LoggingTensorHook(
                    tensor_to_log, every_n_iter=params.get('log_steps', 100)))
        spec = tf.estimator.EstimatorSpec(mode=mode,
                                          loss=loss,
                                          train_op=train_op,
                                          training_hooks=hooks)
        return spec
    ...
```

这里才是主要配置训练时Estimator的行为的地方：

1. 使用[get_train_from_input()](craftdocs://open?blockId=2DD583FB-B6B5-418A-BCBD-4351E60DDE1C&spaceId=4725d35f-0536-9d85-0a69-346665ba7ebe)来获取一个mini-batch的节点id
2. 将节点id输入模型model，得到损失函数
3. 生成训练op，以及一些辅助的指标
4. 创建tf.estimator.EstimatorSpec 并返回

## 消息传递流程

其实本文到这里就应该结束了，但是我还想要知道模型是如何采样的，消息是如何传递的，model里面具体做了什么，于是我们将NodeEstimator应用在一个具体的例子中，看看具体会发生什么。

以下是Euler官方的一个[例子](https://github.com/alibaba/euler/tree/master/examples/graphsage)的简化版：

```python
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import tensorflow as tf
import tf_euler

from euler_estimator import NodeEstimator
from graphsage import SupervisedGraphSage

config = tf.ConfigProto()
config.gpu_options.allow_growth = True

dataset = 'cora'
hidden_dim = 32
layers = 2
fanouts = [10, 10]
batch_size = 32
num_epochs = 10
log_steps = 20  # Number of steps to print log
model_dir = 'ckpt' # Model checkpoint
learning_rate = 0.01 # Learning rate
optimizer = 'adam' # Optimizer algorithm
run_mode = 'train' # Run mode

euler_graph = tf_euler.dataset.get_dataset(dataset)
euler_graph.load_graph()

dims = [hidden_dim] * (layers + 1)

if run_mode == 'train':
    metapath = [euler_graph.train_edge_type] * layers  # metapath = [['train'], ['train']]
else:
    metapath = [euler_graph.all_edge_type] * layers

num_steps = int((euler_graph.total_size + 1) // batch_size * num_epochs)

model = SupervisedGraphSage(dims, fanouts, metapath,
                            euler_graph.feature_idx,
                            euler_graph.feature_dim,
                            euler_graph.label_idx,
                            euler_graph.label_dim)

params = {'train_node_type': euler_graph.train_node_type[0],
          'batch_size': batch_size,
          'optimizer': optimizer,
          'learning_rate': learning_rate,
          'log_steps': log_steps,
          'model_dir': model_dir,
          'id_file': euler_graph.id_file,
          'infer_dir': model_dir,
          'total_step': num_steps}

config = tf.estimator.RunConfig(log_step_count_steps=None)

model_estimator = NodeEstimator(model, params, config)

if run_mode == 'train':
    model_estimator.train()
elif run_mode == 'evaluate':
    model_estimator.evaluate()
elif run_mode == 'infer':
    model_estimator.infer()
else:
    raise ValueError('Run mode not exist!')
```

传入的model为SupervisedGraphSage，定义如下：

```python
class SupervisedGraphSage(SuperviseModel):

    def __init__(self, dims, fanouts, metapath,
                 feature_idx, feature_dim,
                 label_idx, label_dim, max_id=-1):
        super(SupervisedGraphSage, self).__init__(label_idx,
                                                  label_dim)
        self.gnn = GNN('sage', 'sage', dims, fanouts, metapath,
                       feature_idx, feature_dim, max_id=max_id)

    def embed(self, n_id):
        return self.gnn(n_id)
```

其中，GNN为一个消息传递层，我们暂时不去关心，我们先来看一下他的父类tf_euler.python.mp_utils.base.SupervisedModel：

```python
class SuperviseModel(object):
    def __init__(self, label_idx, label_dim, metric_name='f1'):
        self.label_idx = label_idx
        self.label_dim = label_dim
        self.metric_name = metric_name
        self.metric_class = tf_euler.utils.metrics.get(metric_name)
        self.out_fc = tf.layers.Dense(label_dim, use_bias=False)

    def embed(self, n_id):
        raise NotImplementedError

    def __call__(self, inputs):
        label, = tf_euler.get_dense_feature(inputs,
                                            [self.label_idx],
                                            [self.label_dim])
        embedding = self.embed(inputs)
        logit = self.out_fc(embedding)

        metric = self.metric_class(
            label, tf.nn.sigmoid(logit))
        loss = tf.nn.sigmoid_cross_entropy_with_logits(
            labels=label, logits=logit)
        loss = tf.reduce_mean(loss)
        return (embedding, loss, self.metric_name, metric)
```

该类具体做了如下工作：

- 将得到的inputs（n_id）使用euler服务器获取节点对应的标签
- 使用embed()方法获取节点对应的embedding
- 通过out_fc（一个线性层）获取输出logit
- 计算metric和loss

这里还是没有采样的逻辑，于是我们可以推断采样的流程在之前忽略的GNN层中，我们反过来看GNN层：

```python
from tf_euler.python.mp_utils.base_gnn import BaseGNNNet
from tf_euler.python.mp_utils.base import SuperviseModel, UnsuperviseModel


class GNN(BaseGNNNet):

    def __init__(self, conv, flow,
                 dims, fanouts, metapath,
                 feature_idx, feature_dim,
                 add_self_loops=False,
                 max_id=-1, **kwargs):
        super(GNN, self).__init__(conv=conv,
                                  flow=flow,
                                  dims=dims,
                                  fanouts=fanouts,
                                  metapath=metapath,
                                  add_self_loops=add_self_loops,
                                  max_id=max_id,
                                  **kwargs)
        if not isinstance(feature_idx, list):
            feature_idx = [feature_idx]
        if not isinstance(feature_dim, list):
            feature_dim = [feature_dim]
        self.feature_idx = feature_idx
        self.feature_dim = feature_dim

    def to_x(self, n_id):
        x, = tf_euler.get_dense_feature(n_id,
                                        self.feature_idx,
                                        self.feature_dim)
        return x
```

GNN层只是重写了一个 to_x() 方法，只是将输入的节点id使用euler服务器转换为节点对应的特征。

于是我们继续去看他的父类tf_euler.python.mp_utils.base_gnn.BaseGNNNet：

```python
class BaseGNNNet(object):

    def __init__(self, conv, flow, dims,
                 fanouts, metapath,
                 add_self_loops=True,
                 max_id=-1,
                 **kwargs):
        conv_class = utils.get_conv_class(conv)
        flow_class = utils.get_flow_class(flow)
        if flow_class == 'whole':
            self.whole_graph = True
        else:
            self.whole_graph = False
        self.convs = []
        for dim in dims[:-1]:
            self.convs.append(self.get_conv(conv_class, dim))
        self.fc = tf.layers.Dense(dims[-1])
        self.sampler = flow_class(fanouts, metapath, add_self_loops, max_id=max_id)

    def get_conv(self, conv_class, dim):
        return conv_class(dim)

    def to_x(self, n_id):
        raise NotImplementedError

    def to_edge(self, n_id_src, n_id_dst, e_id):
        return e_id

    def get_edge_attr(self, block):
        n_id_dst = tf.cast(tf.expand_dims(block.n_id, -1),
                           dtype=tf.float32)
        n_id_src= mp_ops.gather(n_id_dst, block.res_n_id)
        n_id_src = mp_ops.gather(n_id_src,
                                 block.edge_index[0])
        n_id_dst = mp_ops.gather(n_id_dst,
                                 block.edge_index[1])
        n_id_src = tf.cast(tf.squeeze(n_id_src, -1), dtype=tf.int64)
        n_id_dst = tf.cast(tf.squeeze(n_id_dst, -1), dtype=tf.int64)
        edge_attr = self.to_edge(n_id_src, n_id_dst, block.e_id)
        return edge_attr



    def calculate_conv(self, conv, inputs, edge_index,
                       size=None, edge_attr=None):
        return conv(inputs, edge_index, size=size, edge_attr=edge_attr)

    def __call__(self, n_id):
        data_flow = self.sampler(n_id)
        num_layers = len(self.convs)
        x = self.to_x(data_flow[0].n_id)
        for i, conv, block in zip(range(num_layers), self.convs, data_flow):
            if block.e_id is None:
                edge_attr = None
            else:
                edge_attr = self.get_edge_attr(block)
            x_src = mp_ops.gather(x, block.res_n_id)
            x_dst = None if self.whole_graph else x
            x = self.calculate_conv(conv,
                                    (x_src, x_dst),
                                    block.edge_index,
                                    size=block.size,
                                    edge_attr=edge_attr)
            x = tf.nn.relu(x)
        x = self.fc(x)
        return x
```

初始化时，他获取了两个类对象：

- conv_class：卷积汇聚方法，这里是：tf_euler.python.convolution.SAGEConv
- flow_class：图抽样方法，这里是：tf_euler.python.dataflow.SageDataFlow

### 图抽样方法：构造消息传递的路径——DataFlow

使用flow_class创建了一个采样器sampler，我们来看一下这个sampler的定义：

```python
from tf_euler.python.dataflow.neighbor_dataflow import UniqueDataFlow

class SageDataFlow(UniqueDataFlow):
    def __init__(self, fanouts, metapath,
                 add_self_loops=True,
                 max_id=-1,
                 **kwargs):
        super(SageDataFlow, self).__init__(num_hops=len(metapath),
                                           add_self_loops=add_self_loops)
        self.fanouts = fanouts
        self.metapath = metapath
        self.max_id = max_id

    def get_neighbors(self, n_id):
        neighbors = []
        neighbor_src = []
        for hop_edge_types, count in zip(self.metapath, self.fanouts):
            n_id = tf.reshape(n_id, [-1])
            one_neighbor, _w, _ = tf_euler.sample_neighbor(
                n_id, hop_edge_types, count, default_node=self.max_id+1)
            neighbors.append(tf.reshape(one_neighbor, [-1]))
            node_src = tf.range(tf.size(n_id))
            node_src = tf.tile(tf.reshape(node_src, [-1, 1]), [1, count])
            node_src = tf.reshape(node_src, [-1])
            neighbor_src.append(node_src)
            new_n_id = tf.reshape(one_neighbor, [-1])
            n_id = tf.concat([new_n_id, n_id], axis=0)
            n_id, _ = tf.unique(tf.reshape(n_id, [-1]))
        return neighbors, neighbor_src
```

单看这个类看不出什么，我们需要找到调用他的__call__()方法，在父类中找：

```python
class UniqueDataFlow(NeighborDataFlow):
    def __init__(self, num_hops,
                 add_self_loops=True):
        super(UniqueDataFlow, self).__init__(num_hops=num_hops,
                                             add_self_loops=add_self_loops)

    def produce_subgraph(self, n_id):
        n_id = tf.reshape(n_id, [-1])
        inv = tf.range(tf.size(n_id))
        last_idx = inv

        data_flow = DataFlow(n_id)
        n_neighbors, n_edge_src = self.get_neighbors(n_id)
        for i in range(self.num_hops):
            new_n_id = n_neighbors[i]
            edge_src = n_edge_src[i]

            new_n_id = tf.concat([new_n_id, n_id], axis=0)
            new_n_id, new_inv = tf.unique(new_n_id)
            res_n_id = new_inv[-tf.size(n_id):]
            if self.add_self_loops:
                edge_src = tf.concat([edge_src, last_idx], axis=0)
                last_idx = tf.range(tf.size(new_n_id))
            else:
                new_inv = new_inv[:-tf.size(n_id)]
                last_idx = new_inv

            n_id = new_n_id
            edge_dst = new_inv
            edge_index = tf.stack([edge_src, edge_dst], 0)
            e_id = None
            data_flow.append(new_n_id, res_n_id, e_id, edge_index)
        return data_flow
```

同样没有__call__()方法，继续去父类找：

```python
from tf_euler.python.dataflow.base_dataflow import DataFlow


class NeighborDataFlow(object):
    def __init__(self, num_hops,
                 add_self_loops=True,
                 **kwargs):
        self.num_hops = num_hops
        self.add_self_loops = add_self_loops

    def get_neighbors(self, n_id):
        '''
        The neighbor sampler in a mini-batch of n_id.
        It returns: neighbors: a list of 'tensor';
                    neighbor_src: a list of 'tensor'
        Input:
          n_id: input nodes
        Output:
          neighbors: [[n_id's neighbor], [n_id's neighbor's neighbor], ...]
          neighbor_src: [[n_neighbor_src], [n_neighbor_neighbor_src], ...]
        '''
        raise NotImplementedError()

    def produce_subgraph(self, n_id):  # 生成计算图（多个二分图）
        n_id = tf.reshape(n_id, [-1])
        inv = tf.range(tf.size(n_id))
        last_idx = inv

        data_flow = DataFlow(n_id)
        n_neighbors, n_edge_src = self.get_neighbors(n_id)
        for i in range(self.num_hops):
            new_n_id = n_neighbors[i]
            edge_src = n_edge_src[i]

            new_n_id = tf.concat([new_n_id, n_id], axis=0)
            new_inv = tf.range(tf.size(new_n_id))
            res_n_id = new_inv[-tf.size(n_id):]
            if self.add_self_loops:
                edge_src = tf.concat([edge_src, last_idx], axis=0)
                last_idx = new_inv
            else:
                new_inv = new_inv[:-tf.size(n_id)]
                last_idx = new_inv

            n_id = new_n_id
            edge_dst = new_inv
            edge_index = tf.stack([edge_src, edge_dst], 0)
            e_id = None
            data_flow.append(new_n_id, res_n_id, e_id, edge_index)
        return data_flow

    def __call__(self, n_id):
        producer = self.produce_subgraph
        return producer(n_id)
```

这次终于有了。。具体来说就是传入n_id需要采样的节点id，调用produce_subgraph()方法来获取消息传递用的计算图。该方法的目的为创建一个消息传递的DataFlow，DataFlow是一个Block的列表，以下是两者的定义：

```python
class Block(object):
    def __init__(self, n_id, res_n_id, e_id, edge_index, size):
        self.n_id = n_id  # 二分图中消息传递的起点
        self.res_n_id = res_n_id  # 二分图中消息传递的终点
        self.e_id = e_id  # edge_index中边的id
        self.edge_index = edge_index  # 二分图的边，[2, edge_sizes]
        self.size = size  # 二分图的形状 (M, N)


class DataFlow(object):
    def __init__(self, n_id):
        self.n_id = n_id
        self.__last_n_id__ = n_id
        self.blocks = []

    def append(self, n_id, res_n_id, e_id, edge_index):
        size = [tf.shape(self.__last_n_id__)[0], tf.shape(n_id)[0]]
        block = Block(n_id, res_n_id, e_id, edge_index, size)
        self.blocks.append(block)
        self.__last_n_id__ = n_id

    def __len__(self):
        return len(self.blocks)

    def __getitem__(self, idx):
        return self.blocks[::-1][idx]

    def __iter__(self):
        for block in self.blocks[::-1]:
            yield block
```

- Block是一个表示消息传递的二分图，二分图两边的节点分别为n_id 与 res_n_id，n_id，消息将会从 n_id 表示的节点传递到 res_n_id 表示的节点。
- Block的形状定义成(M, N)， M为src, N为dst，但在Euler中，消息是从dst传递给src的（这点与PyG的实现不同）。
- n_id 为节点原本的id，而res_n_id使用的是n_id数组的索引。（这个在后面的代码中会有体现）
- DataFlow是多个Block的列表，表示消息从第k阶邻居一级一级传递到目标节点的全部过程。每传递一级都使用一个二分图Block表示其经过的节点。
- 由于邻居采样的过程与消息传递的方向是相反的，所以可以看到DataFlow的__getitem__与__iter__方法中都是从后往前遍历的。

UniqueDataFlow重写了NeighborDataFlow中的produce_subgraph()方法，于是我们直接来看UniqueDataFlow类的produce_subgraph()方法，由于下面的代码中有两种节点编号方式，容易混乱，我直接在代码中逐行加上注释，便于理解：

```python
# 注：Euler框架中，边的方向指向的为邻居采样的方向，源节点（src）的邻居为其边指向的其他节点（dst），与消息传递的方向相反的。
# 注：以下用词中，"节点编号"表示节点全局的编号，"索引"表示n_id数组的下标
def produce_subgraph(self, n_id):
    n_id = tf.reshape(n_id, [-1])  # n_id 为需要采样的源节点编号
    inv = tf.range(tf.size(n_id))  # inv 为 n_id的索引
    last_idx = inv  # 保留最后一次的索引，即源节点的索引

    data_flow = DataFlow(n_id)  # 创建空的DataFlow，将n_id作为邻居采样的起点
    n_neighbors, n_edge_src = self.get_neighbors(n_id)  # 获取k阶的邻居
    # neighbors：一个列表：[[n_id的邻居], [n_id的邻居的邻居], …]
    # n_edge_src：一个列表：[[n_neighbor_src], [n_neighbor_neighbor_src], …]，表示neighbors中邻居对应的源节点索引
    for i in range(self.num_hops):
        new_n_id = n_neighbors[i] # new_n_id表示本轮邻居节点编号（dst）
        edge_src = n_edge_src[i]  # edge_src表示本轮邻居的源节点索引（src）

        new_n_id = tf.concat([new_n_id, n_id], axis=0)
        new_n_id, new_inv = tf.unique(new_n_id) # 将邻居节点与源节点编号取一个并集，并获得新节点的索引（作为边的终点）
        res_n_id = new_inv[-tf.size(n_id):]  # res_n_id为n_id的新索引，即源节点在下一级节点列表中的索引
        
        # 下面这块主要是为了更新last_idx，分为两种情况
        if self.add_self_loops:  # 添加自环边
            edge_src = tf.concat([edge_src, last_idx], axis=0) # 将源节点的索引添加到邻居的源节点索引后面，作为边的源节点
            last_idx = tf.range(tf.size(new_n_id)) # 保存源节点索引
        else:  # 不添加自环边
            new_inv = new_inv[:-tf.size(n_id)] # 不添加自环边的话，把之前加入的多余索引去除掉
            last_idx = new_inv

        n_id = new_n_id
        edge_dst = new_inv
        edge_index = tf.stack([edge_src, edge_dst], 0)
        e_id = None
        data_flow.append(new_n_id, res_n_id, e_id, edge_index)
    return data_flow
```

![IMG_8059.jpeg](https://res.craft.do/user/full/4725d35f-0536-9d85-0a69-346665ba7ebe/doc/388FCB1A-9845-4F79-9ED4-97E689DD8ED0/14D5F7CE-B0DB-4ED5-8194-28A4F9F94F38_2/IMG_8059.jpeg)

关于两种不同的方向

再来看一下get_neighbors(n_id)的具体实现：

```python
from tf_euler.python.dataflow.neighbor_dataflow import UniqueDataFlow

class SageDataFlow(UniqueDataFlow):
    def __init__(self, fanouts, metapath,
                 add_self_loops=True,
                 max_id=-1,
                 **kwargs):
        super(SageDataFlow, self).__init__(num_hops=len(metapath),
                                           add_self_loops=add_self_loops)
        self.fanouts = fanouts
        self.metapath = metapath
        self.max_id = max_id

    def get_neighbors(self, n_id):
        neighbors = []
        neighbor_src = []
        for hop_edge_types, count in zip(self.metapath, self.fanouts):
            n_id = tf.reshape(n_id, [-1])
            one_neighbor, _w, _ = tf_euler.sample_neighbor(
                n_id, hop_edge_types, count, default_node=self.max_id+1)
            neighbors.append(tf.reshape(one_neighbor, [-1]))
            node_src = tf.range(tf.size(n_id))
            node_src = tf.tile(tf.reshape(node_src, [-1, 1]), [1, count])
            node_src = tf.reshape(node_src, [-1])
            neighbor_src.append(node_src)
            new_n_id = tf.reshape(one_neighbor, [-1])
            n_id = tf.concat([new_n_id, n_id], axis=0)
            n_id, _ = tf.unique(tf.reshape(n_id, [-1]))
        return neighbors, neighbor_src
```

- 调用get_neighbors(n_id)对节点进行邻居采样，得到的结果为两个列表：
   - neighbors: [[n_id的邻居], [n_id的邻居的邻居], …]
   - neighbor_src: [[n_neighbor_src], [n_neighbor_neighbor_src], …]
   - 具体例子如下图，当n_id=[1,2,3]时，得到下图的结果：

![Image.png](https://res.craft.do/user/full/4725d35f-0536-9d85-0a69-346665ba7ebe/doc/388FCB1A-9845-4F79-9ED4-97E689DD8ED0/6965899C-7D53-471A-A1CF-167280644C82_2/Image.png)

- 从源节点开始，调用tf_euler.sample_neighbor方法采样源节点的第一阶邻居，并且会根据metapath，以及fanouts，来确定要采样的邻居的类型以及数量。之后再循环，直到采样完k阶邻居。

至此，我们介绍完了消息传递路径是如何构造的，接下来，看一下消息是如何聚合的，也就是图卷积模块。

### 卷积汇聚方法：将邻居消息进行汇聚——SageConv

回来看一下BaseGNNNet的__call__方法：

```python
class BaseGNNNet(object):
    ...
    def __call__(self, n_id):
        data_flow = self.sampler(n_id)
        num_layers = len(self.convs)
        x = self.to_x(data_flow[0].n_id)
        for i, conv, block in zip(range(num_layers), self.convs, data_flow):
            if block.e_id is None:
                edge_attr = None
            else:
                edge_attr = self.get_edge_attr(block)
            x_src = mp_ops.gather(x, block.res_n_id)
            x_dst = None if self.whole_graph else x
            x = self.calculate_conv(conv,
                                    (x_src, x_dst),
                                    block.edge_index,
                                    size=block.size,
                                    edge_attr=edge_attr)
            x = tf.nn.relu(x)
        x = self.fc(x)
        return x
```

- 获取消息传递路径DataFlow：上文提及的表示消息传递路径的列表，由多个二分图构成。
- 获取dst节点（消息的发出方）的特征：x
- 进行循环：
   - 获取边的属性：edge_attr
   - 获取src节点（消息的接收方）的特征：x_src
   - 使用定义的conv模块进行卷积计算，完成一层的消息传递
   - 对卷积完的隐藏特征使用非线形激活函数
- 进行完k次循环后，消息已经从k阶邻居汇聚到源节点
- 再使用线形层对特征进行最后一轮映射

这里主要是由一个conv模块完成的卷积操作，我们使用SageConv作为例子继续深入研究：

```python
class SAGEConv(conv.Conv):

    def __init__(self, dim, **kwargs):
        super(SAGEConv, self).__init__(aggr='mean', **kwargs)
        self.self_fc = tf.layers.Dense(dim, use_bias=False)
        self.neigh_fc = tf.layers.Dense(dim, use_bias=False)

    def __call__(self, x, edge_index, size=None, **kwargs):
        gather_x, = self.gather_feature([x], edge_index)
        out = self.apply_edge(gather_x[1])
        out = mp_ops.scatter_(self.aggr, out, edge_index[0], size=size[0])
        out = self.apply_node(out, x[0])
        return out

    def apply_edge(self, x_j):
        return x_j

    def apply_node(self, aggr_out, x):
        return self.self_fc(x) + self.neigh_fc(aggr_out)
```

重点在__call__方法，首先调用了一个gather_feature的方法，该方法在其父类conv.Conv中进行了定义，该方法实际上就是将二分图两边的特征，即源节点的特征与目标节点的特征，细节不作介绍，具体代码如下：

```python
class Conv(object):

    def __init__(self, aggr='add'):
        self.aggr = aggr
        assert self.aggr in ['add', 'mean', 'max']

    def gather_feature(self, features, edge_index):
        convert_features = []

        for feature in features:
            convert_feature = []
            assert isinstance(feature, tuple) or isinstance(feature, list)
            assert len(feature) == 2
            if feature[1] is None:
                feature[1] = feature[0]
            for idx, tmp in enumerate(feature):
                if tmp is not None:
                    tmp = mp_ops.gather(tmp, edge_index[idx])
                convert_feature.append(tmp)
            convert_features.append(convert_feature)
        return convert_features

    def apply_edge(self, x_j):
        return x_j

    def apply_node(self, aggr_out):
        return aggr_out
```

注意，Euler的消息传递方向是dst到src，所以在SAGEConv的__call__方法中，先获取了dst的特征gather_x[1]，再使用mp_ops.scatter_方法，再SAGEConv里面具体会调用mp_ops.scatter_mean方法，该方法会将输入的特征矩阵out，按照edge_index[0]的索引进行聚合，再对聚合后的每一堆行向量求平均。其实这也就是将邻居出现的所有特征聚合到一起（加在一起）再求个平均，得到了聚合后的结果。

![Image.jpeg](https://res.craft.do/user/full/4725d35f-0536-9d85-0a69-346665ba7ebe/doc/388FCB1A-9845-4F79-9ED4-97E689DD8ED0/6ADCD963-8D09-43F7-AFC2-062C801367C0_2/Image.jpeg)

scatter_mean方法将特征按照索引进行聚合

至此，我们就看完了图卷积模块的具体实现。

对于用户来说，其实不需要关注一个模块的内部是如何实现的，直接调用外部接口完成需要的任务就行，但是处于学习与研究的目的，还是选择看一看源码，一是可以学习代码具体实现，二是在使用的时候也更有把握一点，遇到问题也更容易快速定位。

芜湖，总算把这个笔记写完了。。。第一次写读源码的笔记，还真不容易。


