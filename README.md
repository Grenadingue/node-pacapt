# node-pacapt
A `node.js` wrapper of [`pacapt`](https://github.com/icy/pacapt) plus [`batch-pacapt`](https://github.com/Grenadingue/batch-pacapt)

## Install
```
npm install --save https://github.com/Grenadingue/node-pacapt
```
*Note: For now, you need to execute this command inside a git repository, or it will fail saying that an error occured during `npm install` while trying to `git submodule update --init`*

## Module overview
### Operations and options

```js
const operations = {
  Q: '-Q', Qc: '-Qc', Qi: '-Qi', Ql: '-Ql', Qm: '-Qm', Qo: '-Qo', Qp: '-Qp',
  Qs: '-Qs', Qu: '-Qu',
  R: '-R', Rn: '-Rn', Rns: '-Rns', Rs: '-Rs',
  S: '-S', Sc: '-Sc', Scc: '-Scc', Sccc: '-Sccc', Si: '-Si', Sii: '-Sii',
  Sl: '-Sl', Ss: '-Ss', Su: '-Su', Suy: '-Suy', Sw: '-Sw', Sy: '-Sy',
  U: '-U',
};

const options = {
  noConfirm: '--noconfirm'
};
```

### Available methods
```js
const pacapt = require('node-pacapt');
const operations = pacapt.operations; // pacapt executable operations
const options = pacapt.options; // pacapt operations options

// You can execute raw command line options
pacapt.exec([options.noConfirm, operations.S, 'foo']);
pacapt.exec([options.noConfirm, operations.Suy]);

// You can directly execute operations from `pacapt` object
pacapt.S(['foo']); // --noconfirm -S
pacapt.Suy([]); // --noconfirm -Suy
// All arguments starting with -S -U -R are automaticaly precedeed by --noconfirm

// Or you can use these aliases
pacapt.install(['foo']); // pacapt.S()
pacapt.updateDatabase(); // pacapt.Sy()
pacapt.update(['foo']); // is an alias of `install`, you need to `updateDatabase()` before using `update()`
pacapt.updateAll(); // pacapt.Suy()
pacapt.remove(['foo']); // pacapt.R()

// Local informations retrieving, not mandatory, see next section for more information
pacapt.init();
```

### Methods usage
```js
const pacapt = require('node-pacapt');

// Local informations retrieving
// If you need to retrieve the name of the local package manager
// If you need to check if an operation is implemented on the current operating system
pacapt.init().then(() => {
  console.log('Local infos:');
  console.log(pacapt.localInfos);
}).catch((error) => {
  console.log(error);
});

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

- All methods styles (`pacapt.exec()`, `pacapt.S()`, `pacapt.install()`) work the same way, using promises
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
*Ran with Archlinux*

```
[nicolas@Nico-PC node-pacapt]$ sudo node example.js 
[sudo] password for nicolas: 
Local infos:
{ packageManager: 'pacman',
  availableOperations: 
   { Q: '-Q',
     Qc: '-Qc',
     Qi: '-Qi',
     Ql: '-Ql',
     Qm: '-Qm',
     Qo: '-Qo',
     Qp: '-Qp',
     Qs: '-Qs',
     Qu: '-Qu',
     R: '-R',
     Rn: '-Rn',
     Rns: '-Rns',
     Rs: '-Rs',
     S: '-S',
     Sc: '-Sc',
     Scc: '-Scc',
     Sccc: '-Sccc',
     Si: '-Si',
     Sii: '-Sii',
     Sl: '-Sl',
     Ss: '-Ss',
     Su: '-Su',
     Suy: '-Suy',
     Sw: '-Sw',
     Sy: '-Sy',
     U: '-U' } }
Installing vlc...
vlc installed!
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-S', 'vlc' ],
  text: 
   [ { type: 'stderr',
       data: 'warning: vlc-2.2.4-6 is up to date -- reinstalling\n' },
     { type: 'stdout', data: 'resolving dependencies...\n' },
     { type: 'stdout',
       data: 'looking for conflicting packages...\n' },
     { type: 'stdout',
       data: '\nPackages (1) vlc-2.2.4-6\n\nTotal Installed Size:  54.36 MiB\nNet Upgrade Size:       0.00 MiB\n\n:: Proceed with installation? [Y/n] \nchecking keyring...\n' },
     { type: 'stdout', data: 'checking package integrity...\n' },
     { type: 'stdout', data: 'loading package files...\n' },
     { type: 'stdout', data: 'checking for file conflicts...\n' },
     { type: 'stdout', data: 'checking available disk space...\n' },
     { type: 'stdout',
       data: ':: Processing package changes...\nreinstalling vlc...\n' },
     { type: 'stdout',
       data: ':: Running post-transaction hooks...\n(1/3) Updating icon theme caches...\n' },
     { type: 'stdout',
       data: '(2/3) Updating the desktop file MIME type cache...\n' },
     { type: 'stdout',
       data: '(3/3) Updating the vlc plugin cache...\n' } ],
  exitCode: 0,
  error: null }
