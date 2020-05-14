import chalk from 'chalk';
import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';

const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFiles(options) {
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}
async function readWriteAdd(dir, string) {
    let data = fs.readFileSync(dir, 'utf-8');

    let newValue = data + string;

    await fs.writeFileSync(dir, newValue, 'utf-8', function (err) {
        if (err){
            console.error(`%s error when write to ${dir}`, chalk.red.bold('ERROR'));
            process.exit(1);
        }
    });
}
async function readWriteCopy(dir, dir2) {
    let data = await fs.readFileSync(dir, 'utf-8');
    await fs.appendFile(dir2, data, 'utf-8', function (err) {
        if (err){
            console.error(`%s error when write to ${dir2}`, chalk.red.bold('ERROR'));
            process.exit(1);
        }
    });
}
export async function createComponent(options) {
    const templateDir = path.join(process.cwd(), '/app/templates/components/component');
    const destinationDir = path.join(process.cwd(), '/app/components');
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error(`%s Invalid templateDir ! Please goto CORE dir and try again !`, chalk.red.bold('ERROR'));
        process.exit(1);
    }
    const destinationNameDir = path.join(destinationDir, `/${options.type3}`);

    try {
        await access(destinationDir, fs.constants.R_OK);
    } catch (err) {
        console.error(`%s Invalid destinationDir ! Please goto CORE dir and try again !`, chalk.red.bold('ERROR'));
        process.exit(1);
    }

    if (!fs.existsSync(destinationNameDir)) {
        await fs.mkdirSync(destinationNameDir);
    } else {
        console.error(`%s component ${options.type3} is exist`, chalk.red.bold('ERROR'));
        process.exit(1);
    }
    console.log('Copy templates files ...');
    const templateDirComponent = path.join(templateDir, '/index.tsx');
    const destinationDirComponent = path.join(destinationDir, `/${options.type3}/${options.type3}.tsx`);
    await readWriteCopy(templateDirComponent, destinationDirComponent);

    const templateDirComponentProps = path.join(templateDir, '/index.props.ts');
    const destinationDirComponentProps = path.join(destinationDir, `/${options.type3}/${options.type3}.props.ts`);
    await readWriteCopy(templateDirComponentProps, destinationDirComponentProps);

    const indexScreenDir = path.join(process.cwd(), '/app/components/index.ts');
    const stringAddToIndex = `export * from './${options.type3}/${options.type3}';`
    await readWriteAdd(indexScreenDir,stringAddToIndex);

    console.log(`%s component ${options.type3} ready`, chalk.green.bold('DONE'));
}
export async function createScreen(options) {
    const templateDir = path.join(process.cwd(), '/app/templates/screens/screen');
    const destinationDir = path.join(process.cwd(), '/app/screens');
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error(`%s Invalid templateDir ! Please goto CORE dir and try again !`, chalk.red.bold('ERROR'));
        process.exit(1);
    }
    const destinationNameDir = path.join(destinationDir, `/${options.type3}`);

    try {
        await access(destinationDir, fs.constants.R_OK);
    } catch (err) {
        console.error(`%s Invalid destinationDir ! Please goto CORE dir and try again !`, chalk.red.bold('ERROR'));
        process.exit(1);
    }

    if (!fs.existsSync(destinationNameDir)) {
        await fs.mkdirSync(destinationNameDir);
    } else {
        console.error(`%s screen ${options.type3} is exist`, chalk.red.bold('ERROR'));
        process.exit(1);
    }
    console.log('Copy templates files ...');
    await copyTemplateFiles({
        templateDirectory: templateDir,
        targetDirectory: destinationNameDir
    });
    let indexScreenDir = path.join(process.cwd(), '/app/screens/index.ts');
    let stringAddToIndex = `export * from './${options.type3}';`
    await readWriteAdd(indexScreenDir,stringAddToIndex);
    console.log(`%s screen ${options.type3} ready`, chalk.green.bold('DONE'));
}
