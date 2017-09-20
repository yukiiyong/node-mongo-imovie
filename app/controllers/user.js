var mongoose=require('mongoose')
var User=require('../model/user')

exports.showSignup=function(req,res){
	res.render('signup',{
		title:'注册页面'
	})
}
exports.showSignin = function(req,res){     
	res.render('signin',{ 
		title:'登录页面'
	})
}

exports.signup= function(req,res){ 
	var _user=req.body.user

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(user){
			return res.redirect('/signup')
		}
		else{
			user=new User(_user)
			user.save(function(err,user){ 
				if(err){
					console.log(err)
				}
				res.redirect('/')
			})
		}
	})
}

exports.signin =function(req,res){
	var _user=req.body.user
	var name=_user.name
	var password=_user.password

	User.findOne({name:name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect('/signin')
		}

		user.comparePassword(password,function(err,isMatch){
			if(err){
				console.log(err)
			}

			if(isMatch){
				req.session.user=user
				console.log(user.name)
				res.redirect('/')
			}else{
				res.write('password err')
				setTimeout(function(){
					res.redirect('/signin') 
				},3000)
			}
		})
	})
}

exports.logout= function(req,res){
	delete req.session.user
	res.redirect('/')
}

exports.userlist=function(req,res){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}

		res.render('userlist',{
			title:'用户列表页',
			users:users
		})
	})
}

exports.signinRequired=function(req,res,next){
	var user= req.session.user

	if(!user){
		res.redirect('/signin')
	}

	next()
}

exports.adminRequired =function(req,res,next){
	var user=req.session.user


	if(user.role<= 10){
		res.redirect('/signin')
	}
	next()
}


