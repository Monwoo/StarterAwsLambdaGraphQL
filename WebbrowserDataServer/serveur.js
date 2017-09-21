// Copyright Monwoo 2017, service@monwoo.com, code by Miguel Monwoo

// using :
// https://pouchdb.com/
// https://www.npmjs.com/package/couchdb-to-mysql
var PouchDB = require('pouchdb');
var converter = require('couchdb-to-mysql');

const CONFIG = require('./config-converter.json');

// var cvr = converter(CONFIG);
// cvr.connect();
// cvr.on('created', function (change) {
//     // replicate changes on mysql
//     console.log('Replicating to MySql', change);
// });

var db = new PouchDB('dbname');

db.changes().on('change', function() {
  console.log('Changes from PouchDB');
});

// db.replicate.to('http://example.com/mydb');

db.put({
  _id: 'miguel@monwoo.com',
  name: 'Miguel',
  age: 29
});
