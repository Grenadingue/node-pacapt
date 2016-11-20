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

function retrieveLocalPackageManager() {
  return new Promise((fulfill, reject) => {
    const retriever = spawn(__dirname + '/local_package_manager.bash', []);
    var stdout = '';

    // local_package_manager.bash should only print one line
    retriever.stdout.on('data', (data) => {
      stdout = data.toString('utf8').split('\n');
      stdout = stdout[0] ? stdout[0] : '';
    });

    retriever.on('close', (code) => {
      if (code === 0) {
        fulfill(stdout);
      } else {
        reject('Non-zero exit code: ' + code);
      }
    });

    retriever.on('error', (error) => {
      reject(error);
    });
  });
}

// retrieveLocalPackageManager().then((localPackageManager) => {
//   console.log(localPackageManager);
// }).catch((error) => {
//   console.log('error:', error);
// });

function retrieveAvailableOperations() {
  return new Promise((fulfill, reject) => {
    execPacapt(['-P']).then((output) => {
      const availableOperations = [];
      var tmp = '';

      output.text.forEach((outputObject) => {
        if (outputObject.type == 'stdout') {
          tmp += outputObject.data;
        }
      });

      tmp = tmp.split('\n');
      tmp = tmp[0] ? tmp[0] : '';
      tmp = tmp.split(':');
      tmp = tmp[2] ? tmp[2] : '';
      tmp = tmp.split(' ');

      tmp.forEach((operation) => {
        if (operation !== '') {
          availableOperations.push(operation);
        }
      });

      fulfill(availableOperations);
    })
    .catch((output) => {
      reject(output.error);
    });
  });
}

// retrieveAvailableOperations().then((operations) => {
//   console.log(operations);
// }).catch((error) => {
//   console.log('error:', error);
// });

function init() {
  return new Promise((fulfill, reject) => {
    retrieveLocalPackageManager().then((packageManager) => {
      if (packageManager !== 'pacman') {
        retrieveAvailableOperations().then((operations) => {
          console.log(packageManager, 'found,', operations);
        }).catch((error) => {
          console.log('error:', error);
        });
      } else {
        console.log('pacman found, all options available');
      }
    })
    .catch((error) => {
      reject(error);
    });
  });
}

init();

// -S install package(s)
// -Sy update database
// -Su upgrade packages (download + install packages)
// -Suy update database + upgrade packages
// -R remove package(s)

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
