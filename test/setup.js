import "babel-polyfill";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiEnzyme from 'chai-enzyme';

Enzyme.configure({ adapter: new Adapter() });
chai.use(chaiEnzyme());
chai.use(sinonChai);

const testsContext = require.context(".", true, /Test$/);
testsContext.keys().forEach(testsContext);
