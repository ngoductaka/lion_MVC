const Articles = require('./connect').Articles

const User = require('./User');
const CommentsModel = require('./Comments')

function getById({ tag = null, author = null, favorited = null, limit = 20, offset = 0 } = {}, id) {

    let fe = id ? { "author": id } : {};
    let au = author ? { 'username': author } : {}
    let ta = tag ? { 'tagList': { $in: [tag] } } : {}
    let fa = favorited ? { "favorited": { $exists: favorited } } : {}// can't understand => it is true false 
    // let query = { ...au, ...ta, ...fa, ...fe }
    let query = { ...ta, ...fa, ...fe }
    let articlesList = new Promise((res, rej) => {
        Articles.find(query).sort('-createdAt').skip(offset).limit(limit)
            .populate({
                path: 'author',
                select: 'username bio image email',
                match: au
            })
            .exec((err, data) => {
                if (err) rej(err)
                res(data)
            })
    })

    return articlesList
};

function getBySlug(slug) {
    let article = new Promise((res, rej) => {
        Articles.findOne({ "slug": slug })
            .select('slug title description body tagList createdAt updatedAt favorited favoritesCount author comments')
            .populate({
                path: 'author',
                select: 'username bio image',
            }) 
            .exec((err, data) => {
                if (err) rej(err)
                res(data)
            })
    })
    return article
}

const converSlug = str => str.split(' ').join("_")

function create({ title, description, body, tagList }, id) {
    let article = {
        "slug": converSlug(title),
        "title": title,
        "description": description,
        "body": body,
        "author": id
    }
    let tag = tagList ? { "tagList": tagList } : {};
    let up = { ...article, ...tag }
    let newArticle = new Articles(up)

    let createArticle = new Promise((res, rej) => {
        newArticle.save((err, data) => {
            if (err) return rej(err);
            res(data)
        })
    })

    return createArticle;
}

function edit({ title, description, body } = {}, userId, slug) {
    let ti = {}, glu = {}
    if (title) {
        ti = { "title": title };
        glu = { "slug": converSlug(title) }
    }
    let de = description ? { "description": description } : {};
    let bo = body ? { "body": body } : {};

    let up = { ...ti, ...de, ...bo, ...glu };
    let articleUp = new Promise((res, rej) => {
        Articles.update({ "slug": slug }, { $set: up })
            .exec((err, resultUpdate) => {
                if (err) {
                    rej(err)
                }
                else if (resultUpdate.n !== 0 && resultUpdate.nModified !== 0) {
                    if (title) {
                        res(getBySlug(converSlug(title)))
                    }
                    else {
                        res(getBySlug(slug))
                    }
                }
                else {
                    rej({
                        "errors": {
                            "body": ["nothing update "]
                        }
                    })
                }
            })
    })
    return articleUp
}

function deleteArticle(slug) {
    let articleDeleted = new Promise((res, rej) => {
        Articles.remove({ 'slug': slug }, (err, dataDelete) => {
            if (err) rej(err);
            res(dataDelete)
        });
    })

    return articleDeleted
}

function addComments(comment, slug, userId) {
    return CommentsModel.create(comment, userId)
        .then(dataCreateComment => {
            
            let up = { "comments": dataCreateComment }
            // console.log(dataCreateComment)
            return new Promise((res, rej) => {
                Articles.update({ "slug": slug }, { $push: up })
                    .exec((err, resultUpdate) => {
                        if(err) rej(err)
                        if(1===resultUpdate.nModified){
                            return res(
                                getBySlug(slug)
                            )
                        }
                    })
            })
        })
    // return User.getUser(userId)
    //     .then(data => {
    //         let contentComment = {
    //             "body": body,
    //             "author": data,
    //         }
    //         // console.log(contentComment)
    //         let newComment = new Comments(contentComment)

    //         return commentSend = new Promise((res, rej) => {
    //             newComment.save((err, resutlSave) => {
    //                 if (err) rej(err)
    //                 let up={ "comments": resutlSave }
    //                 return Articles.where({ "slug": slug }).update({ $push: up })
    //                 res(resutlSave)
    //             })
    //         })
    //     })



    // let up = { "comments": commentSend };
    // let article = await Articles.where({ "slug": slu }).update({ $push: up })
    // // console.log(article);

    // return {
    //     "comment": commentSend
    // }
}


async function favorite(slu) {
    let up = await Articles.where({ "slug": slu }).update({ $set: { "favorited": true } })
    // return up
    if (1 === up.n) {
        article = await slug(slu)
        let Count = article.article[0].favoritesCount;
        let upCount = await Articles.where({ "slug": slu }).update({ $set: { "favoritesCount": ++Count } })
        return await slug(slu);
    }
}

async function Unfavorite(slu) {
    let up = await Articles.where({ "slug": slu }).update({ $set: { "favorited": false } })
    // return up
    if (1 === up.n) {
        article = await slug(slu)
        let Count = article.article[0].favoritesCount;
        let upCount = await Articles.where({ "slug": slu }).update({ $set: { "favoritesCount": --Count } })
        return await slug(slu);
    }
}

async function getTag() {
    // console.log(1)
    let tags = await Articles.find({})
        .select('tagList')
    let List = []
    tags.forEach(e => {
        List.push(...e.tagList)
        // console.log(e.tagList)
    })
    let dnd = new Set()
    List.forEach(e => {
        dnd.add(e);
    })
    // dnd.add
    return [...dnd]

}
module.exports = { getById, getBySlug, create, edit, deleteArticle, addComments, favorite, Unfavorite, getTag } 