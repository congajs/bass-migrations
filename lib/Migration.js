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

// current instance
var instance;

/**
 * Migration Singleton Class
 *
 * @constructor
 * @throws Error
 */
function Migration()
{
	throw new Error('Migration is a singleton class that wraps around Helper, you may not instantiate it.  Use Migration.singleton() instead.');
}

/**
 * Get the service container
 * @returns {Container|*}
 */
Migration.getContainer = function()
{
	return null;
};

/**
 * Get the conga js kernel
 * @returns {Kernel|*}
 */
Migration.getKernel = function() {
	return null;
};

/**
 * The Helper Class
 *
 * @constructor
 * @type {Function} Helper Class Constructor
 */
Migration.HelperClass = require('./Helper');

/**
 * Get the Singleton instance for the Migration Helper
 *
 * @returns {Helper}
 */
Migration.singleton = function()
{
	if (!instance)
	{
		instance = new Migration.HelperClass();
	}
	return instance;
};

/**
 * Perform an UP Migration
 *
 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
 * @param {Function} callback
 * @returns {void}
 */
Migration.up = function(db, callback)
{
	Migration.singleton()._up(db, callback);
};

/**
 * Perform a DOWN Migration
 *
 * @param {MysqlDriver|PgDriver|Sqlite3Driver|*} db
 * @param {Function} callback
 * @returns {void}
 */
Migration.down = function(db, callback)
{
	Migration.singleton()._down(db, callback);
};

/**
 * Tell the helper that we are ready to begin
 * @param {Kernel|*} kernel The conga js kernel
 * @returns {void}
 */
Migration.ready = function(kernel) {
	Migration.singleton()._ready(kernel);
};

module.exports = Migration;