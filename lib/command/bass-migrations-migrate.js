/*
 * This file is part of the bass-migrations module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// built-in modules
var base = require('../BaseCommand');

/**
 * This command executes all available migrations
 *
 * @author Anthony Matarazzo <email@anthonymatarazzo.com>
 */
module.exports = {

	/**
	 * Set up configuration for this command
	 *
	 * @var {Object}
	 */
	config: {
		command: "bass:migrations:migrate [options]",
		description: "Execute all available database migrations.",
		options: {
			'env' : ['-e, --env', 'The environment to run the migrations under'] ,
			'migrations-dir' : ['-m, --migrations-dir', 'The directory containing your migration files'] ,
			'count' : ['-c, --count', 'Max number of migrations to run'] ,
			'dry-run' : ['--dry-run', 'Prints the SQL but does not run it'] ,
			'verbose' : ['--verbose, -v', 'Verbose Mode'] ,
			'config' : ['--config', 'Location of the database.json file'] ,
			'force-exit' : ['--force-exit', 'Call system.exit() after migration run']
		},
		arguments: ['name']
	},

	/**
	 * Run the command
	 *
	 * @return {void}
	 */
	run: function(container, args, options, cb)
	{
		container.get('logger').debug('running bass:migrations:migrate');

		base.run(container, 'up', null, options, cb);
	}
};