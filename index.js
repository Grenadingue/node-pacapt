#!/usr/bin/env node

const spawn = require('child_process').spawn;
const os = require('os');

const localInfos = {
  packageManager: undefined,
  availableOperations: undefined,
};

const operations = {
  // -Q*
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp',
  Qs: '-Qs', Qu: '-Qu',
  // -R*
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  // -S*
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii',
  Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  // -U*
  U: '-U',
};

const options = {
  noConfirm: '--noconfirm'
};

const pacaptPath = os.type() == 'Windows_NT' ?
  __dirname + '\\batch-pacapt\\pacapt.cmd' : __dirname + '/pacapt/pacapt';

function execPacapt(args) {
  return new Promise((fulfill, reject) => {
    const output = {
      command: pacaptPath,
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
Object.keys(operations).forEach((operationKey) => {
  const operation = operations[operationKey];
  execPacaptCommands[operationKey] = function(inputArgs) {
    var args = [];
    if (operationKey[0] === 'S' || operationKey[0] === 'U' || operationKey[0] === 'R') {
      args.push(options.noConfirm);
    }
    args.push(operation);
    if (inputArgs && inputArgs.constructor === Array && inputArgs.length > 0) {
      args = args.concat(inputArgs);
    }
    return execPacapt(args);
  };
});

function retrieveLocalPackageManager() {
  return new Promise((fulfill, reject) => {
    if (os.type() == 'Windows_NT') {
      fulfill('chocolatey');
    }

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

function retrieveAvailableOperations(packageManager) {
  return new Promise((fulfill, reject) => {
    if (packageManager === 'pacman') {
      fulfill(operations);
    }

    execPacapt(['-P']).then((output) => {
      const availableOperations = {};
      var tmp = '';

      output.text.forEach((outputObject) => {
        if (outputObject.type == 'stdout') {
          tmp += outputObject.data;
        }
      });

      tmp = tmp.split(os.EOL);
      tmp = tmp[0] ? tmp[0] : '';
      tmp = tmp.split(':');
      tmp = tmp[2] ? tmp[2] : '';
      tmp = tmp.split(' ');

      tmp.forEach((operation) => {
        if (operation !== '') {
          availableOperations[operation] = `-${operation}`;
        }
      });

      fulfill(availableOperations);
    })
    .catch((output) => {
      reject(output.error);
    });
  });
}

function init() {
  return new Promise((fulfill, reject) => {
    retrieveLocalPackageManager().then((packageManager) => {
      localInfos.packageManager = packageManager;
      retrieveAvailableOperations(packageManager).then((availableOperations) => {
        localInfos.availableOperations = availableOperations;
        fulfill();
      }).catch((error) => {
        reject(error);
      });
    })
    .catch((error) => {
      reject(error);
    });
  });
}

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
module.exports.localInfos = localInfos;
module.exports.operations = operations;
module.exports.options = options;
module.exports.init = init;
module.exports.exec = execPacapt;
module.exports.install = install;
module.exports.updateDatabase = updateDatabase;
module.exports.update = update;
module.exports.updateAll = updateAll;
module.exports.remove = remove;
