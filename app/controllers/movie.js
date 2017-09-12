var mongoose=require('mongoose')
var Movie=require('../model/movie')
var Comment=require('../model/comment')
var _=require('underscore')
//movie new
exports.new=function(req,res){
	res.render('admin',{
		title:'imovie 后台录入页',
		movie:{
			title: 'imovie',
			doctor:'yu',
			country:'CN',
			language:'chinese',
			poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
			flash:'',
			year:'2014',
			summary:''

		}
	})
}
//movie update
exports.update=function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			res.render('admin',{
				title: 'imovie 后台更新页',
				movie:movie
			})
		})
	}
	
}
//save
exports.save=function(req,res){
	var id=req.body.movie._id //隐藏域存放id，如果id存在，为更新，否则为新建
	var movieObj=req.body.movie
	var _movie //用于存放要存入数据库的movie数据

	if(id!== 'undefined'){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			_movie=_.extend(movie,movieObj) //如果有更新，则movieObj代替查询到的movie数据
			_movie.save(function(err,movie){
				if (err){
					console.log(err)
				}

				res.redirect('/movie/'+movie._id)
			})
		})
	}
	else{
		_movie=new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function(err,movie){
			if (err){
				console.log(err)
			}

			res.redirect('/movie/'+movie._id)
		})
	}
}
//movie detail
exports.detail=function(req,res){
	var id=req.params.id
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err)
		}
	})
	Movie.findById(id,function(err,movie){
		if(err){
			console.log(err)
		}
		Comment
		.find({movie:id})
		.populate('from','name')
		.populate('reply.from reply.to','name')
		.exec(function(err,comments){
			res.render('detail',{
				title:'imovie 详情页',
				movie:movie,
				comments:comments
			})
		})

		

	})
	
}

//list page
exports.list=function(req,res){
	Movie.fetch(function(err,movies){
		if (err){
			console.log(err)
		}
		res.render('list',{
			title:'imooc 列表页',
			movies:movies
		})
	})
	
}

exports.delete=function(req,res){
	var id=req.query.id
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
				res.json({
					success:0
				})
			}
			else{
				res.json({
					success:1
				})
			}
		})
	}

}