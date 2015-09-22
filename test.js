/**
 * promise based node-sqlite3 for co or koa
 */
var db = require('./index.js');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var assert = chai.assert;
var fs = require('fs');

chai.use(require('chai-as-promised'));

describe('New sqlite3.Database test', function() {

	// after this test ,delete test.db
	after(function() {
		fs.unlinkSync('test.db');
	});

	it('should create success if filename is writeable', function() {
		db('test.db').then(function(data) {
			expect(data.db).to.have.property('filename').with.equal('test.db');
		}, function(err) {
			should.not.exist(err);
		});
	});

	it('should create fail if filename is unwriteable', function() {
		db('/somepaththatnotexist/test.db').then(function(data) {
			should.not.exist(data);
		}, function(err) {
			should.exist(err);
		});
	});
});

// db.run test

describe('Database#run API test', function() {

	var sqlCreateTable = 'CREATE TABLE IF NOT EXISTS testtable2( id INT NOT NULL) ;INSERT INTO testtable2(id) VALUES(1)';
	var sqlCreateTableWrong = 'INSERT INTO testta VALUES("string")';


	it('should run sql  success if sql right', function() {
		db('test2.db').then(function(data) {
			return data.run(sqlCreateTable).should.eventually.have.property('lastID');
		});

	});
	it('should run sql  fail if sql wrong', function() {
		db('test2.db').then(function(data) {
			return data.run(sqlCreateTableWrong).should.be.rejected;
		});

	});


});

// db.close test

describe('Database#close API test', function() {

	// after this test ,delete test2.db
	after(function() {
		//fs.unlinkSync('test2.db');

	});
	it('should close success have opened connection', function() {
		db('test2.db').then(function(data) {
			return data.close().should.eventually.resolve;
		});

	});


});


// db.get test


describe('Database#get API test', function() {
	var selectSQL = 'SELECT * FROM testtable2;'
		// after this test ,delete test2.db
	after(function() {
		//fs.unlinkSync('test2.db');

	});


	it('should get one record with id ', function() {
		db('test2.db').then(function(data) {
			return expect(data.get(selectSQL)).to.eventually.have.property('id');
		});

	});
});

// db.get test
describe('Database#all API test', function() {
	var selectSQL = 'SELECT * FROM testtable2;';
	var state ;

	before(function(){
		// insert more data to table
		db('test2.db').then(function(data){
			[1,2,3].forEach(function(item){
				data.run('INSERT INTO testtable2(id) VALUES(?)',[item]).then(function(){
					state = true;
				});
			});
		});
	});
		// after this test ,delete test2.db
	after(function() {
		//fs.unlinkSync('test2.db');

	});


	it('should get more than one record  ', function() {
		db('test2.db').then(function(data) {
			return expect(data.all(selectSQL)).to.eventually.be.a('array');
		});

	});
});