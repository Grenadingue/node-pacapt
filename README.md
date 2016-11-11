# node-pacapt
A node.js wrapper of [pacapt](https://github.com/icy/pacapt)

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

// You can use raw options
pacapt.exec([opts.noConfirm, opts.S, 'foo']);

// Or use these aliases
pacapt.install(['foo']); // --noconfirm -S
pacapt.updateDatabase(); // --noconfirm -Sy
pacapt.update(['foo']); // is an alias of `install`, you need to `updateDatabase` before using `update`
pacapt.updateAll(); // --noconfirm -Suy
pacapt.remove(['foo']); // --noconfirm -R
```

### Available options

*Note: `pacapt` [arguments compatibility](https://github.com/icy/pacapt#implemented-operations) for each package manager is not checked by node*

```js
const opts = {
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp', Qs: '-Qs', Qu: '-Qu',
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii', Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  U: '-U',
  noConfirm: '--noconfirm'
};
```

### Methods usage
```js
const pacapt = require('node-pacapt');
const opts = pacapt.opts;

pacapt.install(['foo'])
  .then((output) => {
    if (output.exitCode === 0) {
      console.log('install succeded');
    } else {
      console.log(`error code: ${output.exitStatus}`);
    }
  })
  .catch((output) => {
    console.log(output.error);
  });
```

- All methods (`exec()`, `install()`) work the same way, using promises
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
Example code runs a `cmake` removal, then a package database update, then re-installs `cmake`

*Ran with Archlinux*

```
[nicolas@Nico-PC node-pacapt]$ sudo node example.js 
[sudo] password for nicolas: 
Removing cmake...
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
Cmake removed !
Updating software database...
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-Sy' ],
  text: 
   [ { type: 'stdout',
       data: ':: Synchronizing package databases...\n' },
     { type: 'stdout',
       data: ' core is up to date\n extra is up to date\n community is up to date\n multilib is up to date\n infinality-bundle is up to date\n infinality-bundle-multilib is up to date\n' } ],
  exitCode: 0,
  error: null }
Software database updated!
Re-installing cmake...
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
Cmake re-installed!
```
