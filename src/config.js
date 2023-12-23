export const BASE_URL="https://rune-master.onrender.com";
// export const BASE_URL="http://127.0.0.1:8000";
export const FETCH_SLAVES_URI = "/api/master/slaves";
export const FETCH_MASTER_SLAVE_RESPONSE = "/api/master/slave/response";
export const SLAVE_FILE_DOWNLOAD_URL = "/api/master/slave/response/file/download";
export const CLEAR_SLAVE_RESPONSE = "/api/master/slave/clear/response";
export const SEND_COMMAND_TO_SLAVE = "/api/master/slave/command";
export const GET_SCREENSHOT_FROM_SLAVE = "/api/master/slave/response/screenshot";
export const SLAVE_SCREENSHOT_EXISTS = "/api/master/slave/response/screenshot/exists";
export const SLAVE_SCREENSHOT_DELETE = "/api/master/slave/response/screenshot/delete";
export const MASTER_PASSWORD_VALIDATE = "/api/validate/master/password";
export const REDIS_DATA_URL = "/api/master/redis/data";
export const ADMIN_FILE_UPLOAD = "/api/master/file/upload"
export const FILE_DOWNLOAD_SPLIT_DELIMETER = ":+:+:+:";

export const ACTION_TYPE_SHELL = "SHELL";
export const ACTION_TYPE_FILEBROWSE = "FILEBROWSE";
export const ACTION_TYPE_SCREENSHOT = "SCREENSHOT";
export const ACTION_TYPE_GETFILEURL = "GETFILEURL";

export const ONLINE_SECONDS_THRESHOLD = 5;
