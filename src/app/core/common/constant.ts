export const USER = {
    CURRENT: 'USER_CURRENT',
  INFO: 'USER_INFO',
  NEXT_URL: 'NEXT_URL',
  ROLES: 'USER_ROLES',
  PERMISSION: 'USER_PERMISSION',
  URL_LOGIN_SUCCESS: 'layout/timemanagement/presencemanagement',
  MENU: 'USER_MENU',
  MENU_MODULE: 'MODULE',
  VIEW: {
    LOGIN: 'USER_VIEW_LOGIN',
    LOGOUT: 'USER_VIEW_LOGOUT',
    EMAIL: 'USER_VIEW_EMAIL',
    EMAIL_PLACEHOLDER: 'USER_VIEW_EMAIL_PLACEHOLDER',
    FORGOT_PASSWORD: 'USER_VIEW_FORGOT_PASSWORD',
    CHANGE_PASSWORD: 'USER_VIEW_CHANGE_PASSWORD',
    PASSWORD: 'USER_VIEW_PASSWORD',
    PASSWORD_PLACEHOLDER: 'USER_VIEW_PASSWORD_PLACEHOLDER',
    NEW_PASSWORD: 'USER_VIEW_NEW_PASSWORD',
    NEW_PASSWORD_PLACEHOLDER: 'USER_VIEW_NEW_PASSWORD_PLACEHOLDER',
    RE_NEW_PASSWORD: 'USER_VIEW_RE_NEW_PASSWORD',
    RE_NEW_PASSWORD_PLACEHOLDER: 'USER_VIEW_RE_NEW_PASSWORD_PLACEHOLDER',
    CONFIRM: 'USER_VIEW_CONFIRM',
    SAVE: 'USER_VIEW_SAVE',
    OTP_TITLE: 'USER_VIEW_OTP_TITLE',
    OTP_TITLE_DESCRIPTION: 'USER_VIEW_OTP_TITLE_DESCRIPTION',
    OTP_PLACEHOLDER: 'USER_VIEW_OTP_PLACEHOLDER',
    OTP_QUESTION: 'USER_VIEW_OTP_QUESTION',
    OTP_RESEND: 'USER_VIEW_OTP_RESEND',
    OTP_RESEND_ZERO: 'USER_VIEW_OTP_RESEND_ZERO',
    MY_ACCOUNT: {
      TITLE: 'USER_VIEW_MY_ACCOUNT_TITLE'
    }
  },
  OTP: {
    TYPE: 'USER_OTP_TYPE',
    EMAIL: 'USER_OTP_EMAIL',
    PASSWORD: 'USER_OTP_PASSWORD',
    FORGOT_PASSWORD: 'USER_OTP_FORGOT_PASSWORD'
  }
}

export const ROLES = {
    LIST: 'ROLES_LIST',
    HRA_LEADER: 'HRA_LEADER',
    CB: 'CB',
    BOD: 'BOD',
    EMPLOYEE: 'EMPLOYEE',
    PO: 'PO',
    PRM: 'PRM',
    TEAM_LEADER: 'TEAM_LEADER',
}

export const ROLE_LIST = {
    CRUM_MASTER: 'CRUM_MASTER',
    PRODUCT_OWNER: 'PRODUCT_OWNER',
    DEVOPS: 'DEVOPS',
    BUSINESS_ANALYST: 'BUSINESS_ANALYST',
    DEVELOPER: 'DEVELOPER',
    QUALITY_CONTROL: 'QUALITY_CONTROL',
    TEAM_LEADER: 'TEAM_LEADER',
    // BOD
    CEO: 'CEO',
    COO: 'COO',
    CFO: 'CFO',
    CMO: 'CMO',
    CTO: 'CTO',
    // BOD
    DESIGNER: 'DESIGNER',
    MARKETING_EXECUTIVE: 'MARKETING_EXECUTIVE',
    MARKETING_LEADER: 'MARKETING_LEADER',
    SALES: 'SALES',
    SALES_ADMIN: 'SALES_ADMIN',
    SALES_LEADER: 'SALES_LEADER',
    C_B: 'C_B',
    RECRUITER: 'RECRUITER',
    ADMIN: 'ADMIN',
    L_D: 'L_D',
    HRA_LEADER: 'HRA_LEADER',
    OPERATIONS_EXECUTIVE: 'OPERATIONS_EXECUTIVE',
    PROJECT_MANAGER: 'PROJECT_MANAGER',
    PRM_LEADER: 'PRM_LEADER',
    PRM: 'PRM',
    QUALITY_ASSURANCE: 'QUALITY_ASSURANCE',
    CASHIER: 'CASHIER',
    FINANCE_ACCOUNTING_LEADER: 'FINANCE_ACCOUNTING_LEADER',
}

