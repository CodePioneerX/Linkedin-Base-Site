export const CREATE_JOB_REQUEST = "CREATE_JOB_REQUEST";
export const CREATE_JOB_SUCCESS = "CREATE_JOB_SUCCESS";
export const CREATE_JOB_FAIL = "CREATE_JOB_FAIL";

export const UPDATE_JOB_REQUEST = "UPDATE_JOB_REQUEST";
export const UPDATE_JOB_SUCCESS = "UPDATE_JOB_SUCCESS";
export const UPDATE_JOB_FAIL = "UPDATE_JOB_FAIL";

export const DELETE_JOB_REQUEST = "DELETE_JOB_REQUEST";
export const DELETE_JOB_SUCCESS = "DELETE_JOB_SUCCESS";
export const DELETE_JOB_FAIL = "DELETE_JOB_FAIL";

export const CREATE_JOB_ALERT_REQUEST = "CREATE_JOB_ALERT_REQUEST";
export const CREATE_JOB_ALERT_SUCCESS = "CREATE_JOB_ALERT_SUCCESS";
export const CREATE_JOB_ALERT_FAIL = "CREATE_JOB_ALERT_FAIL";

export const CREATE_JOB_APPLICATION_REQUEST = "CREATE_JOB_APPLICATION_REQUEST";
export const CREATE_JOB_APPLICATION_SUCCESS = "CREATE_JOB_APPLICATION_SUCCESS";
export const CREATE_JOB_APPLICATION_FAIL = "CREATE_JOB_APPLICATION_FAIL";

export const required_docs_template = [{'type':'Resume', 'required': false}, 
                            {'type':'Cover Letter','required': false}, 
                            {'type':'Letter of Recommendation', 'required': false}, 
                            {'type':'Portfolio', 'required': false},
                            {'type':'Transcript', 'required': false}];

export const possible_docs = ['Resume', 'Cover Letter', 'Letter of Recommendation', 'Portfolio', 'Transcript'];

export const salary_types = [{name: 'Annually', value: 'ANNUALLY'}, 
                            {name: 'Hourly', value: 'HOURLY'}, 
                            {name: 'Flat Rate', value: 'FLATRATE'}];

export const employment_terms = [{name: 'Permanent', value: 'PERMANENT'},
                                {name: 'Temporary', value: 'TEMPORARY'},
                                {name: 'Contract', value: 'CONTRACT'},
                                {name: 'Casual', value: 'CASUAL'}];

export const job_types = [{name: 'Full Time', value: 'FULLTIME'},
                        {name: 'Part Time', value: 'PARTTIME'},
                        {name: 'Internship', value: 'INTERNSHIP'},
                        {name: 'Freelance', value: 'FREELANCE'}];

export const REMOVE_JOB_APPLICATION_REVIEW_REQUEST = "REMOVE_JOB_APPLICATION_REVIEW_REQUEST";
export const REMOVE_JOB_APPLICATION_REVIEW_SUCCESS = "REMOVE_JOB_APPLICATION_REVIEW_SUCCESS";
export const REMOVE_JOB_APPLICATION_REVIEW_FAIL = "REMOVE_JOB_APPLICATION_REVIEW_FAIL";