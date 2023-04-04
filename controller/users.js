require('dotenv').config()
const cloudinary = require('cloudinary').v2


const fs = require('fs/promises');

const errorHandler = require('../utils/errorHandler')
const Users = require('../models/users')
const Reviews = require('../models/reviews')


module.exports.setAvatar = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {upload_preset: 'b7ewiaxx'});
        res.status(200).json({
            'img':result.secure_url
        })

      } catch (error) {
        res.status(500).json({message: error});
      }
      fs.unlink(req.file.path);
}

module.exports.updateInfoUser = async(req,res) => {
    try{
        const user = await Users.findOne({_id: req.user.id})
        await Reviews.updateMany({userId : req.user.id}, {$set: {userName:req.body.name, userImg: req.body.img}});

        if(req.body.img) user.img = req.body.img;
        if (req.body.name) user.name = req.body.name;
        await user.save();
        res.status(200).json(user);
    }catch(e){
        errorHandler(res,e)
    }
}

module.exports.getPersonal = async (req, res) => {
    try{
        const user = await Users.findOne({_id: req.user.id})
        res.status(200).json(user)

    } catch(e){
        errorHandler(res,e)
    }

}



module.exports.addBook = async (req, res) => {
    try{
        const book = await Users.findOne( {$and: [
            {_id: req.user.id},
            {booksLike:{ $all: req.body.bookId}}]}
        )
        if(book){
            res.status(409).json({
                message:"Книга уже есть в разделе 'Хочу почитать' "
            })
        } else{
            const user = await Users.updateOne(
                {_id: req.user.id},
                {$addToSet: { books: req.body.bookId}}
            )
            res.status(200).json({
                modifiedCount: user.modifiedCount
            })
    }
    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.deleteBook = async (req, res) => {
    try{
        
        const user = await Users.updateOne(
            {_id: req.user.id},
            {$pull: { books: req.body.bookId}}
        )
        await Reviews.deleteOne(
            {userId: req.user.id},
            {bookId: req.body.bookId}
        )
        res.status(200).json({
            modifiedCount: user.modifiedCount
        })
    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.checkBook = async (req, res) => {
    try{
        
        const user = await Users.findOne( {$and: [
            {_id: req.user.id},
            {books:{ $all: req.params.bookId}}]}
        )
        if(user) res.status(200).json({
            status: true
        })
        else res.status(200).json({
            status: false
        })
    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.addLikeBook = async (req, res) => {
    try{
            const book = await Users.findOne( {$and: [
                {_id: req.user.id},
                {books:{ $all: req.body.bookId}}]}
            )
            if(book){
                res.status(409).json({
                    message:"Книга уже есть в прочитанном"
                })
            } else{
                const user = await Users.updateOne(
                    {_id: req.user.id},
                    {$addToSet: { booksLike: req.body.bookId}}
                    )
                    res.status(200).json({
                    modifiedCount: user.modifiedCount
                })
                res.status(200).json({
                    modifiedCount: res.modifiedCount
                })
            }

        } catch(e){
            console.log(e);
        }


}

module.exports.deleteLikeBook = async (req, res) => {
    try{
        
        const user = await Users.updateOne(
            {_id: req.user.id},
            {$pull: { booksLike: req.body.bookId}}
        )
        res.status(200).json({
            modifiedCount: user.modifiedCount
        })
    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.checkLikeBook = async (req, res) => {
    try{
        
        const user = await Users.findOne( {$and: [
            {_id: req.user.id},
            {booksLike:{ $all: req.params.bookId}}]}
        )
        if(user) res.status(200).json({
            status: true
        })
        else res.status(200).json({
            status: false
        })
    } catch(e){
        errorHandler(res,e)
    }

}

module.exports.checkLikesBook = async (req, res) => {
    try{
        
        const userLike = await Users.findOne( {$and: [
            {_id: req.user.id},
            {booksLike:{ $all: req.params.bookId}}]}
        )
        if(userLike) {res.status(200).json({
            status: "booksLike"
        })} else{
            const user = await Users.findOne( {$and: [
                {_id: req.user.id},
                {books:{ $all: req.params.bookId}}]}
            )
            if(user) res.status(200).json({
                status: "books"
            })
            else res.status(200).json({
                status: "false"
            })
    }
    } catch(e){
        errorHandler(res,e)
    }

}