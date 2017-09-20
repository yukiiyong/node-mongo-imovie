var Movie=require('../app/controllers/movie')
var Index=require('../app/controllers/index')
var User=require('../app/controllers/user')
var Comment=require('../app/controllers/comment')
var Category=require('../app/controllers/category')
module.exports=function(app){

	app.use(function(req,res,next){
		var _user=req.session.user

		app.locals.user=_user
		next()
	})
	
	//index page
	app.get('/',Index.index)
	app.get('/result',Index.search)
	//user
	app.post('/user/signup',User.signup)
	app.post('/user/signin',User.signin)
	app.get('/signup',User.showSignup)
	app.get('/signin',User.showSignin)
	app.get('/user/list',User.userlist)
	app.get('/logout',User.logout)
	
	//movie  
	//admin page
	app.get('/admin/movie',User.signinRequired,User.adminRequired,Movie.new)
	//admin update 
	app.get('/admin/update/:id',User.signinRequired,User.adminRequired,Movie.update)
	//admin post movie 
	app.post('/admin/movie/new',User.signinRequired,User.adminRequired,Movie.save)
	//list page
	app.get('/admin/movie/list',User.signinRequired,User.adminRequired,Movie.list)
	//detail page
	app.get('/movie/:id',Movie.detail)
	//list delete page
	app.delete('/admin/list',User.signinRequired,User.adminRequired,Movie.delete)

	//comment
	app.post('/user/comment',User.signinRequired,User.adminRequired,Comment.save)
	app.get('/admin/category/new',User.signinRequired,User.adminRequired,Category.save)
	app.get('/admin/category/list',User.signinRequired,User.adminRequired,Category.list)
	app.delete('/admin/category/list',User.signinRequired,User.adminRequired,Category.del)
}