export const TRANSLATE = {
    KEY: 'exception-message',
    EXISTS: 'TRANSLATE_EXISTS'
}

export const LANGUAGE = {
    KEY: 'LANGUAGE_KEY',
    VALUE: 'LANGUAGE_VALUE',
    VI: 'vi',
    VI_VALUE: 'Tiếng Việt',
    EN: 'en',
    LIST: 'LANGUAGE_LIST'
}

export const HOME = {
    DASHBOARD: {
        TITLE_NAME: 'HOME_DASHBOARD_TITLE_NAME'
    }
}

export const HEADERS = {
    AUTHORIZATION: 'Authorization',
    ACCEPT_LANGUAGE: 'Accept-Language',
    CLIENT_KEY: 'Client_key',
    CLIENT_SECRET: 'Client_secret',
    CONTENT_TYPE: 'Content-Type',
};

export const CANDIDATE = {
    LIST: {
        TITLE_NAME: 'CANDIDATE_LIST_NAME',
        CREATE_DATE_FROM: 'CANDIDATE_LIST_CREATE_DATE_FROM',
        CREATE_DATE_TO: 'CANDIDATE_LIST_CREATE_DATE_TO',
        SEARCH: 'CANDIDATE_LIST_SEARCH',
        ASSIGN_HR: 'CANDIDATE_LIST_ASSIGN_HR',
        UPLOAD_CV: 'CANDIDATE_LIST_UPLOAD_CV',
        EXPORT: 'CANDIDATE_LIST_EXPORT',
        IMPORT: 'CANDIDATE_LIST_IMPORT',
        ADD_NEW: 'CANDIDATE_LIST_ADD_NEW',
    },
    VIEW: {
        ADD_OR_UPDATE: {
            ADD_TITLE: 'CANDIDATE_VIEW_ADD_OR_UPDATE_ADD_TITLE'
        },
        BOX: {
            CANDIDATE_INFO: 'CANDIDATE_VIEW_BOX_CANDIDATE_INFO',
            CONTRACT_CHANNEL_ADD: 'CANDIDATE_VIEW_BOX_CONTRACT_CHANNEL_ADD',
            WORK_EXPERIENCE: 'CANDIDATE_VIEW_BOX_WORK_EXPERIENCE',
            EDUCATIONAL_INFORMATION: 'CANDIDATE_VIEW_BOX_EDUCATIONAL_INFORMATION',
            TRAINING_HISTORY: 'CANDIDATE_VIEW_BOX_TRAINING_HISTORY'
        }
    },
    MODEL: {
        CANDIDATE_ID: 'CANDIDATE_MODEL_CANDIDATE_ID',
        CANDIDATE_CODE: 'CANDIDATE_MODEL_CANDIDATE_CODE',
        CANDIDATE_CODE_PLACEHOLDER: 'CANDIDATE_MODEL_CANDIDATE_CODE_PLACEHOLDER',
        FULL_NAME: 'CANDIDATE_MODEL_FULL_NAME',
        FULL_NAME_PLACEHOLDER: 'CANDIDATE_MODEL_FULL_NAME_PLACEHOLDER',
        BIRTH_DATE: 'CANDIDATE_MODEL_BIRTH_DATE',
        BIRTH_DATE_PLACEHOLDER: 'CANDIDATE_MODEL_BIRTH_DATE_PLACEHOLDER',
        GENDER: 'CANDIDATE_MODEL_GENDER',
        GENDER_PLACEHOLDER: 'CANDIDATE_MODEL_GENDER_PLACEHOLDER',
        EMAIL: 'CANDIDATE_MODEL_EMAIL',
        EMAIL_PLACEHOLDER: 'CANDIDATE_MODEL_EMAIL_PLACEHOLDER',
        CREATE_DATE: 'CANDIDATE_MODEL_CREATE_DATE',
        CREATE_DATE_PLACEHOLDER: 'CANDIDATE_MODEL_CREATE_DATE_PLACEHOLDER',
        ONBOARD_DATE: 'CANDIDATE_MODEL_ONBOARD_DATE',
        ONBOARD_DATE_PLACEHOLDER: 'CANDIDATE_MODEL_ONBOARD_DATE_PLACEHOLDER',
        APPLY_POSITION: 'CANDIDATE_MODEL_APPLY_POSITION',
        APPLY_POSITION_PLACEHOLDER: 'CANDIDATE_MODEL_APPLY_POSITION_PLACEHOLDER',
        TECHNOLOGY: 'CANDIDATE_MODEL_TECHNOLOGY',
        TECHNOLOGY_PLACEHOLDER: 'CANDIDATE_MODEL_TECHNOLOGY_PLACEHOLDER',
        STATUS: 'CANDIDATE_MODEL_STATUS',
        STATUS_PLACEHOLDER: 'CANDIDATE_MODEL_STATUS_PLACEHOLDER',
        PHONE: 'CANDIDATE_MODEL_PHONE',
        PHONE_PLACEHOLDER: 'CANDIDATE_MODEL_PHONE_PLACEHOLDER',
        HR: 'CANDIDATE_MODEL_HR',
        HR_PLACEHOLDER: 'CANDIDATE_MODEL_HR_PLACEHOLDER',
        ADDRESS: 'CANDIDATE_MODEL_ADDRESS',
        ADDRESS_PLACEHOLDER: 'CANDIDATE_MODEL_ADDRESS_PLACEHOLDER',
        SOURCE: 'CANDIDATE_MODEL_SOURCE',
        SOURCE_PLACEHOLDER: 'CANDIDATE_MODEL_SOURCE_PLACEHOLDER',
        RECEIVE_TIME: 'CANDIDATE_MODEL_RECEIVE_TIME',
        RECEIVE_TIME_PLACEHOLDER: 'CANDIDATE_MODEL_RECEIVE_TIME_PLACEHOLDER',
        JD_LINK: 'CANDIDATE_MODEL_JD_LINK',
        JD_LINK_PLACEHOLDER: 'CANDIDATE_MODEL_JD_LINK_PLACEHOLDER',
        CONTACT_CHANNEL: 'CANDIDATE_MODEL_CONTACT_CHANNEL',
        CONTACT_CHANNEL_PLACEHOLDER: 'CANDIDATE_MODEL_CONTACT_CHANNEL_PLACEHOLDER',
        CONTACT_INFO: 'CANDIDATE_MODEL_CONTACT_INFO',
        CONTACT_INFO_PLACEHOLDER: 'CANDIDATE_MODEL_CONTACT_INFO_PLACEHOLDER',
        FILE_CV: 'CANDIDATE_MODEL_FILE_CV',
        FILE_CV_PLACEHOLDER: 'CANDIDATE_MODEL_FILE_CV_PLACEHOLDER',
        FILE_CV_COMMENT: 'CANDIDATE_MODEL_FILE_CV_COMMENT',
        ROLES: 'CANDIDATE_MODEL_ROLES',
        LEVEL: 'CANDIDATE_MODEL_LEVEL',
        LEVEL_PLACEHOLDER: 'CANDIDATE_MODEL_LEVEL_PLACEHOLDER',
        OLD_COMPANY: 'CANDIDATE_MODEL_OLD_COMPANY',
        OLD_COMPANY_PLACEHOLDER: 'CANDIDATE_MODEL_OLD_COMPANY_PLACEHOLDER',
        DOMAIN: 'CANDIDATE_MODEL_DOMAIN',
        DOMAIN_PLACEHOLDER: 'CANDIDATE_MODEL_DOMAIN_PLACEHOLDER',
        START_WORK_TIME: 'CANDIDATE_MODEL_START_WORK_TIME',
        START_WORK_TIME_PLACEHOLDER: 'CANDIDATE_MODEL_START_WORK_TIME_PLACEHOLDER',
        TIME_WORK_EXPERIENCE: 'CANDIDATE_MODEL_TIME_WORK_EXPERIENCE',
        CERTIFICATE: 'CANDIDATE_MODEL_CERTIFICATE',
        CERTIFICATE_PLACEHOLDER: 'CANDIDATE_MODEL_CERTIFICATE_PLACEHOLDER',
        MAX_LITERACY: 'CANDIDATE_MODEL_MAX_LITERACY',
        MAX_LITERACY_PLACEHOLDER: 'CANDIDATE_MODEL_MAX_LITERACY_PLACEHOLDER',
        LITERACY_ENGLISH: 'CANDIDATE_MODEL_LITERACY_ENGLISH',
        LITERACY_ENGLISH_PLACEHOLDER: 'CANDIDATE_MODEL_LITERACY_ENGLISH_PLACEHOLDER',
        SCHOOL: 'CANDIDATE_MODEL_SCHOOL',
        SCHOOL_PLACEHOLDER: 'CANDIDATE_MODEL_SCHOOL_PLACEHOLDER',
        MAJORS: 'CANDIDATE_MODEL_MAJORS',
        MAJORS_PLACEHOLDER: 'CANDIDATE_MODEL_MAJORS_PLACEHOLDER',
    }
}

