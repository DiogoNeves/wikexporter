#!/usr/bin/env node
var optimist = require('optimist')
	.options({
		// All option keys
		'r': {
			alias: 'repo',
			demand: true,
			describe: 'GitHub (only) repo where to grab the wiki from (e.g. https://github.com/DiogoNeves/wikexporter.git)'
		}
	});
;
var argv = optimist.argv;

function argv_fail(msg) {
	optimist.showHelp();
	if (msg)
		console.error('Problem: ' + msg);
	process.exit(1);
}

function fail(msg) {
	if (msg)
		console.error('Fatal: ' + msg);
	process.exit(2);
}

// validate this is a repo
var url = require('url').parse(argv.repo);
if (url.hostname !== 'github.com') argv_fail('It must be a GitHub repo!');
if (url.query) argv_fail('Please, only plain repo urls, no queries ;)');
if (url.href.lastIndexOf('.git') !== (url.href.length - '.git'.length)) argv_fail('That isn\'t a git repo... is it?');

// generate the wiki repo from the original repo
// we use the lastIndexOf because it was validated above
var wikiRepo = argv.repo.substring(0, url.href.lastIndexOf('.git'));
wikiRepo += '.wiki.git';

// remove any previous grab
var fs = require('fs');
if (fs.existsSync('.wiki')) {
	var wrench = require('wrench');
	wrench.rmdirSyncRecursive('.wiki', false);
}

// grab from the github repo provided
var Git = require('git-wrapper');
var git = new Git();

console.log('Grabbing wiki repo from "' + wikiRepo + '"');
git.exec('clone', [wikiRepo, '.wiki/'], function(err, stdout) {
	if (err)
		fail('Failed to clone the wiki repo "' + wikiRepo + '\r\n' + stdout);
	
	// convert .md files to html
});