#!/usr/bin/env node

const spawn = require('child_process').spawn;

const opts = {
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp', Qs: '-Qs', Qu: '-Qu',
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii', Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  U: '-U'
};

function execPacapt(args) {
  const pacapt = spawn(__dirname + '/pacapt/pacapt', args);

  pacapt.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  pacapt.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
  });

  pacapt.on('close', (code) => {
      console.log(`pacapt exited status ${code}`);
  });
}

execPacapt([opts.S, 'git']); // fails, wait for user input
