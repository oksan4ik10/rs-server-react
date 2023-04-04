const { Schema, model } = require('mongoose')

const GradeSchema = new Schema ({
    bookId:{
        ref:'books',
        type: Schema.Types.ObjectId,
        required: true       
    },
    userId:{
        ref:'users',
        type: Schema.Types.ObjectId,
        required: true       
    },
    value: {
        type: Number,
        required: true
    },

})

module.exports = model('grades', GradeSchema)
