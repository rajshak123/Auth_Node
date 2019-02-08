/**
 * Created by raj on 7/14/2017.
 */
const express = require('express')
const _ = require('lodash')
const {
    ObjectId
} = require('mongodb')
let {
    mongoose
} = require('./db/mongoose')
let {
    Dishes
} = require('./models/Dishes')
let {
    User
} = require('./models/users')
const {
    SHA256
} = require('crypto-js')
const cors = require('cors');

const bodyParser = require('body-parser')
let app = express()
app.use(bodyParser.json())
const corsOptions = {
    exposedHeaders: 'Authorization',
};
app.use(cors(corsOptions));


let authenticate = (req, res, next) => {

    let jwttoken = req.headers['authorization'];

    let jwtTokenArray = jwttoken.split(' ')
    let token = jwtTokenArray[1]

    if (!jwttoken || !token) {
        next()
    } else {
        console.log(`here`)
        User.findByToken(token).then((user) => {
            console.log(user)
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

const port = process.env.PORT || 3090;

app.post('/todos', (req, res) => {
    let todo = new Todo({
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
    let id = req.params["id"];
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
    let body = _.pick(req.body, ['email', 'password'])
    User.findUserByEmail(body.email).then(
        res1 => {
            if (res1) {

                res.status(200).json({
                    'err': 'Already present'
                })
            } else {

                let user = new User(body);
                user.save().then((doc) => {
                    return doc.generateAuthToken()
                }).
                then((token) => {
                    res.header('Authorization', `Bearer ${token}`).json({
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
                res.header('Authorization', `Bearer ${token}`).json({
                    'email': user['email']
                })
            })
        } else {
            res.status(200).json({
                'err': 'User not found'
            })
        }
    }).catch((e) => {
        res.status(400).send();
    })
})

app.get('/getProductList', authenticate, (req, res) => {
    console.log(req.user)
    if (!req.user) {
        return res.status(200).json({
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
