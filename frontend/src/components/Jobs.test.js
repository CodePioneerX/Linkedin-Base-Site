import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import Jobs from './Jobs';
import Comment from './Comment';

jest.mock('axios');

describe('Jobs component', () => {
  let wrapper;

  const mockJobs = [
    {
      id: 1,
      title: 'Job 1',
      company: 'Company 1',
      content: 'Content 1',
      image: 'images/image1.jpg',
      author: 'Author 1',
      likes: 1,
      created_at: '2022-01-01',
      salary: 100,
      location: 'Location 1',
      category: 'Category 1',
      comments: [
        {
          id: 1,
          author: 'Comment Author 1',
          content: 'Comment 1',
          created_at: '2022-01-01',
        },
      ],
    },
    {
      id: 2,
      title: 'Job 2',
      company: 'Company 2',
      content: 'Content 2',
      image: 'images/image2.jpg',
      author: 'Author 2',
      likes: 2,
      created_at: '2022-02-02',
      salary: 200,
      location: 'Location 2',
      category: 'Category 2',
      comments: [
        {
          id: 2,
          author: 'Comment Author 2',
          content: 'Comment 2',
          created_at: '2022-02-02',
        },
        {
          id: 3,
          author: 'Comment Author 3',
          content: 'Comment 3',
          created_at: '2022-02-03',
        },
      ],
    },
  ];

  beforeEach(() => {
    axios.get.mockImplementation(() => Promise.resolve({ data: mockJobs }));
    wrapper = shallow(<Jobs />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches jobs on mount', () => {
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/api/jobs/');
  });

  it('renders a list of jobs', () => {
    const jobs = wrapper.find('.padd');
    expect(jobs).toHaveLength(mockJobs.length);
    expect(jobs.at(0).find('h3').text()).toEqual('Job 1 @ Company 1');
    expect(jobs.at(1).find('h3').text()).toEqual('Job 2 @ Company 2');
  });

  it('renders a comment for each job that has comments', () => {
    const jobWithComments = mockJobs[1];
    const comments = wrapper
      .find('.padd')
      .at(1)
      .find(Comment);
    expect(comments).toHaveLength(jobWithComments.comments.length);
    expect(comments.at(0).prop('author')).toEqual('wassim@test.com');
    expect(comments.at(0).prop('content')).toEqual('Comment 2');
    expect(comments.at(0).prop('createdAt')).toEqual('2022-02-02');
    expect(comments.at(1).prop('author')).toEqual('Comment Author 3');
    expect(comments.at(1).prop('content')).toEqual('Comment 3');
    expect(comments.at(1).prop('createdAt')).toEqual('2022-02-03');
  });
});
