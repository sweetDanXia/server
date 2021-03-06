const express = require("express")

// 定义app是express的实例
const app = express()

app.use(require('cors')())
app.use(express.json())
// 表示uploads路径下面的东西都是静态文件，用express.static()静态托管，同时加上__dirname，/uploads，使得静态文件可以通过/uploads来访问
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)

// 启动，在3000端口，同时传给它一个回调函数，里面表示启动后做什么，可以把接口地址log出来
app.listen(3000, () => {
    console.log('http://localhost:3000')
})