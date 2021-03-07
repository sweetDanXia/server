// 导出一个函数
module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
    const jwt = require('jsonwebtoken')
    const AdminUser = require('../../models/AdminUser')
    const assert = require('http-assert')
    // 新建分类
    router.post('/', async (req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })
    // 分类列表
    router.get('/', async (req, res) => {
        const queryOption = {}
        if (req.Model.modelName == 'Category') {
            queryOption.populate = "parent"
        }
        const tableData = await req.Model.find().setOptions(queryOption).limit(10)
        res.send(tableData)
    })
    // 查看分类详情
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })
    // 编辑分类
    router.put('/:id', async (req, res) => {
        // 接收两个参数，第一个是id，第二个是body,通过id去找对应数据并更新
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 删除分类
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })
    const authMiddleWare = require('../../middleWare/auth')
    const resourceMiddleWare = require('../../middleWare/resource')
    app.use('/admin/api/rest/:resource', authMiddleWare(), resourceMiddleWare(), router)

    // express本身获取不到上传文件的数据，需要中间件multer专门用来处理上传数据
    const multer = require('multer')
    // 定义上传中间件upload
    const upload = multer({ dest: __dirname + '/../../uploads' })
    // upload.single('file') 表示接收单个文件，而且接收file字段，也就是前端请求接口传过来的file字段
    app.post('/admin/api/upload', authMiddleWare(), upload.single('file'), async (req, res) => {
        // 本身在req里面是没有file的，因为用了upload  multer中间件，将上传文件的数据就赋值到req上了，所以一定要加upload，才会有req.flie
        const file = req.file
        // 拼接url返回给前端
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })

    app.post('/admin/api/login', async (req, res) => {
        // 解构赋值
        const { username, password } = req.body
        // 1、根据用户名找用户
        // findOne是找一条数据，根据条件username来找，键值对
        // const user = AdminUser.findOne({
        //     username: username
        // })
        // 因为键和值一样，可以简写
        // 由于我们在前面设置了password: {select: false}，所以直接去user中获取密码是拿不到的，所以select('+password')表示查的时候把password字段取出来，默认是不取的，用+表示要取出来
        const user = await AdminUser.findOne({ username }).select('+password')
        assert(user, 422, "用户名不存在")
        // 2、校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, "密码错误")
        // 3、返回token
        const token = jwt.sign({ id: user._id }, app.get("secret"))
        res.send({ token })
    })

    // 错误处理函数
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}