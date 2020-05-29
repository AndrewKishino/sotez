const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file'); // eslint-disable-line

const options = {
  files: 'dist/types/index.d.ts',
  from: "'ledger'",
  to: "'./ledger'",
};

const patch = async () => {
  try {
    fs.unlinkSync(path.join(__dirname, 'dist', 'types', 'ledger-web.d.ts'));
  } catch (err) {
    console.error(err);
  }

  try {
    await replace(options);
  } catch (err) {
    console.error(err);
  }

  console.log('Successfully patched build files');
};

patch();
