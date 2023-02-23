import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
import Posts from './Posts';

Enzyme.configure({ adapter: new Adapter() });

describe('Posts component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Posts />);
  });

  it('should render the Activities header', () => {
    expect(wrapper.find('h1').text()).toEqual('Activities');
  });

  it('should fetch posts from the API', () => {
    const instance = wrapper.instance();
    jest.spyOn(instance, 'componentDidMount');

    wrapper.instance().componentDidMount();

    expect(instance.componentDidMount).toHaveBeenCalled();
  });

  it('should render the post details', () => {
    const posts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'Post 1 content',
        author: 'Author 1',
        likes: 10,
        created_at: '2022-02-18T10:00:00Z',
        image: '/images/post1.jpg',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'Post 2 content',
        author: 'Author 2',
        likes: 5,
        created_at: '2022-02-19T11:00:00Z',
        image: '/images/post2.jpg',
      },
    ];

    wrapper.setState({ posts });

    posts.forEach(post => {
      expect(wrapper.contains(post.title)).toEqual(true);
      expect(wrapper.contains(post.content)).toEqual(true);
      expect(wrapper.contains(post.author)).toEqual(true);
      expect(wrapper.contains(post.likes)).toEqual(true);
      expect(wrapper.contains(post.created_at)).toEqual(true);
      expect(wrapper.containsMatchingElement(<img src={'http://localhost:8000'+post.image} alt={post.title} />)).toEqual(true);
    });
  });
});
