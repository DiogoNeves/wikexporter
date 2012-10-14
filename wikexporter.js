#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var wrench = require('wrench');
var url = require('url');
var Showdown = require('showdown');
var converter = new Showdown.converter();

var program = require('commander')
	.version('0.0.10')
	.description('Exports GitHub wiki pages from md to html')
	.option('-r, --repo <github-repo>', 'GitHub (only) repo where to grab the wiki from (e.g. https://github.com/DiogoNeves/wikexporter.git)')
	.option('-d, --directory [directory]', 'Directory where to put the files !It\'ll be DELETED! Don\'t use a directory you need!', 'wiki/')
	.parse(process.argv)
;
var argv = program;

function argv_fail(msg) {
	if (msg)
		console.error('  Problem: ' + msg);
	program.help();
}

function fail(msg) {
	if (msg)
		console.error('  Fatal: ' + msg);
	process.exit(2);
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

function grabAndConvertWiki() {
	// grab from the github repo provided
	var Git = require('git-wrapper');
	var git = new Git();

	console.log('Grabbing wiki repo from "' + wikiRepo + '"');
	git.exec('clone', [wikiRepo, srcDirectory], function(err, stdout) {
		if (err)
			fail('Failed to clone the wiki repo "' + wikiRepo + '\r\n' + stdout);
		
		// remove git directory
		wrench.rmdirSyncRecursive(path.join(srcDirectory, '.git'));
		
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
}

// validate this is a repo
if (!argv.repo) argv_fail('You have to set a repository (-r, --repo <github-repo>)');
var url = url.parse(argv.repo);
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
if (fs.existsSync(directory)) {
	// confirm the user wants to remove the folder
	program.confirm('I have to remove "' + directory + '" directory and its contents, continue (y/n)?', function(ok) {
		if (ok) {
			wrench.rmdirSyncRecursive(directory, false);
			grabAndConvertWiki();
		} else {
			console.log('cancelled');
		}
		
		process.stdin.destroy();
	});
} else {
	grabAndConvertWiki();
}