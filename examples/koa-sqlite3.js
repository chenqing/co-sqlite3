var koa = require('koa');
var sqlite3 = require('../index');

var app = koa();

app.use(function*(next){
	this.db = yield sqlite3('test.db');
	yield next ;
});


app.use(function* (){
	this.body = yield this.db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50]);
})

app.listen(3000);

