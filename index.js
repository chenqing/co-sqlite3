/**
 * promise based node-sqlite3 for co or koa
 */

var sqlite3 = require('sqlite3').verbose();
var Promise = require('bluebird');

module.exports = function(filename, mode) {

	/*
	 * in node-sqlite3  include  database and statement 
	 */
	function CoSqlite3(db) {
		this.db = db;
	}

	function Statement(statement) {
		this.statement = statement;
	}

	CoSqlite3.prototype = {
		close: function() {
			var that = this;
			return new Promise(function(resolve, reject) {
				that.db.close(function(err) {
					if (err) {
						reject(err);
					}
				});

				that.db.on('close', function() {
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
				args.push(function(err, row) {
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
				args.push(function(err, rows) {
					if (err) {
						reject(err);
					}
					resolve(rows);
				});

				that.db.all.apply(that.db, args);
			});
		},
		each: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);
			return new Promise(function(resolve, reject) {
				var lastArgs = args[args.length - 1];
				if (typeof lastArgs !== 'function') {
					args.push(function(err, row) {
						if (err) {
							reject(err);
						}

						// TODO: how to reslove each row
					});
				}
				// complete callback
				args.push(function(err, num) {
					if (err) {
						reject(err);
					}
					resolve(num);
				});
				that.db.each.apply(that.db, args);

			});

		},
		exec: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve();
				});

				that.db.exec.apply(that.db, args);
			});
		},
		prepare: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);
			var statement;

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve(new Statement(statement));
				});

				statement = that.db.prepare.apply(that.db, args);
			});
		},
		loadExtension: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve(this);
				});

				that.db.loadExtension.apply(that.db, args);
			})
		},
	};
	Statement.prototype = {
		bind: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve();
				});

				that.statement.bind.apply(that.statement, args);
			});
		},
		reset: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err) {
					if (err) {
						reject(err);
					}
					resolve();
				});

				that.statement.reset.apply(that.statement, args);
			});
		},
		finalize: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function() {
					resolve();
				});

				that.statement.finalize.apply(that.statement, args);
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

				that.statement.run.apply(that.statement, args);
			});
		},
		get: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err, row) {
					if (err) {
						reject(err);
					}
					resolve(row);
				});

				that.statement.get.apply(that.statement, args);
			});
		},
		all: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);

			return new Promise(function(resolve, reject) {
				args.push(function(err, rows) {
					if (err) {
						reject(err);
					}
					resolve(rows);
				});

				that.statement.all.apply(that.statement, args);
			});
		},
		each: function() {
			var that = this;
			var args = Array.prototype.slice.call(arguments, 0);
			return new Promise(function(resolve, reject) {
				var lastArgs = args[args.length - 1];
				if (typeof lastArgs !== 'function') {
					args.push(function(err, row) {
						if (err) {
							reject(err);
						}

						// TODO: how to reslove each row
					});
				}
				// complete callback
				args.push(function(err, num) {
					if (err) {
						reject(err);
					}
					resolve(num);
				});
				that.statement.each.apply(that.statement, args);

			});

		}
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