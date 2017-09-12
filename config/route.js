var Movie=require('../app/controllers/movie')
var Index=require('../app/controllers/index')
var User=require('../app/controllers/user')
var Comment=require('../app/controllers/comment')
module.exports=function(app){

	app.use(function(req,res,next){
		var _user=req.session.user

		app.locals.user=_user
		next()
	})
	
	//index page
	app.get('/',Index.index)
	//user
	app.post('/user/signup',User.signup)
	app.post('/user/signin',User.signin)
	app.get('/signup',User.showSignup)
	app.get('/signin',User.showSignin)
	app.get('/user/list',User.userlist)
	app.get('/logout',User.logout)
	
	//movie  
	//admin page
	app.get('/admin/movie',Movie.new)
	//admin update 
	app.get('/admin/update/:id',Movie.update)
	//admin post movie 
	app.post('/admin/movie/new',Movie.save)
	//list page
	app.get('/admin/movie/list',Movie.list)
	//detail page
	app.get('/movie/:id',Movie.detail)
	//list delete page
	app.delete('/admin/list',Movie.delete)

	//comment
	app.post('/user/comment',Comment.save)
}