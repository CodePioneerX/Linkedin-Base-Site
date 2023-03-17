import React from 'react';
import { shallow, configure} from 'enzyme';
import { render, screen, waitFor } from '@testing-library/react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'; // import the adapter
import { useDispatch, useSelector } from "react-redux";
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ViewProfile from './ViewProfile';
import { EditProfileForm } from '../components/EditProfileForm';
import store from '../store';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
  }));

const mockedUsedNavigate = jest.fn();
  jest.mock('react-router-dom', () => ({
     ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
  }));

configure({ adapter: new Adapter() });

describe('LoginPage', () => {
    let wrapper;
    beforeEach(() => {
        const userInfo = { id: 1 };
        
        useSelector.mockReturnValue({ userInfo });
        wrapper = shallow(
        // <Provider store={store}>
        // <Router>
          <ViewProfile/>,{ editor: true }
    //     </Router>
    //    </Provider> 
        
        );
      });
  
    it('should render profile page', async () => {
        expect(wrapper).toMatchSnapshot();
  });

  it('should render the EditProfileForm component when Editor is true', () => {
    //wrapper.setState({ jobEditor: true });
    const profile = { name:"test name",
                      title: "test title"
};
    wrapper = shallow(<EditProfileForm profile={profile}/>,{ editor: true });
    expect(wrapper.find(EditProfileForm)).toHaveLength(0);
  });

  

  

});