export const COMMON = {
    PAGINATION: {
        DISPLAY_RECORD: 'COMMON_PAGINATION_DISPLAY_RECORD',
        DISPLAY_OF: 'COMMON_PAGINATION_DISPLAY_OF',
        RECORD: 'COMMON_PAGINATION_RECORD',
        NO: 'COMMON_PAGINATION_NO',
        NOT_EXIST: 'COMMON_PAGINATION_NOT_EXIST'
    },
    VALIDATE: {
        REQUIRED: 'COMMON_VALIDATE_REQUIRED',
        PATTERN: 'COMMON_VALIDATE_PATTERN',
        MAX_LENGTH: 'COMMON_VALIDATE_MAX_LENGTH',
        MIN_LENGTH: 'COMMON_VALIDATE_MIN_LENGTH',
        EQUALS_PASSWORD: 'COMMON_VALIDATE_EQUALS_PASSWORD'
    },
    NOTIFY: {
        TITLE: 'COMMON_NOTIFY_TITLE'
    },
    WARNING: {
        TITLE: 'COMMON_WARNING_TITLE'
    }
}

export const OPTION_PAGE_SIZE = [
    {value: 10},
    {value: 20},
    {value: 30},
    {value: 50},
    {value: 100}
];

export const TENANTS = {
    PERU: 'PE',
    MOZ: 'MZ',
    LAO: 'LA'
}

