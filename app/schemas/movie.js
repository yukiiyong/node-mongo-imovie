var mongoose=require('mongoose')//引入mongoose 建模模块
var Schema=mongoose.Schema
var ObjectId=Schema.Types.ObjectId

var MovieSchema = new Schema({ //定义数据库模式
	title: String,
	doctor:String,
	country:String,
	language:String,
	summary:String,
	flash:String,
	year:Number,
	poster:String,
	pv: {
		type: Number,
		default: 0
	},
	categories: [{
		type: ObjectId,
		ref: 'Category'
	}],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
})

//在数据保存之前进行的操作 pre save
MovieSchema.pre('save',function(next){  
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt=Date.now()
	}
	next()
})

 //静态方法，只有通过编译和模型实例化后才有这个方法
 MovieSchema.statics={
	fetch: function(cb){  //取出所有数据，并按照更新时间排序
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},
	findById: function(id,cb){   //通过id查找数据
		return this
		.findOne({_id:id})
		.exec(cb)
	}
}

module.exports=MovieSchema
