require('dotenv').config();
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const authen = require('./middlewares/auth.js');

const userController = require('./controllers/userController')
const articleController = require('./controllers/articleController')

// 3.4.1 Authentication:
// POST /api/users/login
app.post('/api/users/login', userController.login);
// 3.4.2 Registration:
// POST /api/users
app.post('/api/users', userController.register);
// 3.4.3 Get Current User
// GET /api/user 
app.get('/api/users', authen.required, userController.getUser);
// 3.4.4 Update User
// PUT /api/user
app.put('/api/users', authen.required, userController.updateUser);
// 3.4.5 List Articles
// GET /api/articles
app.get('/api/articles', articleController.getArticlesById); 
// 3.4.6 Feed Articles
// GET /api/articles/feed
app.get('/api/articles/feed', authen.required, articleController.getArticlesById); 
// app.param(['slug','id'],(req, res, next, value)=>{
//     req.slug = value;
//     req.id = value;
//     console.log( req.slug)
//     next()
// })
// 3.4.7 Get Article
// GET /api/articles/:slug
app.get('/api/articles/:slug', articleController.getArticlesBySlug); 
// 3.4.8 Create Article
// POST /api/articles
app.post('/api/articles', authen.required, articleController.createArticles); 
// 3.4.9 Update Article
// PUT /api/articles/:slug
app.put('/api/articles/:slug', authen.required, articleController.editArticles); 
// 3.4.10 Delete Article
// DELETE /api/articles/:slug
app.delete('/api/articles/:slug', authen.required, articleController.deleteArticles); 
// 3.4.11 Add Comments to an Article
// POST /api/articles/:slug/comments
app.post('/api/articles/:slug/comments', authen.required, articleController.addComment); 

// 
const POST = process.env.POST || 5001
app.listen(POST, () => console.log("run with mongoo on post " + POST))