var sqlite3 = require('../index');


sqlite3('test.db').then(function(db){
	db.get('SELECT * FROM testtable WHERE id < ? ORDER BY ID DESC ' ,[50])
	  .then(function(row){
	  	console.log(row);
	  });
});
