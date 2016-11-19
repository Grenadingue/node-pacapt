const pacapt = require('./index');

console.log(`Removing cmake...`);
pacapt.remove(['cmake'])
  .then((output) => {
    console.log(`Cmake removed !`);
    console.log(output);

    console.log(`Updating software database...`);
    pacapt.updateDatabase().then((output) => {
      console.log(`Software database updated!`);
      console.log(output);

      console.log(`Re-installing cmake...`);
      pacapt.install(['cmake']).then((output) => {
        console.log(`Cmake re-installed!`);
        console.log(output);

      }).catch((error) => {
        console.log(`Error during cmake install`);
        console.log(error);
      });
    }).catch((error) => {
      console.log(`Error during package database update`);
      console.log(error);
    });
  }).catch((error) => {
    console.log(`Error during cmake removal`);
    console.log(error);
  });

  console.log(`Trying to start a new pacapt instance at the same time`);

  console.log(`2 Removing cmake...`);
  pacapt.remove(['cmake'])
    .then((output) => {
      console.log(`2 Cmake removed !`);
      console.log(output);

      console.log(`2 Updating software database...`);
      pacapt.updateDatabase().then((output) => {
        console.log(`2 Software database updated!`);
        console.log(output);

        console.log(`2 Re-installing cmake...`);
        pacapt.install(['cmake']).then((output) => {
          console.log(`2 Cmake re-installed!`);
          console.log(output);

        }).catch((error) => {
          console.log(`2 Error during cmake install`);
          console.log(error);
        });
      }).catch((error) => {
        console.log(`2 Error during package database update`);
        console.log(error);
      });
    }).catch((error) => {
      console.log(`2 Error during cmake removal`);
      console.log(error);
    });
