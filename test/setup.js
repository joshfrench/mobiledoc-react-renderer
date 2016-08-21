import "babel-polyfill";
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());
chai.use(sinonChai);

const testsContext = require.context(".", true, /Test$/);
testsContext.keys().forEach(testsContext);
