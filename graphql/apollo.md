
Apollo Server

## 介绍
`Apollo`是行业标准GraphQL的实现。

## Schema
schema 用来描述GraphQL的数据模型。他可以指定 `query`、`mutations`,以及数据结果等。
* query：相当于 RestFUL 中的 get 请求，用来查询数据；
* mutations：相当于 RestFUL 中的 post、put 请求,用来更新数据；
* type:  用来定义类型;
* input: 用来定义输入类型。

## Resolvers 
`解析器`,告诉 Apollo Server ，每个 Query 和 Redolver 的绑定关系，让它知道如何获取数据。

## 关系

`Schema` 需要映射到 Resolvers

## Resolver type signature

```javascript
(parent, args, context, info)
```

* parent：父级别的Resolver 返回的结果
* args： 查询参数
* context：上下文
* info: 查询状态信息

