const mongoose = require('mongoose');
require('dotenv').config(); 
mongoose.connect(process.env.DB_HOST);

let userSchema = mongoose.Schema({  
    email:{
        type: String,
        required: true,
        unique: true 
    },
    username:{
        type: String,
        required: true,
        unique: true 
    },
    bio: String ,
    image:{
        type: String,
        default: null
        // required: true
    },
    password:{
        type: String,
        required: true
    },
    
}
, { collection : 'users' }
);

var Users = mongoose.model('Users', userSchema);

let articlesSchema = mongoose.Schema({ 
    id:{
        type: Number,
        // required: true
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
    title:{
        type: String,
        // required: true
    },
    description:{
        type: String,
        // required: true
    },
    body:{
        type: String,
        // required: true
    },
    tagList:   [String],
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    favorited:{
        type: Boolean,
        default: false
    },
    favoritesCount:{
        type: Number,
        default: 0
    },
    author:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comments'
    }]
}
, { collection : 'articles' }
);
var Articles = mongoose.model('Articles', articlesSchema);

let commentSchema = mongoose.Schema({ 
    id:{
        type: Number,
        // required: true
    },
    author:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    body:{
        type: String,
        // required: true
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    favorited:{
        type: String,
        default: false
    },
}
, { collection : 'comments' }
);
var Comments = mongoose.model('Comments', commentSchema);

module.exports = {Users, Articles, Comments}