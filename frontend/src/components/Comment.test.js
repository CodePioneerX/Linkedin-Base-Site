import React from 'react';
import { shallow } from 'enzyme';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
} from 'mdb-react-ui-kit';
import Comment from './Comment';

describe('Comment', () => {
  const author = 'Martha';
  const content = 'This is a test comment';
  const createdAt = '2022-02-18T09:30:00.000Z';

  test('renders the author name and comment content', () => {
    const wrapper = shallow(<Comment author={author} content={content} createdAt={createdAt} />);

    expect(wrapper.find(MDBCardBody).find('p')).toHaveLength(1);
    expect(wrapper.find(MDBCardBody).find('p').text()).toEqual(content);
    expect(wrapper.find(MDBCardBody).find(MDBCardImage)).toHaveLength(1);
    expect(wrapper.find(MDBCardBody).find(MDBCardImage).prop('alt')).toEqual('avatar');
    expect(wrapper.find(MDBCardBody).find(MDBCardImage).prop('src')).toEqual(
      'https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).webp'
    );
    expect(wrapper.find(MDBCardBody).find(MDBIcon)).toHaveLength(2);
    expect(
      wrapper
        .find(MDBCardBody)
        .find(MDBIcon)
        .at(0)
        .prop('icon')
    ).toEqual('thumbs-up');
    expect(wrapper.find(MDBCardBody).find(MDBIcon).at(1).text()).toEqual('3');
    expect(wrapper.find(MDBCardBody).find('.small.mb-0.ms-2').text()).toEqual(author);
  });
});
