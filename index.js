const express = require("express")

// 定义app是express的实例
const app = express()

app.use(require('cors')())
app.use(express.json())

require('./plugins/db')(app)
require('./routes/admin')(app)

// 启动，在3000端口，同时传给它一个回调函数，里面表示启动后做什么，可以把接口地址log出来
app.listen(3000, () => {
    console.log('http://localhost:3000')
})