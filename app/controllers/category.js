var mongoose=require('mongoose')
var Category=require('../model/category')

exports.list=function(req,res){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		res.render('categorylist',{
			title:'分类列表页',
			categories:categories
		})
	})

}
exports.save=function(req,res){
	var categoryObj=req.body.category
	Category.findOne({name:categoryObj.name},function(err,category){
		if(category){
			res.redirect('/admin/category/list')
		}
		else{
			var _category=new Category(categoryObj)
			_category.save(function(err,category){
				if(err){
					console.log(err)
				}
				res.redirect('/admin/category/list')
			})
		}
	})
}
exports.del=function(req,res){
	var id=req.query.id
	if(id){
		Category.remove({_id:id},function(err,category){
			if(err){
				console.log(err)
				res.json({success:0})
			}
			else{
				res.json({
					success:1
				})
			}
		})
	}
}
