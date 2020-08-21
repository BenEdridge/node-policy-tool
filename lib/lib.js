const policyFileGenerator = require('./policyFileGenerator');

policyFileGenerator.build('.', null, 'throw',  (result) => {
  policyFileGenerator.write(result);
});