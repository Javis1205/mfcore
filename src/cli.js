import arg from 'arg';
import {createScreen, createComponent} from './main';

function parseArgsIntoOptions(rawArgs) {
    const args = arg(
        {
            '--stateful-component': Boolean,
            '--stateless-function': Boolean,
            '--sfc':'--stateful-component',
            '--slf':'--stateless-function'
        },
        {
            argv: rawArgs.slice(2),
        }
    );
    return{
        type: args._[0],
        type2: args._[1],
        type3: args._[2],
        statefulComponent: args['--stateful-component'] || false,
        statelessFunction: args['--stateless-function'] || false
    }
}
function ProgressInit(options) {
    console.log('Init', options);

}
function ProgressGenerate(options) {
    const type = options.type2;
    switch (type) {
        case 'create-screen':
            createScreen(options)
            break;
        case 'create-component':
            createComponent(options)
            break;
    }
}
export function cli(args) {
    let options = parseArgsIntoOptions(args);
    const type = options.type;
    switch (type) {
        case 'init':
            ProgressInit(options);
            break;
        case 'generate':
            ProgressGenerate(options);
            break;
        default:
            break;
    }
}
