# node-pacapt
A `node.js` wrapper of [`pacapt`](https://github.com/icy/pacapt)

## Install
```
npm install git+https://github.com/Grenadingue/node-pacapt
npm install --save git+https://github.com/Grenadingue/node-pacapt
```

## Module overview
### Available methods
```js
const pacapt = require('node-pacapt');
const opts = pacapt.opts; // pacapt options

// You can use raw command line options
pacapt.exec([opts.noConfirm, opts.S, 'foo']);
pacapt.exec([opts.noConfirm, opts.Suy]);

// Or use a shortest typo
pacapt.S(['foo']); // --noconfirm -S
pacapt.Suy([]); // --noconfirm -Suy

// Or use these aliases
pacapt.install(['foo']); // --noconfirm -S
pacapt.updateDatabase(); // --noconfirm -Sy
pacapt.update(['foo']); // is an alias of `install`, you need to `updateDatabase` before using `update`
pacapt.updateAll(); // --noconfirm -Suy
pacapt.remove(['foo']); // --noconfirm -R
```

### Available options

```js
const opts = {
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp', Qs: '-Qs', Qu: '-Qu',
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii', Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  U: '-U',
  noConfirm: '--noconfirm'
};
```

- All options available here can also be used with short typo, e.g. `pacapt.S([])` (except `noConfirm`)
- `pacapt` [arguments compatibility](https://github.com/icy/pacapt#implemented-operations) for each package manager can be found in `pacapt.localInfos.availableOpts` as an array of string

### Methods usage
```js
const pacapt = require('node-pacapt');

pacapt.install(['foo'])
  .then((output) => {
    console.log('installation succeded');
    console.log(output.error);
  })
  .catch((output) => { // non zero exit code or any other failure
    console.log('installation failed');
    console.log(output.error);
  });
```

- All methods (`pacapt.exec()`, `pacapt.S()`, `pacapt.install()`) work the same way, using promises
- Both `then` and `catch` output objects are constructed the same way

### `output` structure
``` js
const output = {
  command: __dirname + '/pacapt/pacapt',
  args: ['-S', 'foo', 'bar'],
  text: [{type: 'stdout', data: 'foo'}, {type: 'stderr', data: 'bar'}], // in chronological order
  exitCode: null, // null if an error occured before pacapt execution
  error: null // null is no error thrown
};
```

## [`example.js`](/example.js) output
Example code runs:
- a first instance of a `cmake` removal, then a package database update, then re-installs `cmake`
  - which theoretically succeeds
- and also a second instance of the same remove, update db, re-install operations on `cmake`
  - which this time theoretically fails, because of the previous instance of the package manager that is already running

*Ran with Archlinux*

```
[nicolas@Nico-PC node-pacapt]$ sudo node example.js 
[sudo] password for nicolas: 
Removing cmake...
Trying to start a new pacapt instance at the same time
2 Removing cmake...
2 Error during cmake removal
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-R', 'cmake' ],
  text: 
   [ { type: 'stderr',
       data: 'error: failed to init transaction (unable to lock database)\nerror: could not lock database: File exists\n  if you\'re sure a package manager is not already\n  running, you can remove /var/lib/pacman/db.lck\n' } ],
  exitCode: 1,
  error: 'Non-zero exit code' }
Cmake removed !
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-R', 'cmake' ],
  text: 
   [ { type: 'stdout', data: 'checking dependencies...\n' },
     { type: 'stdout',
       data: ':: qtcreator optionally requires cmake: cmake project support\n' },
     { type: 'stdout',
       data: '\nPackages (1) cmake-3.6.3-1\n\nTotal Removed Size:  27.16 MiB\n\n:: Do you want to remove these packages? [Y/n] ' },
     { type: 'stdout',
       data: '\n:: Processing package changes...\nremoving cmake...\n' },
     { type: 'stdout',
       data: ':: Running post-transaction hooks...\n(1/3) Updating icon theme caches...\n' },
     { type: 'stdout',
       data: '(2/3) Updating the desktop file MIME type cache...\n' },
     { type: 'stdout',
       data: '(3/3) Updating the MIME type database...\n' } ],
  exitCode: 0,
  error: null }
Updating software database...
Software database updated!
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-Sy' ],
  text: 
   [ { type: 'stdout',
       data: ':: Synchronizing package databases...\n' },
     { type: 'stdout',
       data: ' core is up to date\ndownloading extra.db...\n' },
     { type: 'stdout', data: 'downloading community.db...\n' },
     { type: 'stdout', data: 'downloading multilib.db...\n' },
     { type: 'stdout',
       data: ' infinality-bundle is up to date\n infinality-bundle-multilib is up to date\n' } ],
  exitCode: 0,
  error: null }
Re-installing cmake...
Cmake re-installed!
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-S', 'cmake' ],
  text: 
   [ { type: 'stdout', data: 'resolving dependencies...\n' },
     { type: 'stdout',
       data: 'looking for conflicting packages...\n' },
     { type: 'stdout',
       data: '\nPackages (1) cmake-3.6.3-1\n\nTotal Installed Size:  27.16 MiB\n\n:: Proceed with installation? [Y/n] ' },
     { type: 'stdout', data: '\nchecking keyring...\n' },
     { type: 'stdout', data: 'checking package integrity...\n' },
     { type: 'stdout', data: 'loading package files...\n' },
     { type: 'stdout', data: 'checking for file conflicts...\n' },
     { type: 'stdout', data: 'checking available disk space...\n' },
     { type: 'stdout',
       data: ':: Processing package changes...\ninstalling cmake...\n' },
     { type: 'stdout',
       data: 'Optional dependencies for cmake\n    qt5-base: cmake-gui [installed]\n    libxkbcommon-x11: cmake-gui [installed]\n' },
     { type: 'stdout',
       data: ':: Running post-transaction hooks...\n(1/3) Updating icon theme caches...\n' },
     { type: 'stdout',
       data: '(2/3) Updating the desktop file MIME type cache...\n' },
     { type: 'stdout',
       data: '(3/3) Updating the MIME type database...\n' } ],
  exitCode: 0,
  error: null }
```