export const LANGUAGES = {
    VI: 'vi'
    , EN: 'en'
    , ES: 'es'
}

export const ERROR_STATUS = {
    ACCESS_TOKEN: {
        EXPIRED: 'ACCESS_TOKEN_EXPIRED'
    },
    WRONG: {
        AUTHORIZATION: 'WRONG_AUTHORIZATION'
    }
}

export const CHARACTERS = {
    DOT: '.',
    COMMA: ',',
    SPACE: ' ',
};


export const CURRENCY_MASK = {
    CURRENT_CONFIG: {
        round: 0,
    pattern: 'separator.0',
    thousandSeparator: CHARACTERS.COMMA,
  },
  MOZ_CONFIG: {
    round: 0,
    pattern: 'separator.0'
  },
  PERU_CONFIG: {
    round: 2,
    pattern: 'separator.2'
  },
  LAO_CONFIG: {
    round: 2,
    pattern: 'separator.2',
    thousandSeparator: CHARACTERS.COMMA,
  },
  EN_SEPARATOR: CHARACTERS.COMMA,
  VI_SEPARATOR: CHARACTERS.DOT,
  ES_SEPARATOR: CHARACTERS.COMMA,
};

export const MIME_TYPE = {
    AAC: 'audio/aac',
    ABW: 'application/x-abiword',
    ARC: 'application/x-freearc',
    AVI: 'video/x-msvideo',
    AZW: 'application/vnd.amazon.ebook',
    BIN: 'application/octet-stream',
    BMP: 'image/bmp',
    BZ: 'application/x-bzip',
    BZ2: 'application/x-bzip2',
    CSH: 'application/x-csh',
    CSS: 'text/css',
    CSV: 'text/csv',
    DOC: 'application/msword',
    DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    EOT: 'application/vnd.ms-fontobject',
    EPUB: 'application/epub+zip',
    GIF: 'image/gif',
    HTM: 'text/html',
    HTML: 'text/html',
    ICO: 'image/vnd.microsoft.icon',
    ICS: 'text/calendar',
    JAR: 'application/java-archive',
    JPEG: 'image/jpeg',
    JPG: 'image/jpeg',
    JS: 'text/javascript',
    JSON: 'application/json',
    JSONLD: 'application/ld+json',
    MID: 'audio/midi audio/x-midi',
    MIDI: 'audio/midi audio/x-midi',
    MJS: 'text/javascript',
    MP3: 'audio/mpeg',
    MPEG: 'video/mpeg',
    MPKG: 'application/vnd.apple.installer+xml',
    ODP: 'application/vnd.oasis.opendocument.presentation',
    ODS: 'application/vnd.oasis.opendocument.spreadsheet',
    ODT: 'application/vnd.oasis.opendocument.text',
    OGA: 'audio/ogg',
    OGV: 'video/ogg',
    OGX: 'application/ogg',
    OTF: 'font/otf',
    PNG: 'image/png',
    PDF: 'application/pdf',
    PPT: 'application/vnd.ms-powerpoint',
    PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    RAR: 'application/x-rar-compressed',
    RTF: 'application/rtf',
    SH: 'application/x-sh',
    SVG: 'image/svg+xml',
    SWF: 'application/x-shockwave-flash',
    TAR: 'application/x-tar',
    TIF: 'image/tiff',
    TIFF: 'image/tiff',
    TS: 'video/mp2t',
    TTF: 'font/ttf',
    TXT: 'text/plain',
    VSD: 'application/vnd.visio',
    WAV: 'audio/wav',
    WEBM: 'video/webm',
    WEBP: 'image/webp',
    WOFF: 'font/woff',
    WOFF2: 'font/woff2',
    XHTML: 'application/xhtml+xml',
    XLS: 'application/vnd.ms-excel',
    XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    XML: 'application/xml if not readable from casual users (RFC 3023, section 3)',
    XUL: 'application/vnd.mozilla.xul+xml',
    ZIP: 'application/zip',
    _3GP: 'video/3gpp',
    _3G2: 'video/3gpp2',
    _7Z: 'application/x-7z-compressed'
};

