const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String },
    icon: { type: String } //保存图片地址，String类型，图片的话内容太大
})

module.exports = mongoose.model('Item', schema)