// temporary polyfill - 2017-10-17
// https://github.com/facebookincubator/create-react-app/issues/3199
import 'raf/polyfill';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

// React 16 Enzyme Adapter
configure({ adapter: new Adapter() });

// Fail tests on any console.error message
console.error = (error) => { throw new Error(error); };

