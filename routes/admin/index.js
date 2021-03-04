// 导出一个函数
module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const Category = require('../../models/Category')
    router.post('/categories', async (req, res) => {
        const model = await Category.create(req.body)
        res.send(model)
    })
    router.get('/categories', async (req, res) => {
        const tableData = await Category.find().limit(10)
        res.send(tableData)
    })
    app.use('/admin/api', router)
}