export const TEMPLATE = {
    IMPORT_CANDIDATE: "template_import_candidates"
}

export const FORMAT_DATE = {
    DATE: "DD/MM/YYYY"
}

export const POSITION_EMPLOYEE = [
    { code: "SCRUM_MASTER", description: "Scrum master"},
    { code: "PRODUCT_OWNER", description: "PO"},
    { code: "DEVOPS", description: "Devops"},
    { code: "BUSINESS_ANALYST", description: "BA"},
    { code: "DEVELOPER", description: "Developer"},
    { code: "QUALITY_CONTROL", description: "QC"},
    { code: "TEAM_LEADER", description: "Team leader"},
    { code: "CEO", description: "CEO"},// full quyen
    { code: "COO", description: "COO"},// full quyen
    { code: "CFO", description: "CFO"},
    { code: "CMO", description: "CMO"},
    { code: "CTO", description: "CTO"},
    { code: "DESIGNER", description: "Designer"},
    { code: "MARKETING_EXECUTIVE", description: "Marketing executive"},
    { code: "MARKETING_LEADER", description: "Marketing leader"},
    { code: "SALES", description: "Sales"},
    { code: "SALES_ADMIN", description: "Sales admin"},
    { code: "SALES_LEADER", description: "Sales leader"},
    { code: "C_B", description: "C&B"},
    { code: "RECRUITER", description: "Recruiter"},
    { code: "ADMIN", description: "Admin"},
    { code: "L_D", description: "L_D"},
    { code: "HRA_LEADER", description: "HRA leader"},// full quyen
    { code: "OPERATIONS_EXECUTIVE", description: "Operations executive"},
    { code: "PROJECT_MANAGER", description: "PM"},
    { code: "PRM_LEADER", description: "PRM leader"},// full quyen
    { code: "QUALITY_ASSURANCE", description: "QA"},
    { code: "CASHIER", description: "Cashier"},
    { code: "FINANCE_ACCOUNTING_LEADER", description: "Finance accounting leader"},
]

