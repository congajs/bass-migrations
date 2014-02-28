/*
 * This file is part of the bass-migrations module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// third party modules
var dbm = require('db-migrate');
var type = dbm.dataType;

/**
 * The Helper class helps with chaining queries together
 * when doing multiple query migrations
 *
 * @constructor
 */
function Helper()
{
	this._upSql = [];
	this._downSql = [];
}

Helper.prototype = {
	/**
	 * Array of SQL statements to execute UP
	 *
	 * @protected
	 * @type {Array<String>}
	 */
	_upSql: null ,

	/**
	 * Array of SQL statements to execute DOWN
	 *
	 * @protected
	 * @type {Array<String>}
	 */
	_downSql: null ,

	/**
	 * Verbose boolean flag tells us whether or not to output queries and such
	 *
	 * @protected
	 * @type {Boolean}
	 */
	_verbose: false ,

	/**
	 * Custom callback to run after UP queries are finished
	 *
	 * @protected
	 * @type {Function}
	 */
	_upCallback: null ,

	/**
	 * Custom callback to run after DOWN queries are finished
	 *
	 * @protected
	 * @type {Function}
	 */
	_downCallback: null ,

	/**
	 * Run the execute UP
	 *
	 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
	 * @param {Function} callback
	 * @protected
	 * @returns {void}
	 */
	_up: function(db, callback)
	{
		var self = this;
		var obj = this._upSql.shift();
		var hasNext = (this._upSql.length > 0);
		if (obj)
		{
			this.log([obj.sql, obj.params, hasNext ? 'Loop' : 'Done']);
			db.runSql(
				obj.sql ,
				obj.params ,
				function()
				{
					if (hasNext)
					{
						if (typeof obj.callback === 'function')
						{
							obj.callback(db, function()
							{
								self._up(db, callback);
							});
						}
						else
						{
							self._up(db, callback);
						}
					}
					else
					{
						if (typeof obj.callback === 'function')
						{
							obj.callback(db, function()
							{
								self._finishUp(db, callback);
							});
						}
						else
						{
							self._finishUp(db, callback);
						}
					}
				}
			);
		}
		else
		{
			this._finishUp(db, callback);
		}
	} ,

	/**
	 * Run the execute DOWN
	 *
	 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
	 * @param {Function} callback
	 * @protected
	 * @returns {void}
	 */
	_down: function(db, callback)
	{
		var self = this;
		var obj = this._downSql.shift();
		var hasNext = (this._downSql.length > 0);
		if (obj)
		{
			this.log([obj.sql, obj.params, hasNext ? 'Loop' : 'Done']);
			db.runSql(
				obj.sql ,
				obj.params ,
				function()
				{
					if (hasNext)
					{
						if (typeof obj.callback === 'function')
						{
							obj.callback(db, function()
							{
								self._down(db, callback);
							});
						}
						else
						{
							self._down(db, callback);
						}
					}
					else
					{
						if (typeof obj.callback === 'function')
						{
							obj.callback(db, function()
							{
								self._finishDown(db, callback);
							});
						}
						else
						{
							self._finishDown(db, callback);
						}
					}
				}
			);
		}
		else
		{
			this._finishDown(db, callback);
		}
	} ,

	/**
	 * Execute the UP final callback
	 *
	 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
	 * @param {Function} callback This is the final callback for the query (you must execute the callback yourself!)
	 * @returns {Helper}
	 * @protected
	 */
	_finishUp: function(db, callback)
	{
		this.log('Finishing Up...');
		if (typeof this._upCallback === 'function')
		{
			this.log('Custom callback...');
			this._upCallback(db, callback);
		}
		else if (typeof callback === 'function')
		{
			callback();
		}
		return this;
	} ,

	/**
	 * Execute the DOWN final callback
	 *
	 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
	 * @param {Function} callback This is the final callback for the query (you must execute the callback yourself!)
	 * @returns {Helper}
	 * @protected
	 */
	_finishDown: function(db, callback)
	{
		this.log('Finishing Down...');
		if (typeof this._downCallback === 'function')
		{
			this.log('Custom callback...');
			this._downCallback(db, callback);
		}
		else if (typeof callback === 'function')
		{
			callback();
		}
		return this;
	} ,

	/**
	 * Change the verbose boolean flag
	 * @param {Boolean} bool
	 * @returns {Helper}
	 */
	verbose: function(bool)
	{
		this._verbose = !!bool;
		return this;
	} ,

	/**
	 * Write something to the log - only logs if verbose is true
	 * @param {*} data
	 * @returns {Helper}
	 */
	log: function(data)
	{
		if (this._verbose)
		{
			console.log(data);
		}
		return this;
	} ,

	/**
	 * Add SQL UP
	 * @param {String} sql
	 * @param {Object|null|undefined} params
	 * @param {Function|null|undefined} callback
	 * @returns {Helper}
	 */
	up: function(sql, params, callback)
	{
		this._upSql.push({sql: sql, params: params, callback: callback});
		return this;
	} ,

	/**
	 * Add SQL DOWN
	 * @param {String} sql
	 * @param {Object|null|undefined} params
	 * @param {Function|null|undefined} callback
	 * @returns {Helper}
	 */
	down: function(sql, params, callback)
	{
		this._downSql.push({sql: sql, params: params, callback: callback});
		return this;
	} ,

	/**
	 * Add a callback to run after UP queries execute
	 *
	 * @param {Function} callback
	 * @returns {Helper}
	 */
	finishUp: function(callback)
	{
		this._upCallback = callback;
		return this;
	} ,

	/**
	 * Add a callback to run after DOWN queries execute
	 *
	 * @param {Function} callback
	 * @returns {Helper}
	 */
	finishDown: function(callback)
	{
		this._downCallback = callback;
		return this;
	}
};

module.exports = Helper;