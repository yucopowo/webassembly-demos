import makeCounter from './walt/counter.walt'

makeCounter().then(wasmModule => {
    console.log(wasmModule.instance.exports.increment()) // 1
console.log(wasmModule.instance.exports.increment()) // 2
console.log(wasmModule.instance.exports.decrement()) // 1
})