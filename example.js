const pacapt = require('./index');

console.log(`Removing cmake...`);
pacapt.remove(['cmake'])
  .then((output) => {
    if (output.exitCode === 0) {
      console.log(output);
      console.log(`Cmake removed !`);

      console.log(`Updating software database...`);
      pacapt.updateDatabase().then((output) => {
        if (output.exitCode === 0) {
          console.log(output);
          console.log(`Software database updated!`);

          console.log(`Re-installing cmake...`);
          pacapt.install(['cmake']).then((output) => {
            if (output.exitCode === 0) {
              console.log(output);
              console.log(`Cmake re-installed!`);
            } else {
              console.log(`Error during cmake install`);
              console.log(output);
            }

          }).catch((error) => {
            console.log(error);
          });
        } else {
          console.log(`Error during package database update`);
          console.log(output);
        }
      }).catch((error) => {
        console.log(error);
      });
    } else {
      console.log(`Error during cmake removal`);
      console.log(output);
    }
  }).catch((error) => {
    console.log(error);
  });
