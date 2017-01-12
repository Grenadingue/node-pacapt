const pacapt = require('./index.js');

function executeOperationIfImplemented(operation, args) {
  return new Promise((fulfill, reject) => {
    if (pacapt.localInfos.availableOperations[operation]) {
      pacapt[operation](args).then((output) => {
        fulfill(output);
      }).catch((output) => {
        reject(output);
      });
    } else {
      fulfill('Operation \'' + operation + '\' not implemented');
    }
  });
}

function updateDatabaseIfImplemented() {
  return executeOperationIfImplemented('Sy', []);
}

pacapt.init().then(() => {
  console.log('Local infos:');
  console.log(pacapt.localInfos);

  console.log('Installing vlc...');
  pacapt.install(['vlc']).then((output) => {
    console.log('vlc installed!');
    console.log(output);

    console.log('Removing vlc...');
    pacapt.remove(['vlc'])
      .then((output) => {
        console.log('vlc removed !');
        console.log(output);

        console.log('Updating software database...');
        updateDatabaseIfImplemented().then((output) => {
          console.log('Software database updated (or ignored)!');
          console.log(output);

          console.log('Re-installing vlc...');
          pacapt.install(['vlc']).then((output) => {
            console.log('vlc re-installed!');
            console.log(output);

          }).catch((error) => {
            console.log('Error during vlc install');
            console.log(error);
          });
        }).catch((error) => {
          console.log('Error during package database update');
          console.log(error);
        });
      }).catch((error) => {
        console.log('Error during vlc removal');
        console.log(error);
      });
  }).catch((error) => {
    console.log('Error during vlc install');
    console.log(error);
  });
}).catch(() => {
  console.log('Error during pacapt initialization');
});
