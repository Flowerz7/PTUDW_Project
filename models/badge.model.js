import mongoose from 'mongoose'

const Schema = mongoose.Schema

const badgeSchema = new Schema({
    bestSeller:[{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],

    trendy:[{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],

    newBreeze:[{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
},
{
    timestamps: true
})

const Badge = mongoose.model('Badge', badgeSchema)
export default Badge