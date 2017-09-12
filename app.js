/*
* @Author: yuki
* @Date:   2017-09-08 21:53:01
* @Last Modified by:   yukiiyong
* @Last Modified time: 2017-09-11 21:06:54
*/
var express=require('express')
var path =require('path')
var _ =require('underscore')
var session=require('express-session')
var cookieParser=require('cookie-parser')  //get sessionId from cookie
var dbUrl='mongodb://localhost:27017/imovie'
//var fs=require('fs')
var mongoose=require('mongoose')
var mongoStore=require('connect-mongo')(session)  //save session to mongo
var port= process.env.PORT || 3000
var app=express()
var bodyParser=require('body-parser')

mongoose.Promise=global.Promise
mongoose.connect(dbUrl,{useMongoClient:true})

// create new server 
app.set('views',path.join(__dirname,'./app/views/pages')) //页面
app.set('view engine','jade') //引擎
app.use(bodyParser.urlencoded({extended:true}))  //bodyParser 解析表单数据
app.use(cookieParser())
app.use(require('connect-multiparty')())
app.use(session({
	secret: 'imovie',
	store: new mongoStore({
		url:dbUrl,
		collection:'sessions'
	})
}))

require('./config/route')(app)
app.use(express.static(path.join(__dirname,'public')))  
app.locals.moment=require('moment')


app.listen(port)


console.log('imovie started on port'+ port)
//index page
