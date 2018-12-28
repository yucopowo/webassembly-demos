import markdown from './walt/markdown.walt'

markdown().then(module => {

    const instance = module.instance;

    const buffer = instance.exports.memory.buffer;

    var bytes = new Uint8Array(buffer);


    let decoder = new TextDecoder('utf-8');

    const string = decoder.decode(bytes);
    console.log(string);


    // for(let i=0;i<i32.length;i++) {
    //
    //     const c = i32[i];
    //
    //     if(i>10 && c === 0 ) {
    //         break;
    //     }
    //
    //     console.log(c,String.fromCharCode(c));
    // }



    // const view = new DataView(buffer);
    //
    // debugger

    // const {increment, decrement, parse} = module.instance.exports;

    // console.log(increment());
    // console.log(increment());
    // console.log(decrement());
    // console.log(parse());

});

