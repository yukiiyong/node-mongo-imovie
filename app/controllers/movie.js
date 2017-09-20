var mongoose=require('mongoose')
var Movie=require('../model/movie')
var Comment=require('../model/comment')
var Category=require('../model/category')
var _=require('underscore')
//movie new
exports.new=function(req,res){
	Category
	.find({},function(err,categories){
		res.render('admin',{
			title:'imovie 后台录入页',
			movie:{},
			categories:categories
		})
	})
	
}
//movie update
exports.update=function(req,res){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			Category.find({},function(err,categories){
				if(err){
					console.log(err)
				}
				res.render('admin',{
					title: 'imovie 后台更新页',
					movie:movie,
					categories:categories
				})
			})
			
		})
	}
	
}
//save
exports.save=function(req,res){
	var id=req.body.movie._id //隐藏域存放id，如果id存在，为更新，否则为新建
	var movieObj=req.body.movie
	var _movie //用于存放要存入数据库的movie数据
	var newCategory=movieObj.category
	var categoryName=movieObj.categoryName
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			var oldCategory=movie.categories
			if(newCategory && newCategory!='undefined'){
					_movie=_.extend(movie,movieObj) //如果有更新，则movieObj代替查询到的movie数据
					_movie.categories=newCategory
					var tempCat=[]
					_movie.save(function(err,movie){
						if (err){
							console.log(err+'a')
						}
						for(var i=0;i< newCategory.length;i++){
							for(var j=0;j<oldCategory.length;j++){
								if(oldCategory[j].toString()==newCategory[i].toString()){
									tempCat.push(oldCategory[j])
								}
							}
						}
						newCategory=removeCat(tempCat,newCategory)
						oldCategory=removeCat(tempCat,oldCategory)
						if(newCategory!='undefined' && newCategory){
							saveArrToCategory(newCategory,movie)
						}
						if(oldCategory!='undefined' && oldCategory){
							console.log(oldCategory)
							for(var g=0;g<oldCategory.length;g++){
								Category.findOne({_id:oldCategory[g]},function(err,category){
									if(err){console.log(err)}
										if(category.movies!='undefined'){
											var index0=category.movies.indexOf(id)
											if(index0!= -1){
												category.movies.splice(index0,1)
												category.save(function(err,category){})
											}
										}								
								})		
							}
						}
					})
				}
				else if(categoryName){
					var name=categoryName.split(',')
					insertCatByName(catName,movie,0)
				}
				res.redirect('/movie/'+movie._id)
			})
	}	

	else{
		_movie=new Movie(movieObj)

		Movie.findOne({title:_movie.title},function(err,movie){
			if (err){
				console.log(err)
			}
			if(movie){
				res.redirect('/')
			}
			else{
				_movie.save(function(err,movie){
					if (err){
						console.log(err)
					}
					if(newCategory){
						movie.categories=newCategory
						movie.save(function(err,movie){})
						saveArrToCategory(newCategory,movie)
					}
					
					if(categoryName){
						var catName=categoryName.split(',')
						insertCatByName(catName,movie,0)
					}
					res.redirect('/admin/movie/list')
				})
			}

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
	Movie
	.find({})
	.populate('categories','name')
	.exec(function(err,movies){
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
		Movie.findById(id,function(err,movie){
			if(movie){
				Movie.remove({_id:id},function(err1,count){
					if(movie.categories && movie.categories!='undefined'){
						for(var i=0;i<movie.categories.length;i++){
							Category.findOne({_id:movie.categories[i]},function(err,categories){
								if(categories.movie!='undefined' ){
									var movieIndex=categories.movies.indexOf(id)
									if(movieIndex> -1){
										categories.movies.splice(movieIndex,1)
										categories.save(function(err,count){})
									}
								}
							})
						}
					}
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
			
		})
		
	}

}
function removeCat(temp,cat){
	for(var i=0;i<temp.length;i++){
		for(var j=0;j<cat.length;j++){
			if(temp[i].toString()==cat[j].toString())
				cat.splice(j,1)
		}
	}
	return cat
}
function insertCatByName(catName,movie,i){
	var category = new 	Category({
		name:catName[i++],
		movies:[movie._id]
	})
	category.save()
	.then(function(cat){
		movie.categories.push(cat._id)

	}).then(function(){
		setTimeout(function(){},200)
		movie.save(function(err,movie){
			if(i==catName.length){ return true}
				insertCatByName(catName,movie,i)
		})
	})

	
}

function saveArrToCategory(arr,movie){
	if(typeof arr=='string'){
		Category.findOne({_id:arr},function(err,category){
			category.movies.push(movie._id)
			category.save(function(err,category){})
		})
	}
	else{
		for(var i =0;i<arr.length;i++){
			Category.findOne({_id:arr[i]},function(err,category){
				category.movies.push(movie._id)
				category.save(function(err,category){
				})
			})
		}	
	}
}