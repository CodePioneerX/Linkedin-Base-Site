import React from 'react';
import { mount } from 'enzyme';
import { shallow } from 'enzyme';
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import Posts from '../components/Posts-old';
import Jobs from '../components/Jobs';

jest.mock('react-redux');

describe('Home component', () => {
  beforeEach(() => {
    useSelector.mockClear();
  });
  
  test('renders Posts and Jobs components', () => {
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });

    const wrapper = shallow(<Home />);

    expect(wrapper.find(Posts)).toHaveLength(1);
    expect(wrapper.find(Jobs)).toHaveLength(1);
  });

  test('displays message when user is not signed in', () => {
    useSelector.mockReturnValueOnce({ userInfo: null });

    const wrapper = shallow(<Home />);

    expect(wrapper.find('h5').text()).toContain('You are not signed in! Please Sign in or Register!');
  });

  test('displays create post button when user is signed in', () => {
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });

    const wrapper = shallow(<Home />);

    expect(wrapper.find('a.btn-primary').text()).toContain('Create a Post');
  });

  test('renders Posts and Jobs components', () => {
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });

    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    expect(wrapper.find(Posts)).toHaveLength(1);
    expect(wrapper.find(Jobs)).toHaveLength(1);
  });

  test('displays message when user is not signed in', () => {
    useSelector.mockReturnValueOnce({ userInfo: null });

    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    expect(wrapper.find('h5').text()).toContain('You are not signed in! Please Sign in or Register!');
  });

  test('displays create post button when user is signed in', () => {
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });

    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    expect(wrapper.find('a.btn-primary').text()).toContain('Create a Post');
  });

  test('calls useEffect when component is mounted', () => {
    const useEffect = jest.spyOn(React, 'useEffect');
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });

    mount(
      <Router>
        <Home />
      </Router>
    );

    expect(useEffect).toHaveBeenCalled();
  });

  test('updates state of Posts component after fetching data', () => {
    const data = [
      { id: 1, title: 'First Post', content: 'Lorem ipsum', author: 'wassim@test.com' },
      { id: 2, title: 'Second Post', content: 'Dolor sit amet', author: 'john@test.com' }
    ];
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' } });
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.resolve(data)
    });

    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    return Promise.resolve().then(() => {
      expect(wrapper.find(Posts).state().posts).toEqual(data);
    });
  });

  test('renders list of jobs if jobs prop is not empty', () => {
    const jobs = [
      { id: 1, title: 'Web Developer', company: 'Google' },
      { id: 2, title: 'Software Engineer', company: 'Facebook' }
    ];
    useSelector.mockReturnValueOnce({ userInfo: { username: 'wassim@test.com' }, jobs });

    const wrapper = mount(
      <Router>
        <Home />
      </Router>
    );

    expect(wrapper.find(Jobs).find('li')).toHaveLength(jobs.length);
  });
});
