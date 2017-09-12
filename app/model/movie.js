var mongoose= require('mongoose') //引入mongoose模块
var MovieSchema =require('../schemas/movie') //引入movieschema
var Movie=mongoose.model('Movie',MovieSchema) //把movieSchema转成模型

module.exports= Movie   //导出构造函数