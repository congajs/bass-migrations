/*
 * This file is part of the bass-migrations module.
 *
 * (c) Anthony Matarazzo <email@anthonymatarazzo.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

// built-in modules
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var Migration = require('./Migration');

/**
 * This is the base command for all bass-migrations commands
 *
 * @author Anthony Matarazzo <email@anthonymatarazzo.com>
 */
module.exports = {

	/**
	 * Run the command
	 *
	 * @return {void}
	 */
	run: function(container, command, name, options, cb)
	{
		Migration.setContainer(container);

		// parse configuration
		var config = container.get('config').get('bass');

		if (typeof config['connections'] === 'undefined')
		{
			console.error('You must configure your Bass connections first.');
			cb();
			return;
		}

		if (typeof config['migrations'] === 'undefined' ||
			typeof config['migrations']['connection'] === 'undefined')
		{
			// TODO : we should probably allow for a way to pass in the connection to use as an option
			console.error('You must configure your migrations connection first.');
			cb();
			return;
		}

		// if we do not have a migrations-dir, see if it has been configured in the config.yml
		if (typeof config['migrations']['directory'] !== 'undefined' &&
			(typeof options['migrations-dir'] === 'undefined' ||
				options['migrations-dir'].toString().length == 0))
		{
			options['migrations-dir'] = config.migrations.directory;
		}

		// make sure we have the db connection specified
		var connection = config.migrations.connection;

		if (typeof config.connections[connection] === 'undefined')
		{
			console.error('Invalid connection specified: ' + connection);
			cb();
			return;
		}

		var c = config.connections[connection];

		// "Alternatively, you can specify a DATABASE_URL environment variable that will be used in place of the configuration file settings.
		// This is helpful for use with Heroku." https://github.com/kunklejr/node-db-migrate
		process.env['DATABASE_URL'] = c.driver + '://' + c.user + ':' + c.password + '@' + c.host + ':' + c.port + '/' + c.database;

		// build path to the migration command we will proxy
		var binPath = path.join(container.getParameter('kernel.project_path'), 'node_modules', 'db-migrate', 'bin', 'db-migrate');

		if (!fs.existsSync(binPath))
		{
			console.error('Path to migration bin not found at ' + binPath);
			cb();
		}
		else
		{
			//console.log('DB URL: ' + process.env['DATABASE_URL']);

			// comprise the argument list to pass to child process
			var args = [command];
			if (name)
			{
				args.push(name);
			}
			for (var m in options)
			{
				if (options[m])
				{
					args.push('--' + m + '=' + options[m]);
				}
			}

			//console.log(binPath + ' ' + args.join(' '));

			// execute the command
			try
			{
				var cmd = spawn(binPath, args,
				{
					//stdio: 'inherit',
					cwd: container.getParameter('kernel.project_path'),
					env: process.env
				});

				cmd.stdout.on('data', function(data)
				{
					console.log('' + data);
				});

				cmd.stderr.on('data', function(data)
				{
					console.error('' + data);
				});

				cmd.on('close', function(code)
				{
					cb();
				});
			}
			catch (e)
			{
				console.error(e.message);
				cb();
			}
		}
	}
};