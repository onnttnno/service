const express = require('express');
const app = express();
const server = require('http').createServer(app);
const faker = require('faker');
const port = process.env.PORT || 3000;
const jsonToCsv = require('convert-json-to-csv');
const assert = require('assert');
const mongo = require('mongodb');
const url = "mongodb://localhost:27017/";
const bodyParser = require('body-parser');
const path = require('path');
var db;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// PTT model
const PTT = require('./models/stockPTT');
require('./libs/db-connection');

// CPALL model
const CPALL = require('./models/stockCPALL');
require('./libs/db-connection');

// DTAC model
const DTAC = require('./models/stockDTAC');
require('./libs/db-connection');

// AOT model
const AOT = require('./models/stockAOT');
require('./libs/db-connection');

// KBANK model
const KBANK = require('./models/stockKBANK');
require('./libs/db-connection');


// INSERT model
const insertDT = require('./models/insertData');
require('./libs/db-connection');

// view engine
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


//body pareser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// routes
app.get('/', (req, res) => {
  let gt, lt;
  User.find({})
    .then(users => {
      gt = users.filter(user => user.age > 18);
      lt = users.filter(user => user.age <  18);
      res.render('index', {greater: gt.length, less: lt.length});
    })
    .catch(err => console.error(err));
});
/*
app.get('/generate', (req, res) => {
  for (let i = 0; i < 100; i++) {
    let firstName = faker.name.firstName(),
        lastName = faker.name.lastName(),
        randomAge = Math.round(Math.random() * (90 - 1) + 1);
    // create users
    User.create({firstName: firstName, lastName: lastName, age: randomAge})
      .then(() => {})
      .catch(err => console.error(err));
  } // end for loop
  res.redirect('/');
});
*/
app.get('/ptt', (req, res, next) => {
  //console.log('getDatastage');
  PTT.find({}).select({ "_id": 0,"Ticker": 0}).limit(50)
  .then(function(doc) {
    //console.log(doc);
    res.render('candlechart', {items: doc});
  })
  .catch(err => console.error(err));
});

app.get('/cpall', (req, res, next) => {
  //console.log('getDatastage');
  CPALL.find({}).select({ "_id": 0,"Ticker": 0}).limit(50)
  .then(function(doc) {
    //console.log(doc);
    res.render('candlechart', {items: doc});
  })
  .catch(err => console.error(err));
});

app.get('/dtac', (req, res, next) => {
  //console.log('getDatastage');
  DTAC.find({}).select({ "_id": 0,"Ticker": 0}).limit(50)
  .then(function(doc) {
    //console.log(doc);
    res.render('candlechart', {items: doc});
  })
  .catch(err => console.error(err));
});

app.get('/aot', (req, res, next) => {
  //console.log('getDatastage');
  AOT.find({}).select({ "_id": 0,"Ticker": 0}).limit(50)
  .then(function(doc) {
    //console.log(doc);
    res.render('candlechart', {items: doc});
  })
  .catch(err => console.error(err));
});

app.get('/kbank', (req, res, next) => {
  //console.log('getDatastage');
  KBANK.find({}).select({ "_id": 0,"Ticker": 0}).limit(50)
  .then(function(doc) {
    //console.log(doc);
    res.render('candlechart', {items: doc});
  })
  .catch(err => console.error(err));
});


server.listen(port, () => console.log(`App running on port ${port}`));

/*app.post('/addname', (req, res, next) => {
  
  var inputItem = {
    title: ('body: ', req.body.title)
  };
  console.log(inputItem);

  mongo.connect(url, function(err, db){
    assert.equal(null, error);
    db.collection('insertTitle').insertOne(inputItem, function(err, result){
      assert.equal(null, error);
      console.log('Item inserted');
      db.Close();
    });
  });
  res.redirect('/ptt');
});*/

/*app.post("/addname", (req, res) => {
  var myData = new PTT(req.body);
  myData.save()
    .then(item => {
      res.send(myData);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
    console.log('Item inserted');
});*/

app.post('/ptt', function(req, res) {
  //console.log('body: ', req.body);
  var jsonContent = [];
  var jsondata = ('body: ', req.body);
  console.log(jsondata);
 // var jsonContent = JSON.parse(jsondata);
  for (i = 0; i < jsondata.length; i++) {
    // Insert JSON OBJ to Model
    jsonContent[i] = new insertDT(jsondata[i]);
    // Insert JSON straight into MongoDB
    jsonContent[i].save(function(err) {
      if (err)
         throw err;
      else 
         console.log('save user successfully...');
    });
    
                  /*[jsondata[i].Date,
                      jsondata[i].Open,
                      jsondata[i].High,
                      jsondata[i].Low,
                      jsondata[i].Close,
                      jsondata[i].Volume     
                    ];*/
  };
  /*console.log('User Name: ', jsonContent[0].Date);
  var u = jsonContent;
  console.log('User: ', u[0]);
  console.log(u);*/
});


/*app.post('/ptt', function(request, response){
  console.log('body: ', req.body);
  var u = new insertDT({
    Date : ('body: ', req.body.Date), 
    Open : ('body: ', req.body.Open), 
    Heigh : ('body: ', req.body.Heigh), 
    Low : ('body: ', req.body.Low), 
    Close : ('body: ', req.body.Close), 
    Volume : ('body: ', req.body.Volume)
  });

  u.save(function(err) {
      if (err)
         throw err;
      else 
         console.log('save user successfully...');
  });
});*/