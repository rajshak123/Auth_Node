/**
 * Created by raj on 7/14/2017.
 Model Methods and instance methods
 */
var mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcryptjs = require('bcryptjs')
var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }

    }]
})
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObj = user.toObject();
    return _.pick(userObj, ['email', '_id'])
}
UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
    user.tokens.push({
        access,
        token
    })
    return user.save().then(() => {
        return token;
    })

}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;
    try {
        decoded = jwt.verify(token, 'abc123');
    } catch (e) {
        return Promise.reject();
    }
    console.log(decoded._id);
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}
UserSchema.statics.findByUserCredentials = function (email, password) {
    var User = this;
    return User.findOne({
        email
    }).then((user1) => {
        if (user1) {
            return new Promise((resolve, reject) => {
                bcryptjs.compare(password, user1.password, (err, res) => {
                    if (res)
                        resolve(user1);
                    else
                        reject();
                })
            })
        } else {
            return false
        }
    }).catch(e => {
        return Promise.reject()
    })
}

UserSchema.statics.findUserByEmail = (email) => {
    return User.findOne({
        email
    }).then((user1) => {
        if (user1) {
            return true
        } else {
            return false
        }
    })
}
UserSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
})
var User = mongoose.model('User', UserSchema)
module.exports = {
    User
}
