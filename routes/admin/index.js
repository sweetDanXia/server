// 导出一个函数
module.exports = app => {
    const express = require('express')
    const router = express.Router({
        mergeParams: true
    })
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
    app.use('/admin/api/rest/:resource', async (req, res, next) => {
        const modelName = require("inflection").classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router)

    // express本身获取不到上传文件的数据，需要中间件multer专门用来处理上传数据
    const multer = require('multer')
    // 定义上传中间件upload
    const upload = multer({ dest: __dirname + '/../../uploads' })
    // upload.single('file') 表示接收单个文件，而且接收file字段，也就是前端请求接口传过来的file字段
    app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
        // 本身在req里面是没有file的，因为用了upload  multer中间件，将上传文件的数据就赋值到req上了，所以一定要加upload，才会有req.flie
        const file = req.file
        // 拼接url返回给前端
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })
}