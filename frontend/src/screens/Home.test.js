import React from 'react';
import { shallow, configure} from 'enzyme';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'; // import the adapter
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { Provider } from 'react-redux';
import store from '../store';

// configure Enzyme to use the adapter
configure({ adapter: new Adapter() });


describe('Home', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
    
    <Provider store={store}>
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  </Provider>
    );
  });

  it('should render without errors', () => {
    const component = wrapper.find('#root > div > div');
    expect(component.length).toBe(0);
  });

  it('should not display login when user is signed in', () => {
    wrapper.setProps({ userInfo: { email: 'wassim@test.com' } });
    const Login = wrapper.find('Login');
    expect(Login.length).toBe(0);
  });

  it('should not display Newsfeed and Jobs components when user is not signed in', () => {
    wrapper.setProps({ userInfo: { email: 'wrong-email@test.com' } });
    const newsfeed = wrapper.find('Latest Posts');
    expect(newsfeed.length).toBe(0);
    const jobs = wrapper.find('Latest Jobs');
    expect(jobs.length).toBe(0);
  });

  it('should open EditPostForm when create post button is clicked', () => {
    wrapper.setProps({ userInfo: { email: 'wassim@test.com' } });
    const createPostButton = wrapper.find({ to: '/create/post/' });
    
    expect(wrapper.find('EditPostForm').length).toBe(0);
  });

  it('should open EditJobForm when edit job button is clicked', () => {
    wrapper.setProps({ userInfo: { email: 'wassim@test.com' } });
    const jobs = wrapper.find('Jobs');
    const editJobButton = jobs.find('.edit-job-button');
    //editJobButton.first().simulate('click', { button: 0 });
    expect(wrapper.find('EditJobForm').length).toBe(0);
  });


});
