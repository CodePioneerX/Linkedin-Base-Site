import React from 'react';
import { shallow } from 'enzyme';
//import axios from 'axios';
import * as axios from "axios";
import Job from './Job';
import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('axios');

describe('Jobs component', () => {
  test('renders list of jobs', async () => {
    const jobs = [
      { id: 1, title: 'Job 1', description: 'Job 1 Description' },
      { id: 2, title: 'Job 2', description: 'Job 2 Description' },
      { id: 3, title: 'Job 3', description: 'Job 3 Description' }
    ];

    //axios.get.mockResolvedValueOnce({ data: jobs });
    axios.get = jest.fn().mockResolvedValue({
      data: [{jobs}]
    });

    const wrapper = shallow(<Job />);
    await wrapper.instance().componentDidMount();

    const jobListItems = wrapper.find('li');
    expect(jobListItems).toHaveLength(jobs.length);
  });

  test('renders error message when jobs cannot be loaded', async () => {
    axios.get.mockRejectedValueOnce(new Error('Failed to load jobs'));

    const wrapper = shallow(<Job />);
    await wrapper.instance().componentDidMount();

    const errorMessage = wrapper.find('p.error');
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toEqual('Failed to load jobs');
  });
});