export const STATUS = [
      {
        code: "WORKING",
        description: "timeManager.search.working",
        key: "timeManager.search.working",
      },
      {
        code: "RETIRED",
        description: "timeManager.search.retired",
        key: "timeManager.search.retired",
      },
    ];

export const OT_STATUS = {
    PENDING: "PENDING",
    SENT_REQUEST: "SENT_REQUEST",
    LEADER_APPROVED: "LEADER_APPROVED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED"
}

export const GENDER = [
    { code: "MALE", description: "Nam", key: "ENUM.GENDER.MALE" },
    { code: "FEMALE", description: "Nữ", key: "ENUM.GENDER.FEMALE" },
    { code: "OTHER", description: "Khác", key: "ENUM.GENDER.OTHER" },
]

export const RELATIONSHIP_LIST = [
    { code: "GrandFather", description: "Ông", key: "ENUM.RELATIONSHIP.GrandFather" },
    { code: "GrandMother", description: "Bà", key: "ENUM.RELATIONSHIP.GrandMother" },
    { code: "Father", description: "Bố", key: "ENUM.RELATIONSHIP.Father" },
    { code: "Mother", description: "Mẹ", key: "ENUM.RELATIONSHIP.Mother" },
    { code: "Brother", description: "Anh/Em", key: "ENUM.RELATIONSHIP.Brother" },
    { code: "Sister", description: "Chị/Em", key: "ENUM.RELATIONSHIP.Sister" },
]

export const STACK_TECH = [
    "JAVA",
    "DOT_NET",
    "PYTHON",
    "NODE_JS",
    "PHP",
    "IOS",
    "ANDROID",
    "MOBILE_NATIVE",
    "MOBILE_HYBRID",
    "ANGULAR",
    "FRONTEND_GENERAL",
    "VUE_JS",
    "REACT",
    "DEVOPS",
    "ATLASIAN",
    "OTHER"
]

export const IDENTITY_CARD_TYPE = [
    { code: "CMT", key: "ENUM.IDENTITY_CARD_TYPE.CMT"},
    { code: "CCCD", key: "ENUM.IDENTITY_CARD_TYPE.CCCD"},
    { code: "PASSPORT", key: "ENUM.IDENTITY_CARD_TYPE.PASSPORT"}
]

