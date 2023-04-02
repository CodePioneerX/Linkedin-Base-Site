import React from 'react';
import { shallow, configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'; // import the adapter
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

import MyNetwork from './MyNetwork';
import Newsfeed from '../components/Newsfeed';

// configure Enzyme to use the adapter
configure({ adapter: new Adapter() });

describe('MyNetwork component', () => {
  it('should render the component without errors', () => {
    const wrapper = shallow(<MyNetwork />);
    expect(wrapper.exists()).toBe(true);
  });

  it('should render the create post button when user is logged in', () => {
    localStorage.setItem('userInfo', 'mockUserInfo');
    const wrapper = shallow(<MyNetwork />);
    const createPostLink = wrapper.find(Link);
    expect(createPostLink.prop('to')).toBe('/create/post/');
    expect(createPostLink.prop('state')).toEqual({ from: '/network' });
  });

  it('should render the login/register alert when user is not logged in', () => {
    localStorage.removeItem('userInfo');
    const wrapper = shallow(<MyNetwork />);
    const alert = wrapper.find(Alert);
    expect(alert).toHaveLength(1);
    expect(alert.prop('variant')).toBe('primary');
    expect(alert.find('a')).toHaveLength(2);
  });

  it('should render the newsfeed component', () => {
    const wrapper = shallow(<MyNetwork />);
    expect(wrapper.find(Newsfeed)).toHaveLength(0);
  });
});
