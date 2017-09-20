var Comment=require('../model/comment')

exports.save=function(req,res){
	var _comment=req.body.comment
	var movieId=_comment.movie //movie以ObjectId 的形式存放

	if(_comment.cid){//回复 cid为已经评论的_id tid为上一评论人
		Comment.findById(_comment.cid,function(err,comment){
			var reply={
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			}
			comment.reply.push=reply //把现有回复加入历史回复

			comment.save(function(err,comment){
				if(err){
					console.log(err)
				}
				res.redirect('/movie/'+movieId)
			})
		})
		
	}
	else{ //评论
		var comment=new Comment(_comment)
		comment.save(function(err,comment){
			if(err){
				console.log(err)
			}
			res.redirect('/movie/'+movieId)
		})
	}
}