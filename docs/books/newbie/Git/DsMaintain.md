我们以Dslibs为例子，来说明如何使用Github上源码库

#### Fork一个自己的代码库分支

<img src="./images/GitFork/clipboard.png" width = "100%" alt="" align=center />

打开[https://github.com/lqloveball/DsLibs](https://github.com/lqloveball/DsLibs) 通过右上角 `Fork` 按钮 创建自己分支仓库


<img src="./images/GitFork/clipboard1.png" width = "100%" alt="" align=center />

在把创建好的自己分支库拉到clone到本地

#### 修改添加更新代码

<img src="./images/GitFork/clipboard2.png" width = "100%" alt="" align=center />

对分支内代码做出修改或者添加后。通过GitHub Desktop客户端进行`commit`后

<img src="./images/GitFork/clipboard3.png" width = "100%" alt="" align=center />

然后`push`到github线上

#### 向项目源发起请求更新合并操作

##### 合并步骤请求1
<img src="./images/GitFork/clipboard4.png" width = "100%" alt="" align=center />
##### 合并步骤请求2
<img src="./images/GitFork/clipboard5.png" width = "100%" alt="" align=center />
##### 合并步骤请求3
<img src="./images/GitFork/clipboard6.png" width = "100%" alt="" align=center />

以上主要步骤
`创建主仓库fork` 
`拉取到本地`
`修改代码`
`提交到fork仓库`
`fork仓库发起合并请求提交给主仓库`

!> 更新自己的分支仓库（在主分支有了变化后 我们的派生分支需要更新一下 不然你只在你当前版本修改 会和主分支冲突的）

#### 同步主仓库代码到自己分支仓库

<img src="./images/GitFork/clipboard7.png" width = "100%" alt="" align=center />
上图是在你自己的分支页面 这里会有提示。然后按着图片一步一步来吧

<img src="./images/GitFork/clipboard8.png" width = "100%" alt="" align=center />
<img src="./images/GitFork/clipboard9.png" width = "100%" alt="" align=center />
<img src="./images/GitFork/clipboard10.png" width = "100%" alt="" align=center />

这一页往下面拉:

<img src="./images/GitFork/clipboard11.png" width = "100%" alt="" align=center />

然后你线上的git分支就更新成最新的了
之后你本地在fatch一下 获取最新的 就能协同开发了
