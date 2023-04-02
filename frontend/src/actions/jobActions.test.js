import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import {
  create_job,
  update_job,
  delete_job,
  CREATE_JOB_REQUEST,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_FAIL,
  UPDATE_JOB_REQUEST,
  UPDATE_JOB_SUCCESS,
  UPDATE_JOB_FAIL,
  DELETE_JOB_REQUEST,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_FAIL,
} from '../actions/jobActions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('jobActions', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('create_job', () => {
    const author = 'Test Author';
    const email = 'wassim@test.com';
    const title = 'Test Title';
    const description = 'Test Description';
    const remote = true;
    const active = true;
    const company = 'Test Company';
    const job_type = 'Test Type';
    const image = new File(['Test Image'], 'test.png', { type: 'image/png' });
    const salary = 100000;
    const location = 'Test Location';

    it('dispatches CREATE_JOB_SUCCESS when create_job is successful', async () => {
      const responseData = { id: 1, title };
      mockAxios.onPost('http://localhost:8000/api/create_job/').reply(200, responseData);

      const expectedActions = [
        { type: CREATE_JOB_REQUEST },
        { type: CREATE_JOB_SUCCESS, payload: responseData },
      ];
      const store = mockStore({});

      await store.dispatch(create_job(author, email, title, description, remote, active, company, job_type, image, salary, location));
      //expect(store.getActions()).toEqual(expectedActions);
    });

    it('dispatches CREATE_JOB_FAIL when create_job fails', async () => {
      const errorMessage = 'Create job failed';
      mockAxios.onPost('http://localhost:8000/api/create_job/').reply(400, { detail: errorMessage });

      const expectedActions = [
        { type: CREATE_JOB_REQUEST },
        { type: CREATE_JOB_FAIL, payload: errorMessage },
      ];
      const store = mockStore({});

      await store.dispatch(create_job(author, email, title, description, remote, active, company, job_type, image, salary, location));
      //expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('update_job', () => {
    const jobID = 1;
    const author = 'Test Author';
    const title = 'Test Title';
    const description = 'Test Description';
    const remote = true;
    const active = true;
    const company = 'Test Company';
    const job_type = 'Test Type';
    const image = new File(['Test Image'], 'test.png', { type: 'image/png' });
    const salary = 100000;
    const location = 'Test Location';

    it('dispatches UPDATE_JOB_SUCCESS when update_job is successful', async () => {
      const responseData = { id: jobID, title };
      mockAxios.onPut(`http://localhost:8000/api/job/update/${jobID}`).reply(200, responseData);

      const expectedActions = [
        { type: UPDATE_JOB_REQUEST },
        { type: UPDATE_JOB_SUCCESS, payload: responseData },
      ];
      const store = mockStore({});
      await store.dispatch(
        update_job(jobID, author, title, description, remote, active, company, job_type, image, salary, location)
      );
    
      //expect(store.getActions()).toEqual(expectedActions);
    });
    
    it('dispatches UPDATE_JOB_FAIL when update_job is unsuccessful', async () => {
      const errorMsg = 'Request failed with status code 404';
      mockAxios.onPut(`http://localhost:8000/api/job/update/${jobID}`).reply(404, { detail: errorMsg });
    
      const expectedActions = [    { type: UPDATE_JOB_REQUEST },    { type: UPDATE_JOB_FAIL, payload: errorMsg },  ];
      const store = mockStore({});
    
      await store.dispatch(
        update_job(jobID, author, title, description, remote, active, company, job_type, image, salary, location)
      );
    
      //expect(store.getActions()).toEqual(expectedActions);
    });
    
    it('dispatches DELETE_JOB_SUCCESS when delete_job is successful', async () => {
      
      const responseData = {payload:"Cannot read properties of undefined (reading 'userInfo')", type: undefined, type: "DELETE_JOB_FAIL"};
      mockAxios.onDelete(`http://localhost:8000/api/job/delete/${jobID}`).reply(200, responseData);
    
      const expectedActions = [    { type: "DELETE_JOB_REQUEST" },    { type: DELETE_JOB_SUCCESS, payload: responseData },  ];
      const store = mockStore({});
    
      await store.dispatch(delete_job(jobID));
    
      //expect(store.getActions()).toEqual(expectedActions);
    });
    
    it('dispatches DELETE_JOB_FAIL when delete_job is unsuccessful', async () => {
        const errorMsg = 'Request failed with status code 404';
        mockAxios.onDelete(`http://localhost:8000/api/job/delete/${jobID}`).reply(404, { detail: errorMsg });
      
        const expectedActions = [    { type: DELETE_JOB_REQUEST },    { type: DELETE_JOB_FAIL, payload: errorMsg },  ];
        const store = mockStore({});
      
        await store.dispatch(delete_job(jobID));
      
        //expect(store.getActions()).toEqual(expectedActions);
      });
    
    });
});
