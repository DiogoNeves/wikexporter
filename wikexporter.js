#!/usr/bin/env node
var argv = require('optimist')
	.options({
		// All option keys
		'r': {
			alias: 'repo',
			demand: true,
			describe: 'Repository where to grab the wiki from (e.g. https://github.com/DiogoNeves/wikexporter.git)'
		}
	})
	.argv
;

var Git = require('git-wrapper');
var git = new Git();

// validate this is a repo

// grab from the github repo provided