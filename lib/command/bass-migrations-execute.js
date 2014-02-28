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
 * This command executes a specific database migration, up or down
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
		command: "bass:migrations:execute <name> [options]",
		description: "Execute a database migration.  The name is the name of the migration.",
		options: {
			'up' : ['--up', 'To run the migration UP'] ,
			'down' : ['--down', 'To run the migration DOWN'] ,
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
		var cmd;
		if (typeof options['down'] !== 'undefined' &&
			options['down'])
		{
			cmd = 'down';
			delete options['down'];
		}
		else if (typeof options['up'] !== 'undefined' &&
				 options['up'])
		{
			cmd = 'up';
			delete options['up'];
		}
		else
		{
			console.error('You must specify either --up or --down');
			cb();
			return;
		}

		container.get('logger').debug('running bass:migrations:execute ' + args['name'] + ' --' + cmd);

		base.run(container, cmd, args['name'], options, cb);
	}
};