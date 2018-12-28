/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const cmark = __webpack_require__(1);
const md = __webpack_require__(7);

async function parse(text) {
    console.time('cmark');
    const html = await cmark.toHTML(md);
    console.timeEnd('cmark');
    return html;
}

function render(html) {
    console.time('render');
    const app = document.getElementById('app');
    app.innerHTML = html;
    console.timeEnd('render');
}

(async function () {
    const html = await parse(md);
    render(html);
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * Copyright (c) 2018 Mark Vasilkov (https://github.com/mvasilkov)
 * License: MIT */


const utf8 = __webpack_require__(2)

let cmark_markdown_to_html, cmark_version, cmark_version_string

const wait = new Promise(done => {
    __webpack_require__(3)().then(Module => {
        if (!Module.usingWasm) {
            throw Error('Not good')
        }

        cmark_markdown_to_html = Module.cwrap('cmark_markdown_to_html', 'string', ['string', 'number', 'number'])
        cmark_version = Module.cwrap('cmark_version', 'number', null)
        cmark_version_string = Module.cwrap('cmark_version_string', 'string', null)

        done()
    })
})

exports.OPT_DEFAULT = 0
exports.OPT_SOURCEPOS = (1 << 1)
exports.OPT_HARDBREAKS = (1 << 2)
exports.OPT_SAFE = (1 << 3)
exports.OPT_NOBREAKS = (1 << 4)
exports.OPT_NORMALIZE = (1 << 8)
exports.OPT_VALIDATE_UTF8 = (1 << 9)
exports.OPT_SMART = (1 << 10)

exports.toHTML = function toHTML(a, options = 0) {
    return wait.then(() => cmark_markdown_to_html(a, utf8.lengthBytesUTF8(a), options))
}

exports.version = function version() {
    return wait.then(function () {
        /* Python: tuple(cmark_version().to_bytes(3, byteorder='big')) */
        const a = cmark_version()
        return [
            a >> 16 & 255, // major
            a >> 8 & 255, // minor
            a & 255, // patchlevel
        ]
    })
}

exports.versionString = function versionString() {
    return wait.then(() => cmark_version_string())
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* This file is part of the pastechan project.
 * https://github.com/mvasilkov/pastechan
 * License: MIT */


// The following is based on Emscripten's UTF-8 functions.
// Returns the number of bytes the given JavaScript string takes if encoded as a UTF8 byte array.
exports.lengthBytesUTF8 = function lengthBytesUTF8(a) {
    let len = 0
    for (let n = 0; n < a.length; ++n) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit,
        // not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        let u = a.charCodeAt(n) // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (a.charCodeAt(++n) & 0x3FF)
        if (u <= 0x7F) {
            ++len
        }
        else if (u <= 0x7FF) {
            len += 2
        }
        else if (u <= 0xFFFF) {
            len += 3
        }
        else if (u <= 0x1FFFFF) {
            len += 4
        }
        else if (u <= 0x3FFFFFF) {
            len += 5
        }
        else {
            len += 6
        }
    }
    return len
}

exports.stringToUTF8Array = function stringToUTF8Array(a, outU8Array) {
    let p = 0
    for (let n = 0; n < a.length; ++n) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code unit,
        // not a Unicode code point of the character! So decode UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description and
        // https://www.ietf.org/rfc/rfc2279.txt and https://tools.ietf.org/html/rfc3629
        let u = a.charCodeAt(n) // possibly a lead surrogate
        if (u >= 0xD800 && u <= 0xDFFF) u = 0x10000 + ((u & 0x3FF) << 10) | (a.charCodeAt(++n) & 0x3FF)
        if (u <= 0x7F) {
            outU8Array[p++] = u
        }
        else if (u <= 0x7FF) {
            outU8Array[p++] = 0xC0 | (u >> 6)
            outU8Array[p++] = 0x80 | (u & 63)
        }
        else if (u <= 0xFFFF) {
            outU8Array[p++] = 0xE0 | (u >> 12)
            outU8Array[p++] = 0x80 | ((u >> 6) & 63)
            outU8Array[p++] = 0x80 | (u & 63)
        }
        else if (u <= 0x1FFFFF) {
            outU8Array[p++] = 0xF0 | (u >> 18)
            outU8Array[p++] = 0x80 | ((u >> 12) & 63)
            outU8Array[p++] = 0x80 | ((u >> 6) & 63)
            outU8Array[p++] = 0x80 | (u & 63)
        }
        else if (u <= 0x3FFFFFF) {
            outU8Array[p++] = 0xF8 | (u >> 24)
            outU8Array[p++] = 0x80 | ((u >> 18) & 63)
            outU8Array[p++] = 0x80 | ((u >> 12) & 63)
            outU8Array[p++] = 0x80 | ((u >> 6) & 63)
            outU8Array[p++] = 0x80 | (u & 63)
        }
        else {
            outU8Array[p++] = 0xFC | (u >> 30)
            outU8Array[p++] = 0x80 | ((u >> 24) & 63)
            outU8Array[p++] = 0x80 | ((u >> 18) & 63)
            outU8Array[p++] = 0x80 | ((u >> 12) & 63)
            outU8Array[p++] = 0x80 | ((u >> 6) & 63)
            outU8Array[p++] = 0x80 | (u & 63)
        }
    }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, __dirname) {var Module=function(){var _scriptDir="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0;return function(Module){Module=void 0!==(Module=Module||{})?Module:{};var key,moduleOverrides={};for(key in Module)Module.hasOwnProperty(key)&&(moduleOverrides[key]=Module[key]);Module.arguments=[],Module.thisProgram="./this.program",Module.quit=function(status,toThrow){throw toThrow},Module.preRun=[];var ENVIRONMENT_IS_WORKER,ENVIRONMENT_IS_NODE,ENVIRONMENT_IS_SHELL,ENVIRONMENT_IS_WEB=Module.postRun=[];ENVIRONMENT_IS_WEB="object"==typeof window,ENVIRONMENT_IS_WORKER="function"==typeof importScripts,ENVIRONMENT_IS_NODE="object"==typeof process&&"function"=="function"&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER,ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var nodeFS,nodePath,scriptDirectory="";function locateFile(path){return Module.locateFile?Module.locateFile(path,scriptDirectory):scriptDirectory+path}ENVIRONMENT_IS_NODE?(scriptDirectory=__dirname+"/",Module.read=function(filename,binary){var ret;return nodeFS||(nodeFS=__webpack_require__(5)),nodePath||(nodePath=__webpack_require__(6)),filename=nodePath.normalize(filename),ret=nodeFS.readFileSync(filename),binary?ret:ret.toString()},Module.readBinary=function(filename){var ret=Module.read(filename,!0);return ret.buffer||(ret=new Uint8Array(ret)),assert(ret.buffer),ret},1<process.argv.length&&(Module.thisProgram=process.argv[1].replace(/\\/g,"/")),Module.arguments=process.argv.slice(2),process.on("uncaughtException",function(ex){if(!(ex instanceof ExitStatus))throw ex}),process.on("unhandledRejection",abort),Module.quit=function(status){process.exit(status)},Module.inspect=function(){return"[Emscripten Module object]"}):ENVIRONMENT_IS_SHELL?("undefined"!=typeof read&&(Module.read=function(f){return read(f)}),Module.readBinary=function(f){var data;return"function"==typeof readbuffer?new Uint8Array(readbuffer(f)):(assert("object"==typeof(data=read(f,"binary"))),data)},"undefined"!=typeof scriptArgs?Module.arguments=scriptArgs:void 0!==arguments&&(Module.arguments=arguments),"function"==typeof quit&&(Module.quit=function(status){quit(status)})):(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&(ENVIRONMENT_IS_WORKER?scriptDirectory=self.location.href:document.currentScript&&(scriptDirectory=document.currentScript.src),_scriptDir&&(scriptDirectory=_scriptDir),scriptDirectory=0!==scriptDirectory.indexOf("blob:")?scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1):"",Module.read=function(url){var xhr=new XMLHttpRequest;return xhr.open("GET",url,!1),xhr.send(null),xhr.responseText},ENVIRONMENT_IS_WORKER&&(Module.readBinary=function(url){var xhr=new XMLHttpRequest;return xhr.open("GET",url,!1),xhr.responseType="arraybuffer",xhr.send(null),new Uint8Array(xhr.response)}),Module.readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,!0),xhr.responseType="arraybuffer",xhr.onload=function(){200==xhr.status||0==xhr.status&&xhr.response?onload(xhr.response):onerror()},xhr.onerror=onerror,xhr.send(null)},Module.setWindowTitle=function(title){document.title=title});var out=Module.print||("undefined"!=typeof console?console.log.bind(console):"undefined"!=typeof print?print:null),err=Module.printErr||("undefined"!=typeof printErr?printErr:"undefined"!=typeof console&&console.warn.bind(console)||out);for(key in moduleOverrides)moduleOverrides.hasOwnProperty(key)&&(Module[key]=moduleOverrides[key]);moduleOverrides=void 0;function alignMemory(size,factor){return factor||(factor=16),size=Math.ceil(size/factor)*factor}var asm2wasmImports={"f64-rem":function(x,y){return x%y},debugger:function(){}},ABORT=(new Array(0),!1);function assert(condition,text){condition||abort("Assertion failed: "+text)}function getCFunc(ident){var func=Module["_"+ident];return assert(func,"Cannot call unknown function "+ident+", make sure it is exported"),func}var JSfuncs={stackSave:function(){stackSave()},stackRestore:function(){stackRestore()},arrayToC:function(arr){var array,buffer,ret=stackAlloc(arr.length);return array=arr,buffer=ret,HEAP8.set(array,buffer),ret},stringToC:function(str){var ret=0;if(null!=str&&0!==str){var len=1+(str.length<<2);(function(str,outPtr,maxBytesToWrite){(function(str,outU8Array,outIdx,maxBytesToWrite){if(!(0<maxBytesToWrite))return;for(var startIdx=outIdx,endIdx=outIdx+maxBytesToWrite-1,i=0;i<str.length;++i){var u=str.charCodeAt(i);if(55296<=u&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((1023&u)<<10)|1023&u1}if(u<=127){if(endIdx<=outIdx)break;outU8Array[outIdx++]=u}else if(u<=2047){if(endIdx<=outIdx+1)break;outU8Array[outIdx++]=192|u>>6,outU8Array[outIdx++]=128|63&u}else if(u<=65535){if(endIdx<=outIdx+2)break;outU8Array[outIdx++]=224|u>>12,outU8Array[outIdx++]=128|u>>6&63,outU8Array[outIdx++]=128|63&u}else if(u<=2097151){if(endIdx<=outIdx+3)break;outU8Array[outIdx++]=240|u>>18,outU8Array[outIdx++]=128|u>>12&63,outU8Array[outIdx++]=128|u>>6&63,outU8Array[outIdx++]=128|63&u}else if(u<=67108863){if(endIdx<=outIdx+4)break;outU8Array[outIdx++]=248|u>>24,outU8Array[outIdx++]=128|u>>18&63,outU8Array[outIdx++]=128|u>>12&63,outU8Array[outIdx++]=128|u>>6&63,outU8Array[outIdx++]=128|63&u}else{if(endIdx<=outIdx+5)break;outU8Array[outIdx++]=252|u>>30,outU8Array[outIdx++]=128|u>>24&63,outU8Array[outIdx++]=128|u>>18&63,outU8Array[outIdx++]=128|u>>12&63,outU8Array[outIdx++]=128|u>>6&63,outU8Array[outIdx++]=128|63&u}}outU8Array[outIdx]=0})(str,HEAPU8,outPtr,maxBytesToWrite)})(str,ret=stackAlloc(len),len)}return ret}},toC={string:JSfuncs.stringToC,array:JSfuncs.arrayToC};function Pointer_stringify(ptr,length){if(0===length||!ptr)return"";for(var t,hasUtf=0,i=0;hasUtf|=t=HEAPU8[ptr+i>>0],(0!=t||length)&&(i++,!length||i!=length););length||(length=i);var ret="";if(hasUtf<128){for(var curr;0<length;)curr=String.fromCharCode.apply(String,HEAPU8.subarray(ptr,ptr+Math.min(length,1024))),ret=ret?ret+curr:curr,ptr+=1024,length-=1024;return ret}return function(ptr){return UTF8ArrayToString(HEAPU8,ptr)}(ptr)}var UTF8Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function UTF8ArrayToString(u8Array,idx){for(var endPtr=idx;u8Array[endPtr];)++endPtr;if(16<endPtr-idx&&u8Array.subarray&&UTF8Decoder)return UTF8Decoder.decode(u8Array.subarray(idx,endPtr));for(var u0,u1,u2,u3,u4,str="";;){if(!(u0=u8Array[idx++]))return str;if(128&u0)if(u1=63&u8Array[idx++],192!=(224&u0))if(u2=63&u8Array[idx++],(u0=224==(240&u0)?(15&u0)<<12|u1<<6|u2:(u3=63&u8Array[idx++],240==(248&u0)?(7&u0)<<18|u1<<12|u2<<6|u3:(u4=63&u8Array[idx++],248==(252&u0)?(3&u0)<<24|u1<<18|u2<<12|u3<<6|u4:(1&u0)<<30|u1<<24|u2<<18|u3<<12|u4<<6|63&u8Array[idx++])))<65536)str+=String.fromCharCode(u0);else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|1023&ch)}else str+=String.fromCharCode((31&u0)<<6|u1);else str+=String.fromCharCode(u0)}}var buffer,HEAP8,HEAPU8,HEAP32,STATICTOP,STACKTOP,DYNAMIC_BASE,DYNAMICTOP_PTR;"undefined"!=typeof TextDecoder&&new TextDecoder("utf-16le");function updateGlobalBufferViews(){Module.HEAP8=HEAP8=new Int8Array(buffer),Module.HEAP16=new Int16Array(buffer),Module.HEAP32=HEAP32=new Int32Array(buffer),Module.HEAPU8=HEAPU8=new Uint8Array(buffer),Module.HEAPU16=new Uint16Array(buffer),Module.HEAPU32=new Uint32Array(buffer),Module.HEAPF32=new Float32Array(buffer),Module.HEAPF64=new Float64Array(buffer)}function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}STATICTOP=DYNAMICTOP_PTR=0;var TOTAL_STACK=Module.TOTAL_STACK||5242880,TOTAL_MEMORY=Module.TOTAL_MEMORY||16777216;function callRuntimeCallbacks(callbacks){for(;0<callbacks.length;){var callback=callbacks.shift();if("function"!=typeof callback){var func=callback.func;"number"==typeof func?void 0===callback.arg?Module.dynCall_v(func):Module.dynCall_vi(func,callback.arg):func(void 0===callback.arg?null:callback.arg)}else callback()}}TOTAL_MEMORY<TOTAL_STACK&&err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")"),Module.buffer?buffer=Module.buffer:(buffer="object"==typeof WebAssembly&&"function"==typeof WebAssembly.Memory?(Module.wasmMemory=new WebAssembly.Memory({initial:TOTAL_MEMORY/65536,maximum:TOTAL_MEMORY/65536}),Module.wasmMemory.buffer):new ArrayBuffer(TOTAL_MEMORY),Module.buffer=buffer),updateGlobalBufferViews();var __ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATPOSTRUN__=[],runtimeInitialized=!1;var runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null;Module.preloadedImages={},Module.preloadedAudios={};var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return String.prototype.startsWith?filename.startsWith(dataURIPrefix):0===filename.indexOf(dataURIPrefix)}!function(){var wasmTextFile="libcmark.wast",wasmBinaryFile="libcmark.wasm",asmjsCodeFile="libcmark.temp.asm.js";isDataURI(wasmTextFile)||(wasmTextFile=locateFile(wasmTextFile)),isDataURI(wasmBinaryFile)||(wasmBinaryFile=locateFile(wasmBinaryFile)),isDataURI(asmjsCodeFile)||(asmjsCodeFile=locateFile(asmjsCodeFile));var info={global:null,env:null,asm2wasm:asm2wasmImports,parent:Module},exports=null;function mergeMemory(newBuffer){var oldBuffer=Module.buffer;newBuffer.byteLength<oldBuffer.byteLength&&err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here");var buf,oldView=new Int8Array(oldBuffer);new Int8Array(newBuffer).set(oldView),buf=newBuffer,Module.buffer=buffer=buf,updateGlobalBufferViews()}function getBinary(){try{if(Module.wasmBinary)return new Uint8Array(Module.wasmBinary);if(Module.readBinary)return Module.readBinary(wasmBinaryFile);throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function doNativeWasm(global,env,providedBuffer){if("object"!=typeof WebAssembly)return err("no native wasm support detected"),!1;if(!(Module.wasmMemory instanceof WebAssembly.Memory))return err("no native wasm Memory in use"),!1;function receiveInstance(instance,module){(exports=instance.exports).memory&&mergeMemory(exports.memory),Module.asm=exports,Module.usingWasm=!0,function(id){if(runDependencies--,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),0==runDependencies&&(null!==runDependencyWatcher&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){var callback=dependenciesFulfilled;dependenciesFulfilled=null,callback()}}()}if(env.memory=Module.wasmMemory,info.global={NaN:NaN,Infinity:1/0},info["global.Math"]=Math,info.env=env,runDependencies++,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),Module.instantiateWasm)try{return Module.instantiateWasm(info,receiveInstance)}catch(e){return err("Module.instantiateWasm callback failed with error: "+e),!1}function receiveInstantiatedSource(output){receiveInstance(output.instance,output.module)}function instantiateArrayBuffer(receiver){(Module.wasmBinary||!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER||"function"!=typeof fetch?new Promise(function(resolve,reject){resolve(getBinary())}):fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response.ok)throw"failed to load wasm binary file at '"+wasmBinaryFile+"'";return response.arrayBuffer()}).catch(function(){return getBinary()})).then(function(binary){return WebAssembly.instantiate(binary,info)}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason),abort(reason)})}return Module.wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||isDataURI(wasmBinaryFile)||"function"!=typeof fetch?instantiateArrayBuffer(receiveInstantiatedSource):WebAssembly.instantiateStreaming(fetch(wasmBinaryFile,{credentials:"same-origin"}),info).then(receiveInstantiatedSource,function(reason){err("wasm streaming compile failed: "+reason),err("falling back to ArrayBuffer instantiation"),instantiateArrayBuffer(receiveInstantiatedSource)}),{}}Module.asmPreload=Module.asm;var asmjsReallocBuffer=Module.reallocBuffer;Module.reallocBuffer=function(size){return"asmjs"===finalMethod?asmjsReallocBuffer(size):function(size){var x,multiple,PAGE_MULTIPLE=Module.usingWasm?65536:16777216;0<(x=size)%(multiple=PAGE_MULTIPLE)&&(x+=multiple-x%multiple),size=x;var oldSize=Module.buffer.byteLength;if(Module.usingWasm)try{return-1!==Module.wasmMemory.grow((size-oldSize)/65536)?Module.buffer=Module.wasmMemory.buffer:null}catch(e){return null}}(size)};var finalMethod="";Module.asm=function(global,env,providedBuffer){if(!env.table){var TABLE_SIZE=Module.wasmTableSize;void 0===TABLE_SIZE&&(TABLE_SIZE=1024);var MAX_TABLE_SIZE=Module.wasmMaxTableSize;"object"==typeof WebAssembly&&"function"==typeof WebAssembly.Table?env.table=void 0!==MAX_TABLE_SIZE?new WebAssembly.Table({initial:TABLE_SIZE,maximum:MAX_TABLE_SIZE,element:"anyfunc"}):new WebAssembly.Table({initial:TABLE_SIZE,element:"anyfunc"}):env.table=new Array(TABLE_SIZE),Module.wasmTable=env.table}var exports;return env.memoryBase||(env.memoryBase=Module.STATIC_BASE),env.tableBase||(env.tableBase=0),assert(exports=doNativeWasm(0,env),"no binaryen method succeeded."),exports}}(),STATICTOP=53632,__ATINIT__.push();Module.STATIC_BASE=1024,Module.STATIC_BUMP=52608;var SYSCALLS={buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];assert(buffer),0===curr||10===curr?((1===stream?out:err)(UTF8ArrayToString(buffer,0)),buffer.length=0):buffer.push(curr)},varargs:0,get:function(varargs){return SYSCALLS.varargs+=4,HEAP32[SYSCALLS.varargs-4>>2]},getStr:function(){return Pointer_stringify(SYSCALLS.get())},get64:function(){var low=SYSCALLS.get(),high=SYSCALLS.get();return assert(0<=low?0===high:-1===high),low},getZero:function(){assert(0===SYSCALLS.get())}};DYNAMICTOP_PTR=STATICTOP+=16,DYNAMIC_BASE=alignMemory((STACKTOP=alignMemory(STATICTOP=STATICTOP+4+15&-16))+TOTAL_STACK),HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE,Module.wasmTableSize=42,Module.wasmMaxTableSize=42,Module.asmGlobalArg={},Module.asmLibraryArg={abort:abort,enlargeMemory:function(){abortOnCannotGrowMemory()},getTotalMemory:function(){return TOTAL_MEMORY},abortOnCannotGrowMemory:abortOnCannotGrowMemory,___assert_fail:function(condition,filename,line,func){abort("Assertion failed: "+Pointer_stringify(condition)+", at: "+[filename?Pointer_stringify(filename):"unknown filename",line,func?Pointer_stringify(func):"unknown function"])},___setErrNo:function(value){return Module.___errno_location&&(HEAP32[Module.___errno_location()>>2]=value),value},___syscall140:function(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(),offset_low=(SYSCALLS.get(),SYSCALLS.get()),result=SYSCALLS.get(),whence=SYSCALLS.get(),offset=offset_low;return FS.llseek(stream,offset,whence),HEAP32[result>>2]=stream.position,stream.getdents&&0===offset&&0===whence&&(stream.getdents=null),0}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}},___syscall146:function(which,varargs){SYSCALLS.varargs=varargs;try{for(var stream=SYSCALLS.get(),iov=SYSCALLS.get(),iovcnt=SYSCALLS.get(),ret=0,i=0;i<iovcnt;i++){for(var ptr=HEAP32[iov+8*i>>2],len=HEAP32[iov+(8*i+4)>>2],j=0;j<len;j++)SYSCALLS.printChar(stream,HEAPU8[ptr+j]);ret+=len}return ret}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}},___syscall6:function(which,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD();return FS.close(stream),0}catch(e){return"undefined"!=typeof FS&&e instanceof FS.ErrnoError||abort(e),-e.errno}},_abort:function(){Module.abort()},_emscripten_memcpy_big:function(dest,src,num){return HEAPU8.set(HEAPU8.subarray(src,src+num),dest),dest},DYNAMICTOP_PTR:DYNAMICTOP_PTR,STACKTOP:STACKTOP};var asm=Module.asm(Module.asmGlobalArg,Module.asmLibraryArg,buffer);Module.asm=asm;Module.___errno_location=function(){return Module.asm.___errno_location.apply(null,arguments)},Module._cmark_markdown_to_html=function(){return Module.asm._cmark_markdown_to_html.apply(null,arguments)},Module._cmark_version=function(){return Module.asm._cmark_version.apply(null,arguments)},Module._cmark_version_string=function(){return Module.asm._cmark_version_string.apply(null,arguments)};var _free=Module._free=function(){return Module.asm._free.apply(null,arguments)},stackAlloc=Module.stackAlloc=function(){return Module.asm.stackAlloc.apply(null,arguments)},stackRestore=Module.stackRestore=function(){return Module.asm.stackRestore.apply(null,arguments)},stackSave=Module.stackSave=function(){return Module.asm.stackSave.apply(null,arguments)};Module.dynCall_vi=function(){return Module.asm.dynCall_vi.apply(null,arguments)};function ExitStatus(status){this.name="ExitStatus",this.message="Program terminated with exit("+status+")",this.status=status}function run(args){function doRun(){Module.calledRun||(Module.calledRun=!0,ABORT||(runtimeInitialized||(runtimeInitialized=!0,callRuntimeCallbacks(__ATINIT__)),callRuntimeCallbacks(__ATMAIN__),Module.onRuntimeInitialized&&Module.onRuntimeInitialized(),function(){if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;)cb=Module.postRun.shift(),__ATPOSTRUN__.unshift(cb);var cb;callRuntimeCallbacks(__ATPOSTRUN__)}()))}args=args||Module.arguments,0<runDependencies||(!function(){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)cb=Module.preRun.shift(),__ATPRERUN__.unshift(cb);var cb;callRuntimeCallbacks(__ATPRERUN__)}(),0<runDependencies||Module.calledRun||(Module.setStatus?(Module.setStatus("Running..."),setTimeout(function(){setTimeout(function(){Module.setStatus("")},1),doRun()},1)):doRun()))}function abort(what){throw Module.onAbort&&Module.onAbort(what),what=void 0!==what?(out(what),err(what),JSON.stringify(what)):"",ABORT=!0,1,"abort("+what+"). Build with -s ASSERTIONS=1 for more info."}if(Module.asm=asm,Module.cwrap=function(ident,returnType,argTypes,opts){var numericArgs=(argTypes=argTypes||[]).every(function(type){return"number"===type});return"string"!==returnType&&numericArgs&&!opts?getCFunc(ident):function(){return function(ident,returnType,argTypes,args,opts){var func=getCFunc(ident),cArgs=[],stack=0;if(args)for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];cArgs[i]=converter?(0===stack&&(stack=stackSave()),converter(args[i])):args[i]}var ret=func.apply(null,cArgs);return ret=function(ret){if("string"!==returnType)return"boolean"===returnType?Boolean(ret):ret;var foo=Pointer_stringify(ret);return"cmark_markdown_to_html"===ident&&_free(ret),foo}(ret),0!==stack&&stackRestore(stack),ret}(ident,returnType,argTypes,arguments)}},Module.then=function(func){if(Module.calledRun)func(Module);else{var old=Module.onRuntimeInitialized;Module.onRuntimeInitialized=function(){old&&old(),func(Module)}}return Module},(ExitStatus.prototype=new Error).constructor=ExitStatus,dependenciesFulfilled=function runCaller(){Module.calledRun||run(),Module.calledRun||(dependenciesFulfilled=runCaller)},Module.run=run,Module.abort=abort,Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);0<Module.preInit.length;)Module.preInit.pop()();return Module.noExitRuntime=!0,run(),Module}}(); true?module.exports=Module:undefined;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4), "/"))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports) {



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(4)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "# 欢迎使用马克飞象\n\n@(示例笔记本)[马克飞象|帮助|Markdown]\n\n**马克飞象**是一款专为印象笔记（Evernote）打造的Markdown编辑器，通过精心的设计与技术实现，配合印象笔记强大的存储和同步功能，带来前所未有的书写体验。特点概述：\n\n- **功能丰富** ：支持高亮代码块、*LaTeX* 公式、流程图，本地图片以及附件上传，甚至截图粘贴，工作学习好帮手；\n- **得心应手** ：简洁高效的编辑器，提供[桌面客户端][1]以及[离线Chrome App][2]，支持移动端 Web；\n- **深度整合** ：支持选择笔记本和添加标签，支持从印象笔记跳转编辑，轻松管理。\n\n-------------------\n\n[TOC]\n\n## Markdown简介\n\n> Markdown 是一种轻量级标记语言，它允许人们使用易读易写的纯文本格式编写文档，然后转换成格式丰富的HTML页面。    —— [维基百科](https://zh.wikipedia.org/wiki/Markdown)\n\n正如您在阅读的这份文档，它使用简单的符号标识不同的标题，将某些文字标记为**粗体**或者*斜体*，创建一个[链接](http://www.example.com)或一个脚注[^demo]。下面列举了几个高级功能，更多语法请按`Cmd + /`查看帮助。\n\n### 代码块\n``` python\n@requires_authorization\ndef somefunc(param1='', param2=0):\n    '''A docstring'''\n    if param1 > param2: # interesting\n        print 'Greater'\n    return (param2 - param1 + 1) or None\nclass SomeClass:\n    pass\n>>> message = '''interpreter\n... prompt'''\n```\n### LaTeX 公式\n\n可以创建行内公式，例如 $\\Gamma(n) = (n-1)!\\quad\\forall n\\in\\mathbb N$。或者块级公式：\n\n$$\tx = \\dfrac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n\n### 表格\n| Item      |    Value | Qty  |\n| :-------- | --------:| :--: |\n| Computer  | 1600 USD |  5   |\n| Phone     |   12 USD |  12  |\n| Pipe      |    1 USD | 234  |\n\n### 流程图\n```flow\nst=>start: Start\ne=>end\nop=>operation: My Operation\ncond=>condition: Yes or No?\n\nst->op->cond\ncond(yes)->e\ncond(no)->op\n```\n\n以及时序图:\n\n```sequence\nAlice->Bob: Hello Bob, how are you?\nNote right of Bob: Bob thinks\nBob-->Alice: I am good thanks!\n```\n\n> **提示：**想了解更多，请查看**流程图**[语法][3]以及**时序图**[语法][4]。\n\n### 复选框\n\n使用 `- [ ]` 和 `- [x]` 语法可以创建复选框，实现 todo-list 等功能。例如：\n\n- [x] 已完成事项\n- [ ] 待办事项1\n- [ ] 待办事项2\n\n> **注意：**目前支持尚不完全，在印象笔记中勾选复选框是无效、不能同步的，所以必须在**马克飞象**中修改 Markdown 原文才可生效。下个版本将会全面支持。\n\n\n## 印象笔记相关\n\n### 笔记本和标签\n**马克飞象**增加了`@(笔记本)[标签A|标签B]`语法, 以选择笔记本和添加标签。 **绑定账号后**， 输入`(`自动会出现笔记本列表，请从中选择。\n\n### 笔记标题\n**马克飞象**会自动使用文档内出现的第一个标题作为笔记标题。例如本文，就是第一行的 `欢迎使用马克飞象`。\n\n### 快捷编辑\n保存在印象笔记中的笔记，右上角会有一个红色的编辑按钮，点击后会回到**马克飞象**中打开并编辑该笔记。\n>**注意：**目前用户在印象笔记中单方面做的任何修改，马克飞象是无法自动感知和更新的。所以请务必回到马克飞象编辑。\n\n### 数据同步\n**马克飞象**通过**将Markdown原文以隐藏内容保存在笔记中**的精妙设计，实现了对Markdown的存储和再次编辑。既解决了其他产品只是单向导出HTML的单薄，又规避了服务端存储Markdown带来的隐私安全问题。这样，服务端仅作为对印象笔记 API调用和数据转换之用。\n\n >**隐私声明：用户所有的笔记数据，均保存在印象笔记中。马克飞象不存储用户的任何笔记数据。**\n\n### 离线存储\n**马克飞象**使用浏览器离线存储将内容实时保存在本地，不必担心网络断掉或浏览器崩溃。为了节省空间和避免冲突，已同步至印象笔记并且不再修改的笔记将删除部分本地缓存，不过依然可以随时通过`文档管理`打开。\n\n> **注意：**虽然浏览器存储大部分时候都比较可靠，但印象笔记作为专业云存储，更值得信赖。以防万一，**请务必经常及时同步到印象笔记**。\n\n## 编辑器相关\n### 设置\n右侧系统菜单（快捷键`Cmd + M`）的`设置`中，提供了界面字体、字号、自定义CSS、vim/emacs 键盘模式等高级选项。\n\n### 快捷键\n\n帮助    `Cmd + /`\n同步文档    `Cmd + S`\n创建文档    `Cmd + Opt + N`\n最大化编辑器    `Cmd + Enter`\n预览文档 `Cmd + Opt + Enter`\n文档管理    `Cmd + O`\n系统菜单    `Cmd + M`\n\n加粗    `Cmd + B`\n插入图片    `Cmd + G`\n插入链接    `Cmd + L`\n提升标题    `Cmd + H`\n\n## 关于收费\n\n**马克飞象**为新用户提供 10 天的试用期，试用期过后需要[续费](maxiang.info/vip.html)才能继续使用。未购买或者未及时续费，将不能同步新的笔记。之前保存过的笔记依然可以编辑。\n\n\n## 反馈与建议\n- 微博：[@马克飞象](http://weibo.com/u/2788354117)，[@GGock](http://weibo.com/ggock \"开发者个人账号\")\n- 邮箱：<hustgock@gmail.com>\n\n---------\n感谢阅读这份帮助文档。请点击右上角，绑定印象笔记账号，开启全新的记录与分享体验吧。\n\n\n\n\n[^demo]: 这是一个示例脚注。请查阅 [MultiMarkdown 文档](https://github.com/fletcher/MultiMarkdown/wiki/MultiMarkdown-Syntax-Guide#footnotes) 关于脚注的说明。 **限制：** 印象笔记的笔记内容使用 [ENML][5] 格式，基于 HTML，但是不支持某些标签和属性，例如id，这就导致`脚注`和`TOC`无法正常点击。\n\n\n  [1]: http://maxiang.info/client_zh\n  [2]: https://chrome.google.com/webstore/detail/kidnkfckhbdkfgbicccmdggmpgogehop\n  [3]: http://adrai.github.io/flowchart.js/\n  [4]: http://bramp.github.io/js-sequence-diagrams/\n  [5]: https://dev.yinxiang.com/doc/articles/enml.php\n\n\n\n"

/***/ })
/******/ ]);