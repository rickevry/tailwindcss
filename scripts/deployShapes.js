import { join } from 'path';
import * as fs from 'fs';
import css from 'css';

import { PMService } from './pmService.js'

// let pmService = require('./pmService');

const isDirectory = source => fs.lstatSync(source).isDirectory()
const isFile = source => !fs.lstatSync(source).isDirectory()

const getDirectories = source => fs.readdirSync(source).map(name => join(source, name)).filter(isDirectory)
const getFiles = source => fs.readdirSync(source).map(name => join(source, name)).filter(isFile)

function handleFile(fileName) {
    let cssText = fs.readFileSync("./" + fileName, 'utf8');

    // console.log(css);
    var obj = css.parse(cssText);

    // console.log(obj);

    let rules = obj.stylesheet.rules.map( rule => ({
        title: rule.selectors ? rule.selectors[0].substring(1) : "ERROR",
        props: rule.declarations ? Object.fromEntries(rule.declarations.map(decl => [decl.property, decl.value])) : {}
    }));

    // console.log(JSON.stringify(rules, null, 4));

    let re = /pm_(.+?)\.css/ ; 
    let match = re.exec(fileName);

    return ({
        title: match[1],
        rules: rules 
    });
}

let pmFiles = (fileName) => (fileName.indexOf("pm_") != -1) 
    && (fileName.indexOf("pm_preflight.css")==-1) 
    && (fileName.indexOf("pm_animation.css")==-1) ;

let modules = getFiles("./dist/.").filter(pmFiles).map(handleFile);
// fs.writeFileSync("./modules.js", JSON.stringify(modules, null, 4));

let settings = {
    tenantGuid: "a6971984-d6eb-49cf-b1aa-9d135252b7c8",
    instancePage: "2cfb6067-8e53-8cd0-1a05-3bd56808dd16",
    templatePageGuid: "bb7224e9-6a1c-6105-7295-eb74d8822c9e",
    userStepsTemplatePageGuid: "xxx",
    newUserStepsPageGuid: "xxx"
} 

const host = 'http://anytest3.azurewebsites.net/';

let main = async () => {
    await PMService.init(host);
    await PMService.createModules(modules, settings);
}

main().then(console.log);




