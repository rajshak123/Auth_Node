/**
 * Created by raj on 7/14/2017.
 */
const express = require('express')
const _ = require('lodash')
const {ObjectId}=require('mongodb')
var {mongoose}=require('./db/mongoose')
var {Todo}=require('./models/todo')
var {User}=require('./models/users')
const {SHA256}=require('crypto-js')
const bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())

var authenticate=(req,res,next)=>{
    var token=req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject()
        }
        else
            req.user=user;
        next();
    }).catch((e)=>{
        res.status(401).send();
    })

}
const port = process.env.PORT || 3000;
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body["text"]
    })
    todo.save().then((docs) => {
    res.status(200).json({"inserted": docs})
}).
catch((e) => res.status(400).json({"msg": "bad request"})
)
})
app.get('/todos/', (req,res) => {
    Todo.find().then((docs) => {
    res.status(200).json({docs: docs})
}).
catch((e) => res.status(400).json({"err": e})
)
})
app.get('/todos/:id', (req, res) => {
    var id = req.params["id"];
console.log(id)
Todo.findById(req.params.id).then((docs) => {
    res.status(200).json({docs: docs})
}).
catch((e) => res.status(400).json({"err": e})
)
})
app.post('/users',(req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body);
user.save().then((doc) => {
    return doc.generateAuthToken()
}
).
then((token) => {

    res.header('x-auth', token).send(user)
}).
catch((e) => {
    res.status(400).send(e)
})

})

app.get('/user/me',authenticate,(req,res)=>{
    res.send(req.user);
})

app.listen(port, () => {console.log(`Server started on ${port}`)
})
module.exports = {app}