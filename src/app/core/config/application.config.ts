import {environment} from "../../../environments/environment";
import {MIME_TYPE} from "../common/constant";

const BASE_URL = environment.api;
const DOMAIN_URL = environment.baseUrlApi;
const HR_URL = '';
const NO_HR_URL = '';
const DEFAULT_LANGUAGE = 'vi';
const OAUTH = '/oauth';
export const CONFIG = {
  session: 'session_token',
  access_token: 'access_token',
  refresh_token: 'refresh_token',
  device_token: 'device_token',
  access_token_expired_time: 'access_token_expired_time',
  refresh_token_expired_time: 'refresh_token_expired_time',
  token_get_time: 'token_get_time',
  apiUrl: BASE_URL,
  contentType: 'application/json',
  requestAuthorization: 'Basic ZGFzaGJvYXJkLXdlYi1jbGllbnQ6ZGQ4Y2MxMmM4NjA0NGYwYWZiZDQzYmE3NTY1YzMwNDA=',
  google_client_id: '13470154830-8l859vufuv821iu42dm37dfdf0aunh96.apps.googleusercontent.com',
  defaultLanguage: DEFAULT_LANGUAGE,
  user_default_language: DEFAULT_LANGUAGE,
  countLogin: 10,
  timeLogin: 1, // minutes
  defaultConfig: null,
  timeGMT7: 0,
  emailExtension: '@biplus.com',
  CATALOG_CODE: {
    TEAM_TYPE: 'TEAM_TYPE',
    TECHNOLOGY: 'TECHNOLOGY',
    CANDIDATE_DOMAIN: 'CANDIDATE_DOMAIN'
  },
  ROLES: {
    PO: 'PRODUCT_OWNER',
    TEAM_LEAD: 'TEAM_LEADER'
  },
  REGEX: {
    // EMAIL_REGEX: '^[\\w\\-\\+]+@[\\w-]+(\\.[\\w]+)(\\.[a-z]{2,})$', // old
    EMAIL_REGEX: '^[\\w\\-+]+@[\\w-]+(\\.[\\w]+){1,}$', // new
    PHONE_REGEX: '^(\\d|\\+)\\d{6,14}$'
  },

  API: {
    LOGIN: BASE_URL + NO_HR_URL + '/oauth/token',
    REGISTER_USER: BASE_URL + NO_HR_URL + '/oauth/register',
    GET_APIS: BASE_URL + NO_HR_URL + '/client/get',
    LOGOUT: BASE_URL + NO_HR_URL + '/oauth/logout',
    REFRESH_TOKEN: BASE_URL + NO_HR_URL + '/oauth/refresh',
    VERIFY_TOKEN: BASE_URL + NO_HR_URL + '/oauth/verify',
    OTP: BASE_URL + HR_URL + '/oauth/otp/new',
    REGISTER: BASE_URL + HR_URL + '/user/registers',
    RESET_PASS: BASE_URL + HR_URL + '/oauth/user/reset-password',
    VERIFY_RESET_PASS: BASE_URL + HR_URL + '/oauth/user/verify-reset-password',
    DEVICE_REGISTER: BASE_URL + HR_URL + '/device/register',
    CHANGE_PASS: BASE_URL + HR_URL + '/oauth/user/change-password',
    VERIFY_USERNAME_RESET: BASE_URL + HR_URL + '/user/verify-reset-password',
    VERIFY_USERNAME_REGISTER: BASE_URL + NO_HR_URL + '/oauth/verify-register',
    CONFIG: BASE_URL + '/config/v1.0/',
    CONFIG_HR: BASE_URL + '/config/v1.0/hr/pod',
    CONFIG_HR_WEB: BASE_URL + '/config/v1.0/hrweb/pod',
    ROLE_LIST: BASE_URL + '/oauth/role/list',
    HR_LIST: BASE_URL + HR_URL + '/candidate/list-hr',
    ROLE_LIST_OAUTH: BASE_URL + OAUTH + '/role/list',
    LANGUAGE_LIST: BASE_URL + NO_HR_URL + '/language/list',
    STATUS_LIST: BASE_URL + HR_URL + '/item/list-status',
    APPLY_POSITION_LIST: BASE_URL + HR_URL + '/item/list-apply-position',
    TECHNONOGY_LIST: BASE_URL + HR_URL + '/item/list-technology',
    GENDER_LIST: BASE_URL + HR_URL + '/item/list-gender',
    SOURCE_LIST: BASE_URL + HR_URL + '/item/list-source',
    CERTIFICATE_LIST: BASE_URL + HR_URL + '/item/list-certificate',
    LEVEL_LIST: BASE_URL + HR_URL + '/item/list-level',
    DOMAIN_LIST: BASE_URL + HR_URL + '/item/list-domain',
    LITERACY_LIST: BASE_URL + HR_URL + '/item/list-literacy',
    LITERACY_ENGLISH_LIST: BASE_URL + HR_URL + '/item/list-literacy-english',
    CONTACT_LIST: BASE_URL + HR_URL + '/item/list-contact',
    SCHOOL_LIST: BASE_URL + HR_URL + '/item/list-school',
    MAJORS_LIST: BASE_URL + HR_URL + '/item/list-majors',
    CONTACT_STATUS_LIST: BASE_URL + HR_URL + '/item/list-contact-status',
    CONTACT_STATUS_AFTER_LIST: BASE_URL + HR_URL + '/item/list-status-after-contact',
    CATALOG_ITEM_OTHER_ADD: BASE_URL + HR_URL + '/item/add',
    RESPONSE_LIST: BASE_URL + HR_URL + '/item/list-response',
    TEMPLATE_DOWNLOAD: BASE_URL + HR_URL + '/candidate/template/get',
    FILE_DOWNLOAD: BASE_URL + HR_URL + '/profile/download-file',
    CANDIDATE_ADD: BASE_URL + HR_URL + '/candidate/add',
    CANDIDATE_EDIT: BASE_URL + HR_URL + '/candidate/edit',
    CANDIDATE_ASSIGN: BASE_URL + HR_URL + '/saga/candidate/assign',
    CANDIDATE_SEARCH: BASE_URL + HR_URL + '/candidate/search',
    CANDIDATE_EXPORT: BASE_URL + HR_URL + '/candidate/export',
    CANDIDATE_IMPORT: BASE_URL + HR_URL + '/candidate/import',
    CANDIDATE_DETAIL: BASE_URL + HR_URL + '/candidate/get',
    CANDIDATE_GET_CV: BASE_URL + HR_URL + '/candidate/get-cv',
    CANDIDATE_LIST: BASE_URL + HR_URL + '/candidate/list',
    CANDIDATE_UPLOAD_CV: BASE_URL + HR_URL + '/profile/upload-cv',
    CANDIDATE_IMPORT_CV: BASE_URL + HR_URL + '/candidate/import-cv',
    EMPLOYEE: {
      PAGE_SEARCH: BASE_URL + "/employee/search-employees",
      SUGGEST_EMPLOYEE: BASE_URL + '/employee/search',
      EXPORT: BASE_URL + "/employee/export",
      SUGGEST_SEARCH: BASE_URL + "/employee/search",
      FIND_BY_ID: BASE_URL + "/employee/employees",
      DOWNLOADFILE: BASE_URL + "/employee/download",
      TEMPLATE_DOWNLOAD_FILE: BASE_URL + "/employee/download/template/Import_employee_profile_template.xlsx",
      UPDATE: BASE_URL + "/employee/update/",
      CREATE: BASE_URL + "/employee/",
      UPDATE_CATEGORY_STORED: BASE_URL + "/employee/update-category-stored",
      UPDATE_BANK_INFO: BASE_URL + "/employee/update-bank-infos",
      UPDATE_TAX_INFO: BASE_URL + "/employee/update-tax-info",
      UPDATE_IDENTITY_INFO: BASE_URL + "/employee/update-indentity-infos",
      UPDATE_FAMILY_CONTRACT: BASE_URL + "/employee/update-family-contact",
      UPDATE_RELATION_INFO: BASE_URL + "/employee/update-relation-info/",
      UPDATE_EMPLOYEE_HISTORY: BASE_URL + "/saga/employee/update-employee-history/",
      GET_TO_CREATE_CONTRACT: BASE_URL + "/employee/get-employees-to-create-contract",
      GET_TEAMS: BASE_URL + "/salary/attendance/get-teams-employees-from-manager",
      GET_EMPLOYEES: BASE_URL + "/salary/attendance/get-teams-employees-from-manager",
      UPDATE_SALARY: BASE_URL + "/employee/update-salary",
      UPDATE_TEAM_BY_EMPLOYEE_ID: BASE_URL + "/employee/update-team-by-employeeId"
    },
    CATALOG_CODE: BASE_URL + "/catalog/item/get?catalog_code=" ,
    CONTRACT: {
      FIND_BY_ID: BASE_URL + "/contract/labor-contracts/",
      CREATE: BASE_URL + "/contract/create",
      UPDATE: BASE_URL + "/saga/contract/update/",
      UPDATE_HISTORY_STATUS: BASE_URL + "/saga/contract/approval/",
      PAGE_SEARCH: BASE_URL + "/contract/search",
      FIRST_CONTRACT_DATA: BASE_URL + "/contract/first-contract-data",
    },
    WORKING_OVERTIME: {
      STATISTIC_OVERTIME: DOMAIN_URL + "/overtime/statistic"
    },
    WORKING_ONLEAVE: {
      STATISTIC_ONLEAVE: BASE_URL + "/salary/leave/summary-leaves"
    },
    PROFILE: {
      UPLOAD_CV: BASE_URL + '/profile/upload-cv'
    },
    CATALOG: {
      GET_ITEM: BASE_URL + '/catalog/item/get',
      ADD_ITEM: BASE_URL + '/catalog/item/add'
    },
    LIST_TEAM_TYPE: BASE_URL + '/item/team-type',
    LIST_TECH: BASE_URL + HR_URL + '/item/list-technology',
    LIST_DOMAIN: BASE_URL + HR_URL + '/item/list-domain',
    SEARCH_TEAM: BASE_URL + '/team/search',
    LIST_PO: BASE_URL + HR_URL + '/user/list-po',
    EMPLOYEE_BY_ROLE: BASE_URL + '/team/employees-by-role',
    LIST_TEAM_LIST: BASE_URL + '/auth2/user/list-team-lead',
    CREATE_TEAM: BASE_URL + '/team/add',
    UPDATE_TEAM: BASE_URL + '/team/edit',
    DELETE_TEAM: BASE_URL + '/team/delete-team',
    TEAM_INFO: BASE_URL + '/team/get',
    SEARCH_EMPLOYEE: BASE_URL + '/team/team_employees',
    DETAIL_EMPLOYEE: BASE_URL + '/team/employee',
    CREATE_ITEM: BASE_URL + HR_URL + '/item/add',
    HISTORY_TEAM: BASE_URL + '/team/search-audit',
    RECRUITMENT: {
      GET_REVIEW_CV_RESULT: BASE_URL + '/recruitment/review-cv/get',
      GET_INTERVIEW_INFO: BASE_URL + '/recruitment/interview-info',
      REMOVE_CV_REVIEWER: BASE_URL + '/saga/recruitment/remove-cv-reviewer',
      ASSIGN_CV_REVIEWER: BASE_URL + '/saga/recruitment/assign-cv-reviewer',
      SAVE_REVIEW_CV_RESULT: BASE_URL + '/saga/recruitment/review-cv',
      SAVE_INTERVIEW_CONTACT: BASE_URL + '/saga/recruitment/save-interview-contact',
      SAVE_INTERVIEW_SCHEDULE: BASE_URL + '/saga/recruitment/save-interview-schedule',
      INTERVIEW_EVALUATION: BASE_URL + '/saga/recruitment/interview-evaluation',
      CREATE_RECRUITMENT_PROPOSAL: BASE_URL + '/saga/recruitment/create-recruitment-proposal',
      REJECT_APPROVAL_PROPOSAL: BASE_URL + '/saga/recruitment/approval-proposal',
      CREATE_RECRUITMENT_DECISION: BASE_URL + '/saga/recruitment/create-decision',
      REJECT_APPROVAL_RECRUITMENT_DECISION: BASE_URL + '/saga/recruitment/approval-decision',
      SAVE_ONBOARD_STATUS: BASE_URL + '/saga/recruitment/save-onboard-status',
      EXPORT_OFFER: BASE_URL + '/recruitment/export-offer'
    }
  },
  PERMISSION: {
    ACTION: {
      SEARCH_TEAM: ['get_team'],
      CREATE_TEAM: ['add_team'],
      EDIT_TEAM: ['edit_team'],
      VIEW_TEAM_HISTORY: ['search_team_audit'],
      SHOW_EMPLOYEE_INFO: ['get_employee']
    }
  },
  ROLE: {
    ACTION: {
      EDIT_TEAM_NAME: ['COO', 'PRM']
    },
    CATALOG: {
      GET_ITEM: BASE_URL + '/catalog/item/get',
      ADD_ITEM: BASE_URL + '/catalog/item/add'
    },
    LIST_TEAM_TYPE: BASE_URL + '/item/team-type',
    LIST_TECH: BASE_URL + HR_URL + '/item/list-technology',
    LIST_DOMAIN: BASE_URL + HR_URL + '/item/list-domain',
    SEARCH_TEAM: BASE_URL + '/team/search',
    LIST_PO: BASE_URL + HR_URL + '/user/list-po',
    EMPLOYEE_BY_ROLE: BASE_URL + '/team/employees-by-role',
    LIST_TEAM_LIST: BASE_URL + '/auth2/user/list-team-lead',
    CREATE_TEAM: BASE_URL + '/team/add',
    UPDATE_TEAM: BASE_URL + '/team/edit',
    TEAM_INFO: BASE_URL + '/team/get',
    SEARCH_EMPLOYEE: BASE_URL + '/team/team_employees',
    DETAIL_EMPLOYEE: BASE_URL + '/team/employee',
    CREATE_ITEM: BASE_URL + HR_URL + '/item/add',
    HISTORY_TEAM: BASE_URL + '/team/search-audit',
  },
  CLIENT: [
    {
      applicationCode: null,
      clientCode: 'hr',
      name: 'HR',
      clientKey: 'HRWEBWYFVQ1FNm0VmoUdiGPaM4uqRyHi',
      clientSecret: 'HRWEBTkDEWkok0nTtpuHFNVNT1pCKPVdWto2UjqmSQZVj4g5QBUHnfCt7JmrAVTR'
    }
  ],
  LANGUAGE: [
    {prefix: "./assets/i18n/common/", suffix: ".json"},
    {prefix: "./assets/i18n/pagination/", suffix: ".json"},
    {prefix: "./assets/i18n/language/", suffix: ".json"},
    {prefix: "./assets/i18n/user/", suffix: ".json"},
    {prefix: "./assets/i18n/validations/", suffix: ".json"},
    {prefix: "./assets/i18n/shared/", suffix: ".json"},
    {prefix: "./assets/i18n/contract/", suffix: ".json"},
    {prefix: "./assets/i18n/pagination/", suffix: ".json"},
    {prefix: "./assets/i18n/working-overtime/", suffix: ".json"},
    {prefix: "./assets/i18n/working-onleave/", suffix: ".json"},
    {prefix: "./assets/i18n/employees/", suffix: ".json"},
    {prefix: "./assets/i18n/employees/employee-profile/", suffix: ".json"},
    {prefix: "./assets/i18n/enum/", suffix: ".json"},
    {prefix: "./assets/i18n/recruitment/", suffix: ".json"},
    {prefix: "./assets/i18n/recruitment/candidate/", suffix: ".json"},
    {prefix: "./assets/i18n/team/", suffix: ".json"},
    {prefix: "./assets/i18n/present/", suffix: ".json"},
    {prefix: "./assets/i18n/time-manager/", suffix: ".json"}
  ],

    LANGUAGE_DATA: [
      'VI', 'EN'
    ],
    LANGUAGE_COUNTRY: 'VN',
    CANDIDATE: {
      MAX_GRADUATE_YEAR: 10,
      MIN_GRADUATE_YEAR: 50,
      MAX_UPLOAD_CV: 5,
      FILE_TYPE_UPLOAD_CV: [
      MIME_TYPE.PDF, MIME_TYPE.DOC, MIME_TYPE.DOCX
    ],
    MAX_CONTACT_CHANNEL: 5,
    MAX_TRAINING_HISTORY: 5,
    MAX_SIZE_UPLOAD_MB: 5,
    MAX_SIZE_IMPORT_CV: 10,
    FILE_TYPE_IMPORT_CV: [
      MIME_TYPE.XLSX, MIME_TYPE.XLS
    ],
    STATUS_CODE_R3: 'R3',
    STATUS_CODE_SPECIAL: [
      'R0', 'R1', 'R2', 'R4.1', 'R4.2'
    ],
    STATUS_CODE_ADD_NEW_ASSIGN_CV : [
      'R4', 'R5', 'R5.0', 'R5.1'
    ],
    STATUS_CODE_ADD_NEW_ONBOARD : [
      'R9', 'R8.1', 'R9.1'
    ],
    STATUS_CODE_INTERVIEW : 'R5.2',
    STATUS_CODE_ACCEPT_INTERVIEW : 'R6',
    STATUS_CODE_REJECT_INTERVIEW : 'R6.1',
    STATUS_CODE_OFFER_CANDIDATE : 'R7',
    CANDIDATE_NOT_HAVE_OFFER : 'R7.1',
    LEVEL_CODE_LOW: [
      'Fresher', 'Intern'
    ],
    APPLY_POSITION_CODE_DEVELOPER: 'Developer',
    CONTACT_ZALO: 'Zalo',
    CONTACT_PHONE: 'Phone',
    CONTACT_STATUS_CONTACTED:'CONTACTED',
    ROLES_HRA_LEAD: 'HRA_LEADER',
    ROLES_RECRUITER_LEAD: 'RECRUITER_LEAD',
    ROLES_HR: 'RECRUITER',
    ROLES_CTV: 'CTV'
  },
  RECRUITMENT : {
    INTERVIEW_EVALUATION: {
      TYPE: {
        HR: 'HR',
        INTERVIEWER: 'INTERVIEWER'
      }
    }
  }
};

export const CANDIDATE_STATUS_MAPPING = {
  'R0': ['R1'],
  'R1': ['R4', 'R4.2', 'R4.1'],
  'R2': ['R0', 'R1'],
  'R3': ['R0', 'R1']
};
