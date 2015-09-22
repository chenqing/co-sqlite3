var co = require('co');
var sqlite3 = require('../index');

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