Removing vlc...
vlc removed !
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-R', 'vlc' ],
  text: 
   [ { type: 'stdout', data: 'checking dependencies...\n' },
     { type: 'stdout',
       data: '\nPackages (1) vlc-2.2.4-6\n\nTotal Removed Size:  54.36 MiB\n\n:: Do you want to remove these packages? [Y/n] ' },
     { type: 'stdout',
       data: '\n:: Processing package changes...\nremoving vlc...\n' },
     { type: 'stdout',
       data: ':: Running post-transaction hooks...\n(1/2) Updating icon theme caches...\n' },
     { type: 'stdout',
       data: '(2/2) Updating the desktop file MIME type cache...\n' } ],
  exitCode: 0,
  error: null }
Updating software database...
Software database updated (or ignored)!
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-Sy' ],
  text: 
   [ { type: 'stdout',
       data: ':: Synchronizing package databases...\n' },
     { type: 'stdout',
       data: ' core is up to date\n extra is up to date\n community is up to date\n multilib is up to date\n' } ],
  exitCode: 0,
  error: null }
Re-installing vlc...
vlc re-installed!
{ command: '/run/media/nicolas/TAF/perso/node-pacapt/pacapt/pacapt',
  args: [ '--noconfirm', '-S', 'vlc' ],
  text: 
   [ { type: 'stdout', data: 'resolving dependencies...\n' },
     { type: 'stdout',
       data: 'looking for conflicting packages...\n' },
     { type: 'stdout',
       data: '\nPackages (1) vlc-2.2.4-6\n\nTotal Installed Size:  54.36 MiB\n\n:: Proceed with installation? [Y/n] \nchecking keyring...\n' },
     { type: 'stdout', data: 'checking package integrity...\n' },
     { type: 'stdout', data: 'loading package files...\n' },
     { type: 'stdout', data: 'checking for file conflicts...\n' },
     { type: 'stdout', data: 'checking available disk space...\n' },
     { type: 'stdout',
       data: ':: Processing package changes...\ninstalling vlc...\n' },
     { type: 'stdout',
       data: 'Optional dependencies for vlc\n    avahi: for service discovery using bonjour protocol [installed]\n    libnotify: for notification plugin [installed]\n    gtk2: for notify plugin [installed]\n    ncurses: for ncurses interface support [installed]\n    libdvdcss: for decoding encrypted DVDs\n    lirc: for lirc plugin\n    libavc1394: for devices using the 1394ta AV/C [installed]\n    libdc1394: for IEEE 1394 plugin [installed]\n    kdelibs: KDE Solid hardware integration\n    libva-vdpau-driver: vdpau back-end for nvidia\n    libva-intel-driver: back-end for intel cards [installed]\n    libbluray: for Blu-Ray support [installed]\n    flac: for Free Lossless Audio Codec plugin [installed]\n    portaudio: for portaudio support [installed]\n    twolame: for TwoLAME mpeg2 encoder plugin\n    projectm: for ProjectM visualisation plugin\n    libcaca: for colored ASCII art video output [installed]\n    libgme: for libgme plugin [installed]\n    librsvg: for SVG plugin [installed]\n    gnome-vfs: for GNOME Virtual File System support [installed]\n    libgoom2: for libgoom plugin\n    vcdimager: navigate VCD with libvcdinfo\n    aalib: for ASCII art plugin [installed]\n    libmtp: for MTP devices support [installed]\n    smbclient: for SMB access plugin [installed]\n    libcdio: for audio CD playback support [installed]\n    ttf-freefont: for subtitle font \n    ttf-dejavu: for subtitle font [installed]\n    opus: for opus support [installed]\n    libssh2: for sftp support [installed]\n    lua-socket: for http interface [installed]\n    qt4: for the GUI [installed]\n' },
     { type: 'stdout',
       data: ':: Running post-transaction hooks...\n(1/3) Updating icon theme caches...\n' },
     { type: 'stdout',
       data: '(2/3) Updating the desktop file MIME type cache...\n' },
     { type: 'stdout',
       data: '(3/3) Updating the vlc plugin cache...\n' } ],
  exitCode: 0,
  error: null }
```
