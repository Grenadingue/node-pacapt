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
      if (code === 0) {
        fulfill(output);
      } else {
        output.error = 'Non-zero exit code';
        reject(output);
      }
    });

    pacapt.on('error', (error) => {
      output.error = error;
      reject(output);
    });
  });
}

const execPacaptCommands = {};
Object.keys(opts).forEach((optionKey) => {
  const option = opts[optionKey];
  if (option[1] !== '-') { // to not add --noconfirm as an executable command
    execPacaptCommands[optionKey] = function(args) {
      var optsArgs = [];
      if (optionKey[0] === 'S' || optionKey[0] === 'U' || optionKey[0] === 'R') {
        optsArgs.push(opts.noConfirm);
      }
      optsArgs.push(option);
      if (args && args.constructor === Array && args.length > 0) {
        optsArgs = optsArgs.concat(args);
      }
      return execPacapt(optsArgs);
    };
  }
});

function install(args) {
  return execPacaptCommands.S(args);
}

function updateDatabase() {
  return execPacaptCommands.Sy();
}

function update(args) {
  return install(args);
}

function updateAll() {
  return execPacaptCommands.Suy();
}

function remove(args) {
  return execPacaptCommands.R(args);
}

module.exports = execPacaptCommands;
module.exports.opts = opts;
module.exports.exec = execPacapt;
module.exports.install = install;
module.exports.updateDatabase = updateDatabase;
module.exports.update = update;
module.exports.updateAll = updateAll;
module.exports.remove = remove;
