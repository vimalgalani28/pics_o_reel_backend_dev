import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const { sign } = jwt

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    hasVotedPhotography: {
        type: Boolean,
        required: true,
        default: false
    },
    hasVotedPainting: {
        type: Boolean,
        required: true,
        default: false
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},
    {
        timestamps: true
    })

userSchema.virtual('entries', {
    ref: 'Entry',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = await sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.tokens
    return userObject
}

const User = mongoose.model('User', userSchema)
export default User