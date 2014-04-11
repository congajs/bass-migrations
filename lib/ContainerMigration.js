// the base migration class
var Migration = require('./Migration');
module.exports = Migration;

// native modules
var path = require('path');

// private kernel var
var kernel = null;

/**
 * Get the service container
 * @returns {Container|*}
 */
Migration.getContainer = function()
{
	if (kernel) {
		return kernel.container;
	}

	return null;
};

/**
 * Get the conga js kernel
 * @returns {Kernel|*}
 */
Migration.getKernel = function() {
	return kernel;
};

kernel = Migration.getKernel();

if (!kernel) {
	// set up the kernel
	kernel = require('conga-framework').kernel.factory.factory(
		'cli',
		'app', 	// TODO : need a way to configure this
		process.env.NODE_ENV || 'development',
		{}
	);
	kernel.boot(function() {
		Migration.ready(kernel);
	});

} else {

	// use the previous kernel
	Migration.ready(kernel);
}