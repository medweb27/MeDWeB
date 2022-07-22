var express = require("express");
var app = express();
var mongoose = require("mongoose");
var request = require("request");
const _ = require('underscore');
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
//const uri = 'mongodb://localhost:27017';

const assert = require('assert');
const dbName = 'medweb';
var ObjectId = require('mongodb').ObjectID;
const mongoDB = require('mongodb');

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


const { MongoClient, ServerApiVersion } = require('mongodb');
//const uri = "mongodb+srv://MrCPU:mrcpu1234@cluster0.tglcx.mongodb.net/MrCPU?retryWrites=true&w=majority";
const uri = "mongodb+srv://webmed:pavan123@cluster0.4imjz.mongodb.net/test?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("medweb").collection("dets");
});

var topicSchema =new mongoose.Schema({
    name : String,
    othername : String,
    used:[],
    imgpath: String,
    buy : String,
    info: String
});


var Details = mongoose.model("Details",topicSchema);

app.get("/",(req,res)=>{
    res.render('home');
})

app.get('/explore',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('dets');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('explore',{'top':docs})
    });
})

app.get('/search/:id', (req, res)=>{
    const db = client.db(dbName);
    const collection = db.collection('dets');
    var id = req.params.id;
    var hex = /[0-9A-Fa-f]{6}/g;
    id = (hex.test(id))? ObjectId(id) : id;

    collection.findOne({_id : new mongoDB.ObjectID(id)})
    .then(found =>{
        if(!found){
            return res.status(404).end();
        }
        res.render('alldet',{data: found});
    })
    .catch(err => console.log(err));
})

app.get('/search',(req,res)=>{
    const db = client.db(dbName);
    const collection = db.collection('dets');

    collection.find({}).toArray(function(err,docs){
        assert.equal(err, null);
        res.render('searchbyname',{'top':docs})
    });
})

app.get('/about',(req,res)=>{
    res.render('about');
})

app.get("*",function(req,res){
    res.send("some thing went wrong");
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log("Hey boi i'm waiting come!");
})