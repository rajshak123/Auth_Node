/**
 * Created by raj on 7/14/2017.
 */
const express = require('express')
const _ = require('lodash')
const {
    ObjectId
} = require('mongodb')
var {
    mongoose
} = require('./db/mongoose')
var {
    Dishes
} = require('./models/Dishes')
var {
    User
} = require('./models/users')
const {
    SHA256
} = require('crypto-js')


const bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

var authenticate = (req, res, next) => {

    var token = req.header('Bearer');
    if (!token) {
        next()
    } else {
        User.findByToken(token).then((user) => {
            if (!user) {
                next()
            } else
                req.user = user;
            next();
        }).catch((e) => {
            res.status(401).send();
        })
    }


}
const port = process.env.PORT || 5000;
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body["text"]
    })
    todo.save().then((docs) => {
        res.status(200).json({
            "inserted": docs
        })
    }).
    catch((e) => res.status(400).json({
        "msg": "bad request"
    }))
})
app.get('/todos/', (req, res) => {
    Todo.find().then((docs) => {
        res.status(200).json({
            docs: docs
        })
    }).
    catch((e) => res.status(400).json({
        "err": e
    }))
})
app.get('/todos/:id', (req, res) => {
    var id = req.params["id"];
    console.log(id)
    Todo.findById(req.params.id).then((docs) => {
        res.status(200).json({
            docs: docs
        })
    }).
    catch((e) => res.status(400).json({
        "err": e
    }))
})


app.post('/signup', (req, res) => {
    console.log('here');
    var body = _.pick(req.body, ['email', 'password'])
    User.findUserByEmail(body.email).then(
        res1 => {
            if (res1) {
                console.log('true')
                res.status(400).json({
                    'err': 'Already present'
                })
            } else {
                console.log("false")
                var user = new User(body);
                user.save().then((doc) => {
                    return doc.generateAuthToken()
                }).
                then((token) => {
                    res.header('Bearer', token).json({
                        'email': user['email']
                    })
                })
            }
        }
    ).catch(err => {
        res.status(400).send(err)
    })
})


app.post('/signin', (req, res) => {
    User.findByUserCredentials(req.body.email, req.body.password).then((user) => {
        if (user) {
            user.generateAuthToken().then(token => {
                res.header('Bearer', token).json({
                    'email': user['email']
                })
            })
        } else {
            res.status(400).json({
                'err': 'User not found'
            })
        }
    }).catch((e) => {
        res.status(400).send();

    })
})
app.get('/user/me', authenticate, (req, res) => {
    // console.log(req.user)
    if (!req.user) {
        return res.status(400).json({
            'err': 'User not authenticated'
        })
    } else {
        Dishes.find().limit(100).then(doc => {
            res.status(200).json({
                'dishes': doc
            })
        })
    }

})

app.listen(port, () => {
    console.log(`Server started on ${port}`)
})
module.exports = {
    app
}
