#### tutorials 文件编写位置
在docsBuild/tutorials 目录下的 `.md` 、`.html` 都会被检索编译成tutorials。

注意：docsBuild/tutorials 目录下可以是多级目录。

但tutorials没有树状结构。所有的`.md` `.html`文件都会被编译(包括子级目录下文件)，所以文件名不能重复

#### 支持 `markdown` 格式

以`.md`为后缀名

#### 支持 `html` 格式 案例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>example</title>
</head>
<body>
<div class="code-html">
    <h3> Base Example </h3>
    <p> Hello world </p>
</div>

<script class="code-js">
    console.log('hello world');
</script>
</body>
</html>
```

#### tutorials取别名

可以在 docsBuild/tutorials/examples.json 文件内进行配置

```json
{
  "README": {
    "title": "tutorials 编写规则"
  },
  "htmlExample": {
    "title": "html tutorials 例子"
  }
}

```