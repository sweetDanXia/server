const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    name: { type: String },
    avatar: { type: String },//头像
    title: { type: String }, //称号
    // 分类，例如：射手，需要关联的就写type: mongoose.SchemaTypes.ObjectId，ref代表关联之前的Category模型
    // category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    // 可能会有多个分类，categories复数，后面是数组
    categories: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Category" }],
    // 评分：包括难度、技能、攻击、生存，此处定义的是复合类型
    // 由此可见：模型字段可以定义为数组、普通字符串、对象(键值对)等
    scores: {
        difficult: { type: Number },//难度
        skills: { type: Number },//技能
        attack: { type: Number },//攻击
        survive: { type: Number }//生存
    },
    // 技能
    skills: [{
        icon: { type: String },
        name: { type: String },
        description: { type: String },
        tips: { type: String }//小提示
    }],
    // 顺风出装(关联物品)
    items1: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Items" }],
    // 逆风出装
    items2: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Items" }],
    // 使用技巧
    usageSkills: { type: String },
    // 对抗技巧
    battleSkills: { type: String },
    // 团战思路
    teamSkills: { type: String },
    // 英雄关系（搭档）
    partners: [{
        hero: { type: mongoose.SchemaTypes.ObjectId, ref: "Hero" },
        description: { type: String }
    }]
})

module.exports = mongoose.model('Hero', schema)