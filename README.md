# Polyglottal JSON Schema Validator (Polyglottal Ajv)

Command line interface for [ajv](https://github.com/epoberezkin/ajv) that utilizes [any-json](https://github.com/laktak/any-json/) to provide validation against many data formats. `pjsv` can validate: **[CSON](https://github.com/bevry/cson), [Hjson](http://hjson.org/), [JSON](http://json.org/), [JSON5](http://json5.org/), and [YAML](http://yaml.org/)** files using JSON Schema.  pjsv is a fork of [ajv-cli](https://github.com/jessedc/ajv-cli).

[![Build Status](https://travis-ci.org/json-schema-everywhere/pajv.svg?branch=master)](https://travis-ci.org/json-schema-everywhere/pajv)
[![npm version](https://badge.fury.io/js/pajv.svg)](https://www.npmjs.com/package/pajv)
[![Code Climate](https://codeclimate.com/github/json-schema-everywhere/pajv/badges/gpa.svg)](https://codeclimate.com/github/json-schema-everywhere/pajv)
[![Coverage Status](https://coveralls.io/repos/github/json-schema-everywhere/pajv/badge.svg?branch=master)](https://coveralls.io/github/json-schema-everywhere/pajv?branch=master)

## Contents

- [Installation](#installation)
- Commands
  - [Help](#help)
  - [Validate data](#validate-data)
  - [Test validation result](#test-validation-result)
- [Ajv options](#ajv-options)
- [Version History, License](#version_history)


## Installation

```sh
npm install -g pajv
```


## Help

```sh
pajv help
pajv help validate
pajv help test
```


## Validate data

This command validates data files against JSON-schema

```sh
pajv validate -s test/schema.json -d test/valid_data.json
pajv -s test/schema.json -d test/valid_data.json
```

You can omit `validate` command name and `.json` from the [input file names](https://nodejs.org/api/modules.html#modules_file_modules). 


#### Parameters

##### `-s` - file name of JSON-schema

Only one schema can be passed in this parameter


##### `-d` - JSON data

Multiple data files can be passed, as in `-r` parameter:

```sh
pajv -s test/schema.json -d "test/valid*.json"
```

If some file is invalid exit code will be 1.


##### `-r` - referenced schemas

The schema in `-s` parameter can reference any of these schemas with `$ref` keyword.

Multiple schemas can be passed both by using this parameter mupltiple times and with [glob patterns](https://github.com/isaacs/node-glob#glob-primer). Glob pattern should be quoted and extensions cannot be omitted.


##### `-m` - meta-schemas

Schemas can use any of these schemas as a meta-schema (that is the schema used in `$schema` keyword - it is used to validate the schema itself).

Multiple meta-schemas can be passed, as in `-r` parameter.


##### `-c` - custom keywords/formats definitions

You can pass module(s) that define custom keywords/formats. The modules should export a function that accepts Ajv instance as a parameter. The file name should start with ".", it will be resolved relative to the current folder. The package name can also be passed - it will be used in require as is.

For example, you can use `-c ajv-keywords` to add all keywords from [ajv-keywords](https://github.com/epoberezkin/ajv-keywords) package or `-c ajv-keywords/keywords/typeof` to add only typeof keyword.


#### Options

- `--errors=`: error reporting format. Possible values:
    - `js` (default): JavaScript object
    - `json`: JSON with indentation and line-breaks
    - `line`: JSON without indentaion/line-breaks (for easy parsing)
    - `text`: human readable error messages with data paths

- `--changes=`: detect changes in data after validation.<br>
    Data can be modifyed with [Ajv options](#ajv-options) `--remove-additional`, `--use-defaults` and `--coerce-types`).<br>
    The changes are reported in JSON-patch format ([RFC6902](https://tools.ietf.org/html/rfc6902)).<br>
    Possible values are `js` (default), `json` and `line` (see `--errors` option).


## Test validation result

This command asserts that the result of the validation is as expected.

```sh
pajv test -s test/schema.json -d test/valid_data.json --valid
pajv test -s test/schema.json -d test/invalid_data.json --invalid
```

If the option `--valid` (`--invalid`) is used for the `test` to pass (exit code 0) the data file(s) should be valid (invalid).

This command supports the same options and parameters as [validate](#validate-data) with the exception of `--changes`.


## Ajv options

You can pass the following Ajv options:

|Option|Description|
|---|---|
|`--data`|use [$data references](https://github.com/epoberezkin/ajv#data-reference)|
|`--all-errors`|collect all errors|
|`--unknown-formats=`|handling of unknown formats|
|`--verbose`|include schema and data in errors|
|`--json-pointers`|report data paths in errors using JSON-pointers|
|`--unique-items=false`|do not validate uniqueItems keyword|
|`--unicode=false`|count unicode pairs as 2 characters|
|`--format=full`|format mode|
|`--schema-id=`|keyword(s) to use as schema ID|
|`--extend-refs=`|validation of other keywords when $ref is present in the schema|
|`--missing-refs=`|handle missing referenced schemas (true/ignore/fail)|
|`--inline-refs=`|referenced schemas compilation mode (true/false/\<number\>)|
|`--remove-additional`|remove additional properties (true/all/failing)|
|`--use-defaults`|replace missing properties/items with the values from default keyword|
|`--coerce-types`|change type of data to match type keyword|
|`--multiple-of-precision`|precision of multipleOf, pass integer number|
|`--error-data-path=property`|data path in errors|
|`--messages=false`|do not include text messages in errors|

Options can be passed in either dash-case and camelCase.

See [Ajv Options](https://github.com/epoberezkin/ajv#options) for more information.


## Version History

See https://github.com/json-schema-everywhere/pajv/releases


## Licence

MIT
