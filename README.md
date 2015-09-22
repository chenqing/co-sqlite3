## co-sqlite3

[![Build Status](https://travis-ci.org/chenqing/co-sqlite3.svg?branch=master)](https://travis-ci.org/chenqing/co-sqlite3)

### Installing

```
npm install co-sqlite3
```

### Usage

#### 1. work with co 



```
var co = require('co');
var sqlite3 = require('co-sqlite3');

co(function*() {

    //connect a database
     
    var db = yield sqlite3('test.db');

    // create a table 
    yield db.run('CREATE TABLE IF NOT EXISTS testtable (id INT NOT NULL)');

    var stmt = yield db.prepare('INSERT INTO testtable(id) VALUES( ? )');
    
    for(var i =0 ; i < 100 ; i++){
        yield stmt.run(i);
    }

    stmt.finalize();

    var row = yield db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50]); 
    console.log(row); // {id: 49}

    var rows = yield db.all('SELECT * FROM testtable');
    console.log(rows.length);


}).catch(function(err) {

    console.log(err.stack);

});

```


#### 2 work with koa


```
var koa = require('koa');
var sqlite3 = require('co-sqlite3');

var app = koa();

app.use(function*(next){
    this.db = yield sqlite3('test.db');
    yield next ;
});


app.use(function* (){
    this.body = yield this.db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50]);
})

app.listen(3000);


```



### 3 just as a promise



```
var sqlite3 = require('co-sqlite3');


sqlite3('test.db').then(function(db){
    db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50])
      .then(function(row){
        console.log(row);
      });
});
```
