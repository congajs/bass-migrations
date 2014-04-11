// the base migration class
var Migration = require('./Migration');
module.exports = Migration;

// native modules
var path = require('path');

// set up the kernel
var kernel = require('conga-framework').kernel.factory.factory(
	'cli',
	'app', 	// TODO : need a way to configure this
	process.env.NODE_ENV || 'development',
	{}
);
kernel.boot(function() {
	Migration.ready(kernel);
});

/**
 * Get the service container
 * @returns {Container|*}
 */
Migration.getContainer = function()
{
	return kernel.container;
};