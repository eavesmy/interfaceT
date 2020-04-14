## 接口测试页面
接口测试工具，支持 ws / http / https 接口测试

## ⚠️    注意
1. 记得调整服务器允许跨域。
2. 功能不完善，如使用服务器做代理发送请求、记录相关的一些功能未完成，有空会慢慢写的。

## 使用
1. 打开 ```http://itt.eva7base.com``` 或 ```https://itt.eva7base.com```
2. 上传配置文件    
配置文件格式：
```
// 在Interface中注册一个配置

Interface.Register({
    method: "POST",
    path: "http://127.0.0,1/user/info",
    readme: "该接口说明",
    params: {
        uid: "123",
        uid2: String // 可以填写变量或类型
    },
    headers: {
        "Content-Type": "application/json"
    },
    callback: async ctx => {  // 可以使用 async/await

        let token = ctx.res.headers.get("x-token");
        Interface.SetHeader("my-token",token); // 调用 Interface.SetHeader，接下来的请求头都会带此字段

        console.log(ctx.body) // 解析后的 payload.

        ctx.msg = "会展示到 res 中"
        ctx.status = true // 默认 res.code == 200 情况下为 true,用户也可以根据需要更改.
        ctx.obj = {
            token: "展示到对象面板中"
        }
    }
})

// ws 请求示例 
Interface.Register({
    method: "ws://",
    path: ": "127.0.0.1/user/msg",
    readme: "用户获取行情",
    headers: HEADERS,
    callback: async ctx => {
    }
});

// 配置实质是一个js文件，所以您可以按照您自己的需求来编写。

Interface.Register(...);
```
3. 开始执行测试
4. 生成接口文档，会生成一个简单的 html 页面。若不执行测试直接生成文档则res中没有数据结构。

## 修改页面或功能
页面使用 svelte 开发.    
欢迎 rp 及提 issue 来帮助该工具做更好的改进。
```
git clone https://github.com/eavesmy/interfaceT
cd interfaceT
npm i
npm run dev
```
