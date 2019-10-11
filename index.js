'use strict';

const default_parse_library = {
	str:  require("./parse_modules/library/str.js"),
	array:  require("./parse_modules/library/array.js"),
};

const default_parse_modules = {
	log: require("./parse_modules/log.js"),
	custom: require("./parse_modules/custom.js"),
	base64: require("./parse_modules/base64.js"),
	between: require("./parse_modules/between.js"),
	dom: require("./parse_modules/dom.js"),
	json: require("./parse_modules/json.js"),
	key: require("./parse_modules/key.js"),
	regex: require("./parse_modules/regex.js"),
	reverse: require("./parse_modules/reverse.js"),
	trim: require("./parse_modules/trim.js"),
};

class Poliparser {

	constructor(parser, custom_modules = {}) {
		
		this.parser = parser;

		let base_module_obj = default_parse_modules;

		let libs = Object.keys(default_parse_library);
		libs.forEach(lib => {
			let modules = Object.keys(default_parse_library[lib]);
			modules.forEach(mod => {
				base_module_obj[lib + '_' + mod] = default_parse_library[lib][mod];
			});
		});

		this.parse_modules = Object.assign({}, base_module_obj, custom_modules);
	}

	run(data){
		let out = {};
		for (const k in this.parser)
			out[k] = this._parse(data, this.parser[k]);
		return out;
	}

	setModule(name, new_module){
		this.parse_modules[name] = new_module;
	}

	modList(){
		return  Object.keys(this.parse_modules);
	}

	setLibrary(name, new_library){
		let modules = Object.keys(new_library);
		modules.forEach(mod => {
			this.parse_modules[name + '_' + mod] = new_library[mod];
		});
	}

	_parse(data, block){
		if(block.constructor == Array) {
			let dOut = data;
			for (let i = 0; i < block.length; i++) {
				dOut = this._parse(dOut, block[i]);
			}
			return dOut;
		}
		for (const k in this.parse_modules) {
			if(block.f == k){
				return this.parse_modules[k](data, block);
			}
		}
		return data;
	}
}

module.exports = Poliparser;