// Instead of bash: "sha384-$(cat checked.js | openssl dgst -sha384 -binary | base64)"

const fs = require('fs');
const crypto = require('crypto');

const HASH_TYPES = ['sha512', 'sha384', 'sha256'];

const build = function(dir = '.', file_types = '*', onerror = 'throw', cb) {

  let policyObj = {
      onerror: onerror,
      resources: {}
  };

  fs.readdir(dir, { withFileTypes: true, encoding: 'utf8'}, (err, items) => {
    if(err){
      throw Error('Failure to build policy file', err);
    } else {
      items
      .filter((item) => {
        return item.isFile();
        // return item.endsWith('.js');
      })
      .map((file) => {

        const fileName = file.name;
        console.log(`Processing: ${fileName}`)

        const integrity = {
          integrity: generateHashFromFile('sha512', fileName)
        };

        policyObj.resources[`./${fileName}`] = integrity;
        console.log(`${fileName}: ${generateHashFromFile('sha512', fileName)}`);
        console.log('');
      });

      cb(policyObj);
    }
  });
}

const write = function(policyObj){
  console.log('Writing Policy File...');
  fs.writeFileSync('./policy.json', JSON.stringify(policyObj, null, 2));
  console.log('Policy Hash', generateHashFromFile('sha512', './policy.json'));
};

const generateHashFromFile = function(type, file) {
  if(HASH_TYPES.includes(type)) {
    const buffer = Buffer.from(fs.readFileSync(file));
    const hash = crypto.createHash(type, 'base64').update(buffer).digest('base64');
    return `${type}-${hash}`;
  } else {
    throw Error('Unsupported Hash Type please choose from: ', HASH_TYPES);
  }
};

module.exports = {
  build,
  write,
};