import chai from 'chai';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);

const testsContext = require.context(".", true, /Test$/);
testsContext.keys().forEach(testsContext);
