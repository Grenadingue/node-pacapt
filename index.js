#!/usr/bin/env node

const spawn = require('child_process').spawn;

const opts = {
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp', Qs: '-Qs', Qu: '-Qu',
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii', Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  U: '-U',
  noConfirm: '--noconfirm'
};

function execPacapt(args) {
  return new Promise((fulfill, reject) => {
    const output = {
      command: __dirname + '/pacapt/pacapt',
      args: args,
      text: [],
      exitCode: null,
      error: null
    };
    const pacapt = spawn(output.command, args);

    pacapt.stdout.on('data', (data) => {
      const outputObject = { type: 'stdout', data: data.toString('utf8') };
      output.text.push(outputObject);
    });

    pacapt.stderr.on('data', (data) => {
      const outputObject = { type: 'stderr', data: data.toString('utf8') };
      output.text.push(outputObject);
    });

    pacapt.on('close', (code) => {
      output.exitCode = code;
      fulfill(output);
    });

    pacapt.on('error', (error) => {
      output.error = error;
      reject(output);
    });
  });
}

function install(inputArgs) {
  const args = [opts.noConfirm, opts.S].concat(inputArgs);
  return execPacapt(args);
}

function updateDatabase() {
  return execPacapt([opts.noConfirm, opts.Sy]);
}

function update(inputArgs) {
  return install(inputArgs);
}

function remove(inputArgs) {
  const args = [opts.noConfirm, opts.R].concat(inputArgs);
  return execPacapt(args);
}

module.exports.opts = opts;
module.exports.exec = execPacapt;
module.exports.install = install;
module.exports.updateDatabase = updateDatabase;
module.exports.update = update;
module.exports.remove = remove;
