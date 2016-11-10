#!/usr/bin/env node

const spawn = require('child_process').spawn;
const pacapt = spawn(__dirname + '/pacapt/pacapt', ['--version']);

pacapt.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

pacapt.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
});

pacapt.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
