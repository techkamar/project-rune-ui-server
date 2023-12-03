import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE, SLAVE_FILE_DOWNLOAD_URL } from '../config';
export function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay + sDisplay+" ago"; 
}

export function clearSlaveResponse(mac_address){
    const requestOptions = {
        method: 'GET',
        headers: { 'auth_token': localStorage.getItem("password") },
    };

    let url = `${BASE_URL}${CLEAR_SLAVE_RESPONSE}?mac=${mac_address}`;
    fetch(url,requestOptions).then(response=>response.text())
}