export const CATALOG_ITEM = {
  TECHNOLOGY : 'TECHNOLOGY',
  CANDIDATE_DOMAIN : 'CANDIDATE_DOMAIN',
  CANDIDATE_SCHOOL : 'CANDIDATE_SCHOOL',
  CANDIDATE_CERTIFICATE : 'CANDIDATE_CERTIFICATE',
  CANDIDATE_MAJORS : 'CANDIDATE_MAJORS',
  CANDIDATE_STATUS : 'CANDIDATE_STATUS',
  CANDIDATE_GENDER : 'GENDER',
  APPLY_POSITION : 'APPLY_POSITION',
  CANDIDATE_LITERACY : 'CANDIDATE_LITERACY',
  CANDIDATE_LITERACY_ENGLISH : 'CANDIDATE_LITERACY_ENGLISH',
  CANDIDATE_CONTACT : 'CANDIDATE_CONTACT',
  CANDIDATE_LEVEL: 'CANDIDATE_LEVEL',
  CANDIDATE_SOURCE: 'CANDIDATE_SOURCE',
  CANDIDATE_CONTACT_STATUS: 'CANDIDATE_CONTACT_STATUS',
  CANDIDATE_RESPONSE: 'CANDIDATE_RESPONSE',
  CANDIDATE_STATUS_AFTER_CONTACT: 'CANDIDATE_STATUS_AFTER_CONTACT',
  WORKING_PLACE: 'WORKING_PLACE',
  INTERVIEW_PLACE: 'INTERVIEW_PLACE',
  INTERVIEW_TYPE: 'INTERVIEW_TYPE',
  PROFESTIONAL_EVALUATION: 'PROFESTIONAL_EVALUATION',
  CULTURAL_SUITABILITY: 'CULTURAL_SUITABILITY',
  INCOME: 'INCOME',
  COMMON_INFOMATION: 'COMMON_INFOMATION',
  OTHER_EVALUATION: 'OTHER_EVALUATION',
  CONTRACT_TYPE: 'CONTRACT_TYPE',
  CONTRACT_PERIOD: 'CONTRACT_PERIOD',
  WORKING_TIME: 'WORKING_TIME',
}


export const EMPLOYEE_STATUS_ENUM = {
    PENDING: "PENDING",
    CONFIRMED: "CONFIRMED",
    REJECTED: "REJECTED",
    WAITING_CB_APPROVE: "WAITING_CB_APPROVE",
    CB_UNAPPROVE: "CB_UNAPPROVE",
    CB_APPROVED: "CB_APPROVED",
    WAITING_APPROVE_CHANGE_INFO: "WAITING_APPROVE_CHANGE_INFO",
    UNAPPROVE: "UNAPPROVE",
    WORKING: "WORKING",
    RETIRED: "RETIRED"
}

export const URL_IMAGE_PREV = {
    url: "/file?file_path="
}

export const RECRUITMENT_PROPOSAL_STATUS = {
    BOD_APPROVED: "BOD_APPROVED",
    BOD_REJECT: "BOD_REJECT",
    WAITING_HR_LEAD: "WAITING_HR_LEAD",
    HR_LEAD_APPROVED: "HR_LEAD_APPROVED",
    HR_LEAD_REJECT: "HR_LEAD_REJECT",
}

export const CONTRACT_TYPE = {
    LABOUR_CONTRACT: "LABOUR_CONTRACT",
    SEASONAL_CONTRACT: "SEASONAL_CONTRACT",
    PROBATIONARY_CONTRACT: "PROBATIONARY_CONTRACT"
}

export const CONTRACT_PERIOD = {
    TWO_MONTHS: "TWO_MONTHS"
}

export const RECRUITMENT_DECISION_STATUS = {
    WAITING_HR_LEADER: "WAITING_HR_LEADER",
    HR_LEAD_APPROVED: "HR_LEAD_APPROVED",
    HR_LEAD_REJECT: "HR_LEAD_REJECT"
}
