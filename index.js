/**
 * promise based node-sqlite3 for co or koa
 */

var sqlite3 = require('sqlite3').verbose();
var Promise = require('bluebird');

module.exports = function(filename, mode) {


	function CoSqlite3(db) {
		this.db = db;
	}

	CoSqlite3.prototype = {
		close: function() {
			var that = this ;
			return new Promise(function(resolve,reject){
				that.db.close(function(err){
					if(err){
						reject(err);
					}
				});

				that.db.on('close',function(){
					resolve();
				});
			});
		},
		run: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve(this);
				});

				that.db.run.apply(that.db, args);
			});
		},
		get: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err,row) {
					if (err) {
						reject(err);
					}
					resolve(row);
				});

				that.db.get.apply(that.db, args);
			});
		},
		all: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err,row) {
					if (err) {
						reject(err);
					}
					resolve(row);
				});

				that.db.all.apply(that.db, args);
			});
		},
	};

	// sqlite3 connection
	return new Promise(function(resolve, reject) {
		var db = new sqlite3.Database(filename, mode);

		db.on('open', function() {
			//console.log(new CoSqlite3(db).run);
			resolve(new CoSqlite3(db));
		});

		db.on('error', function(err) {
			reject(err);
		});

		//return db;
	});

};