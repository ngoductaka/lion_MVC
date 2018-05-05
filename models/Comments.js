const Comments = require('./connect').Comments

const User = require('./User');

function create(comments, authorId) {
    let { body } = comments;
    return User.getUser(authorId)
        .then(dataUser => {
            let contentComent = {
                "body": body,
                "author": dataUser
            }
            let newComment = new Comments(contentComent);
            return new Promise((res, rej) => {
                newComment.save((err, resutlSave) => {
                    if (err) rej(err)
                    res(resutlSave)
                })
            })
        })
        .catch(err=>{
            console.log("err get author comments", err)
        })
}
async function get(slu) {
    let article = await Articles.slug(slu);
    let listCommentsId = article.article[0].comments;
    // let listComments 
    // return listCommentsId.forEach(async (id) => {
    //     let dnd = await Comments.find({"_id":id})
    //     .populate('author')
    //     .exec()
    //     // .select('createdAt updatedAt body author ')
    //     // console.log(dnd)
    //     return {"comments":dnd};

    // })
    const promises = []
    listCommentsId.map(id => {
        promises.push(
            Comments.find({ "_id": id })
                .populate('author')
                .exec()
        )
    })
    let result = await Promise.all(promises)
    // .then(data=>{
    //     return data
    // })
    return { "comments": result }


}

async function remove(slu, id) {
    // console.log(slu, id )
    return await Comments.where({ "_id": id }).findOneAndRemove()
        .select('_id body createdAt updatedAt  author')
        .populate({
            path: 'author',
        })
        .exec()
}

async function getById(id) {
    return await Comments.findById(id)
}
module.exports = {create, get, remove, getById } 