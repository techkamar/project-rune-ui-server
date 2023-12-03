import { BASE_URL, MASTER_PASSWORD_VALIDATE, CLEAR_SLAVE_RESPONSE } from '../config';
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

export async function validateSecretKey(password){
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password})
    };

    const result =  await fetch(`${BASE_URL}${MASTER_PASSWORD_VALIDATE}`, requestOptions)
    const res_json = await result.json();
    if(res_json.success){
        return true;
    }
    else{
        return false;
    }
}