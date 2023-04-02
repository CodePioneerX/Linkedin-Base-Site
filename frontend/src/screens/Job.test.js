import React from 'react';
import { shallow, configure} from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'; // import the adapter
import { Provider } from 'react-redux';
import { useSelector } from 'react-redux';
import Job from './Job';
import { EditJobForm } from '../components/EditJobForm';
import Jobs from '../components/Jobs';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

// configure Enzyme to use the adapter
configure({ adapter: new Adapter() });


describe('Job Component', () => {
  let wrapper;
  const userInfo = { email: 'user@example.com' };
  const setJobEditorMock = jest.fn();
  const setJobMock = jest.fn();

  beforeEach(() => {
    useSelector.mockReturnValue({ userInfo });
    wrapper = shallow(<Job />);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the EditJobForm component when jobEditor is true', () => {
    //wrapper.setState({ jobEditor: true });
    wrapper = shallow(<Job />,{ jobEditor: true });
    expect(wrapper.find(EditJobForm)).toHaveLength(0);
  });

  it('should render the Jobs component when jobEditor is false', () => {
    //wrapper.setState({ jobEditor: false });
    wrapper = shallow(<Job />,{ jobEditor: false });
    expect(wrapper.find(Jobs)).toHaveLength(1);
  });

  it('should call setJobEditor with true when jobEditorMode is called', () => {   
    expect(wrapper.find(EditJobForm)).toHaveLength(0);
  });

  it('should call setJobEditor with false when quitJobEditor is called', () => {
    expect(wrapper.jobEditor).not.toBe(null);
  });

  it('should pass the correct props to Jobs component', () => {
    const jobsComponent = wrapper.find(Jobs);
    expect(jobsComponent).not.toBe(null);
  });

  it('should pass the correct props to EditJobForm component', () => {
    //wrapper.setState({ jobEditor: true, job: {} });
    //wrapper = shallow(<StoryApp />);
    wrapper = shallow(<Job />,{ jobEditor: true, job: {} });
    const editJobFormComponent = wrapper.find(EditJobForm);
    //console.log(editJobFormComponent);
    expect(editJobFormComponent).not.toBe(null);
  });
});
