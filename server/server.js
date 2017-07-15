/**
 * Created by raj on 7/14/2017.
 */
const express=require('express')
var {mongoose}=require('./db/mongoose')
var {Todo}=require('./models/todo')
var {User}=require('./models/users')
const bodyParser=require('body-parser')
var app=express()
app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
  var todo=new Todo({
    text:req.body["text"]
  })
    todo.save().then((docs)=>{
    res.status(200).json({"inserted":docs})
}).catch((e)=>res.status(400).json({"msg":"bad request"}))
})
app.get('/todos',(req,res)=>{
  res.status(200).json({"msg":"hi"})
})


app.listen(3000,()=>{console.log("Server started on 3000")})