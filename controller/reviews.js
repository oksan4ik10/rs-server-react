const errorHandler = require('../utils/errorHandler')
const Reviews = require('../models/reviews')
const Users = require('../models/users')
module.exports.create = async (req, res) => {
    try{
        const review = await Reviews.findOne({bookId: req.body.bookId, userId: req.user.id})
        const userData = await Users.findOne({_id: req.user.id})
        await Users.updateOne(
            {_id: req.user.id},
            {$pull: { booksLike: req.body.bookId}}
        )
        if(review){
            review.text = req.body.text;
            review.date = Date.now()
            review.userImg = userData.img;
            review.userName = userData.name;
            await review.save();
            res.status(200).json(review)
        } else{
            await Users.updateOne(
                {_id: req.user.id},
                {$addToSet: { books: req.body.bookId}}
            )
   
            const reviewNew = new Reviews({
                bookId: req.body.bookId,
                userId: req.user.id,
                text: req.body.text,
                userImg: userData.img,
                userName: userData.name
            })
            await reviewNew.save()
            res.status(200).json(reviewNew)
        }
     

    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.delete = async (req, res) => {
    try{
        const review = await Reviews.deleteOne({_id: req.params.reviewId})
        if(review.deletedCount === 1) res.status(200).json({
            success: true
        })
        else res.status(404).json({
            success: false,
            "message":"Книга с таким id не найдена"
        })

    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.getReviewUser = async (req, res) => {
    try{
        const review = await Reviews.findOne({bookId: req.params.bookId, userId: req.user.id})
        res.status(200).json(review)
    } catch(e){
        errorHandler(res,e)
    }

}
module.exports.getBookReviews = async (req, res) => {
    try{
        const reviews = await Reviews.find({bookId: req.params.bookId})
        res.status(200).json(reviews)

    } catch(e){
        errorHandler(res,e)
    }

}
module.exports.geReviewsLast = async (req, res) => {
    try{
        const reviews = await Reviews.find({}).sort({date:-1}).limit(10)
        res.status(200).json(reviews)


    } catch(e){
        errorHandler(res,e)
    }

}
module.exports.checkReviewUser = async (req, res) => {
    try{
        const review = await Reviews.findOne({bookId: req.params.bookId, userId: req.user.id})
        res.status(200).json({
            status:!!review
        })


    } catch(e){
        errorHandler(res,e)
    }

}
