#!/usr/bin/env node

const directory = process.cwd();
const prompt = require('prompt');
const fs = require('fs');
const read = fs.readFileSync;
const mkdirp = require('mkdirp');

let template = read(__dirname + '/template.js', 'utf8');
let filename;
let componentName;
//var styleExists = false;

let create = function(){
    prompt.start();

    
    function onErr(error){
        console.log(error);
        return 1;
    }

    function capitalizeWord(word) {
        return word[0].toUpperCase() + word.slice(1);
    }
    
    let schema = {
        properties: {
            name : {
                description: 'What is the name of the component?',
                type: 'string',
                pattern: /^[$A-Z_][0-9A-Z_$]*$/i,
                message: 'Name must start with a letter (A-Z) and cannot contain spaces',
                default: 'Component',
                required: true
            },
        }
    };

    prompt.get(schema, function (error, input) {
        if (error) { 
            return onErr(error) 
        }
        componentName = input.name;
        write(componentName);
    });

    function write(componentName){
        const componentName = capitalizeWord(componentName);

        if (fs.existsSync(componentName)) {
            console.error('Component: ' + componentName + ' already exists - abort');
            return;
        }

        template = template.replace(/{{displayName}}/g, capitalizeWord(componentName));

        fs.writeFile(componentName + '/' + componentName + '.js', template, function (err) {
            if (err) return console.log(err);
            console.log(componentName + ' > ' + componentName + '.js');
        });
    }
}

module.exports = create();
