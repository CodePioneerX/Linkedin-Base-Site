export const CREATE_JOB_REQUEST = "CREATE_JOB_REQUEST";
export const CREATE_JOB_SUCCESS = "CREATE_JOB_SUCCESS";
export const CREATE_JOB_FAIL = "CREATE_JOB_FAIL";

export const UPDATE_JOB_REQUEST = "UPDATE_JOB_REQUEST";
export const UPDATE_JOB_SUCCESS = "UPDATE_JOB_SUCCESS";
export const UPDATE_JOB_FAIL = "UPDATE_JOB_FAIL";

export const DELETE_JOB_REQUEST = "DELETE_JOB_REQUEST";
export const DELETE_JOB_SUCCESS = "DELETE_JOB_SUCCESS";
export const DELETE_JOB_FAIL = "DELETE_JOB_FAIL";

export const required_docs_template = [{'type':'CV', 'required': false}, 
                            {'type':'Cover Letter','required': false}, 
                            {'type':'Letter of Recommendation', 'required': false}, 
                            {'type':'Portfolio', 'required': false},
                            {'type':'Transcript', 'required': false}];

export const possible_docs = ['CV', 'Cover Letter', 'Letter of Recommendation', 'Portfolio', 'Transcript'];
