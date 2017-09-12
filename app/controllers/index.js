var mongoose=require('mongoose')
var Movie=require('../model/movie')

exports.index=function(req,res){
	Movie.fetch(function(err,movies){
		if (err){
			console.log(err)
		}
		res.render('index',{
			title:'imovie 首页',
			movies:movies
		})
	})
	
}  