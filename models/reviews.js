const { Schema, model } = require('mongoose')

const ReviewSchema = new Schema ({
    bookId:{
        ref:'books',
        type: Schema.Types.ObjectId,
        required: true       
    },
    userImg: {
        type:String,
        default: "https://www.murrayglass.com/wp-content/uploads/2020/10/avatar-scaled.jpeg"
    },
    userName:{
        type: String,
        default: "Test"
    },
    userId:{
        ref:'users',
        type: Schema.Types.ObjectId,
        required: true       
    },
    text: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now()
    }

})

module.exports = model('reviews', ReviewSchema)
