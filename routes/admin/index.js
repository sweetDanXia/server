// 导出一个函数
module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const Category = require('../../models/Category')
    // 新建分类
    router.post('/categories', async (req, res) => {
        const model = await Category.create(req.body)
        res.send(model)
    })
    // 分类列表
    router.get('/categories', async (req, res) => {
        const tableData = await Category.find().populate("parent").limit(10)
        res.send(tableData)
    })
    // 查看分类详情
    router.get('/categories/:id', async (req, res) => {
        const model = await Category.findById(req.params.id)
        res.send(model)
    })
    // 编辑分类
    router.put('/categories/:id', async (req, res) => {
        // 接收两个参数，第一个是id，第二个是body,通过id去找对应数据并更新
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })
    // 删除分类
    router.delete('/categories/:id', async (req, res) => {
        await Category.findByIdAndDelete(req.params.id)
        res.send({
            success: true
        })
    })
    app.use('/admin/api', router)
}