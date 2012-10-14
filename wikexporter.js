#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var wrench = require('wrench');
var Showdown = require('showdown');
var converter = new Showdown.converter();

var optimist = require('optimist')
	.options({
		// All option keys
		'r': {
			alias: 'repo',
			demand: true,
			describe: 'GitHub (only) repo where to grab the wiki from (e.g. https://github.com/DiogoNeves/wikexporter.git)'
		},
		'd': {
			alias: 'directory',
			describe: 'Directory where to put the files !It\'ll be DELETED! Don\'t use a directory you need!',
			default: 'wiki/'
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

function safe_rmdirSyncRecursive(dir) {
	if (fs.existsSync(dir))
		wrench.rmdirSyncRecursive(dir, false);
}

function convertToHtml(src, dest) {
	fs.readFile(src, 'utf8', function(err, data) {
		if (err) {
			console.error('Failed to read "' + src + '"');
			return;
		}
		
		var html = converter.makeHtml(data);
		fs.writeFile(dest, html, 'utf8', function(err) {
			if (err)
				console.error('Failed to write "' + dest + '"');
		});
	});
}

// validate this is a repo
var url = require('url').parse(argv.repo);
if (url.hostname !== 'github.com') argv_fail('It must be a GitHub repo!');
if (url.query) argv_fail('Please, only plain repo urls, no queries ;)');
if (url.href.lastIndexOf('.git') !== (url.href.length - '.git'.length)) argv_fail('That isn\'t a git repo... is it?');

// validate directory and set constants
if (argv.directory.length <= 0) argv_fail('You can\'t output to an empty directory!');

// force directory
var directory = path.normalize(argv.directory + path.sep);
var srcDirectory = path.join(directory, '.src/');
var outDirectory = directory;

// generate the wiki repo from the original repo
// we use the lastIndexOf because it was validated above
var wikiRepo = argv.repo.substring(0, url.href.lastIndexOf('.git'));
wikiRepo += '.wiki.git';

// remove any previous grab
safe_rmdirSyncRecursive(directory);

// grab from the github repo provided
var Git = require('git-wrapper');
var git = new Git();

console.log('Grabbing wiki repo from "' + wikiRepo + '"');
git.exec('clone', [wikiRepo, srcDirectory], function(err, stdout) {
	if (err)
		fail('Failed to clone the wiki repo "' + wikiRepo + '\r\n' + stdout);
	
	// remove git directory
	safe_rmdirSyncRecursive(path.join(srcDirectory, '.git'));
	
	// go through the files and convert the .md files and copy the others
	wrench.readdirRecursive(srcDirectory, function(error, files) {
		if (files) {
			for (var f in files) {
				var file = files[f];
				var srcFile = path.join(srcDirectory, file);
				if (path.extname(file) === '.md') {
					// convert
					var destFile = path.basename(file, '.md') + '.html';
					console.log('Converting "' + file + '" to "' + destFile + '"');
					destFile = path.join(outDirectory, destFile);
					convertToHtml(srcFile, destFile);
				} else {
					// copy (possible resource)
					var destFile = path.join(outDirectory, file);
					console.log('Copying "' + file + '" to "' + destFile + '"');
					fs.createReadStream(srcFile).pipe(fs.createWriteStream(destFile));
				}
			}
		} else {
			console.log('Finished, YEAH! Enjoy your wiki at "' + outDirectory + '"');
		}
	});
});