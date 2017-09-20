var mongoose=require('mongoose')
var Movie=require('../model/movie')
var Category=require('../model/category')

exports.index=function(req,res){
	Category
	.find({})
	.populate({
		path:'movies',
		select:'title poster',
		options:{limit : 6}
	})
	.exec(function(err,categories){
		if (err){
			console.log(err)
		}
		res.render('index',{
			title:'imovie 首页',
			categories: categories
		}) 
	})
}  

exports.search=function(req,res){
	var catId=req.query.cat
	var q=req.query.q
	var page=parseInt(req.query.p,10) || 0
	var count=4
	var index=page*count
	if(catId){
		Category
			.find({_id:catId})
			.populate({
				path:'movies',
				select:'title poster'
			})
			.exec(function(err,categories){
			if (err) {
				console.log(err)
			}
			var category = categories[0] || {}
			var movies=category.movies || []
			var results=movies.slice(index,index+count)

			res.render('result',{
				title:'imovie',
				key:category.name,
				movies:results,
				query:'cat='+catId,
				totalPage:Math.ceil(movies.length/count),
				currentPage:(page + 1)
			})
		})
	}else{
		Movie
			.find({title: new RegExp(q+'.*','i')})
			.exec(function(err,movies){
				if (err) {
					console.log(err)
				}
				var results=movies.slice(index, index + count)

				res.render('result',{
					title: 'imovie',
					key:q,
					query:'q'+q,
					currentPage:(page+1),
					totalPage:Math.ceil(movies.length/count),
					movies:results

				})
			})
		}
}