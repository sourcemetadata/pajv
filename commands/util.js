'use strict';

var anyjson = require('any-json');
var glob = require('glob');
var path = require('path');
var fs = require('fs');
var wait = require('deasync-promise');


module.exports = {
    getFiles: getFiles,
    openFile: openFile,
    logJSON: logJSON,
    compile: compile
};


function getFiles(args) {
    var files = [];
    if (Array.isArray(args)) args.forEach(_getFiles);
    else _getFiles(args);
    return files;

    function _getFiles(fileOrPattern) {
        if (glob.hasMagic(fileOrPattern)) {
            var dataFiles = glob.sync(fileOrPattern, { cwd: process.cwd() });
            files = files.concat(dataFiles);
        } else {
            files.push(fileOrPattern);
        }
    }
}

function getFormatFromFileName(filename) {
    var format = path.extname(filename).substr(1).toLowerCase();
    return format === 'yml' ? 'yaml' : format;
}


function openFile(filename, suffix){
    var file = path.resolve(process.cwd(), filename);
    try {
        var contents = fs.readFileSync(file).toString();
        var format = getFormatFromFileName(filename);
        return wait(anyjson.decode(contents, format));
    } catch(err) {
        console.error('error:  ' + err.message.replace(' module', ' ' + suffix));
        process.exit(2);
    }
}


function logJSON(mode, data, ajv) {
    switch (mode) {
        case 'json': data = JSON.stringify(data, null, '  '); break;
        case 'line': data = JSON.stringify(data); break;
        case 'no':   data = ''; break;
        case 'text': if (ajv) data = ajv.errorsText(data);
    }
    return data;
}


function compile(ajv, schemaFile) {
    var schema = openFile(schemaFile, 'schema');
    try { return ajv.compile(schema); }
    catch (err) {
        console.error('schema', schemaFile, 'is invalid');
        console.error('error:', err.message);
        process.exit(1);
    }
}
