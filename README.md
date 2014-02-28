bass-migrations
===============

Migration library for CONGA + BASS , built on top of DB-MIGRATE

# Commands

## To generate a migration:

	$ conga bass:migrations:generate <name-of-migration>

## To run all available migrations:

	$ conga bass:migrations:migrate

## To execute a specific migration:

	$ conga bass:migrations:execute <name-of-migration> --up
	$ conga bass:migrations:execute <name-of-migration> --down

# Examples

Here are some usage examples for implementing migrations:

## Simple

	var Migration = require('bass-migrations').Migration;
	module.exports = Migration;

	Migration.singleton()

		.verbose(true)

		.up('alter table my_table modify column name varchar(100) null')

		.down('alter table my_table modify column name varchar(100) not null');


## Simple with Parameters

	var Migration = require('bass-migrations').Migration;
	module.exports = Migration;

	Migration.singleton()

		.up('insert into my_table (name) values (?)', ["my name"])

		.down('delete from my_table where name = ?', ["my name"]);


## Custom Finish Methods

	var Migration = require('bass-migrations').Migration;
	module.exports = Migration;

	Migration.singleton()

		.up('alter table my_table modify column name varchar(100) null')
		.up('alter table other_table add column status int(32) not null')

		.finishUp(function(db, callback)
		{
			console.log('The UP queries have finished!');

			callback();
		})

		.down('alter table my_table modify column name varchar(100) not null')
		.down('alter table other_table drop column status')

		.finishDown(function(db, callback)
		{
			console.log('The DOWN queries have finished!');

			callback();
		});


## Callback for individual query

	var Migration = require('bass-migrations').Migration;
	module.exports = Migration;

	Migration.singleton()

		.up('alter table my_table modify column name varchar(100) null', null, function(callback)
		{
			console.log('The first UP query has finished');
			callback();
		})

		.up('alter table other_table add column status int(32) not null')

		.down('alter table my_table modify column name varchar(100) not null')
		.down('alter table other_table drop column status');