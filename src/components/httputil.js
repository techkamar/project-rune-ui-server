export function retrieveGetParamsFromUrl(search_string){
    // Search string looks like this -> ?mac=f8:94:c2:dd:9c:f3

    //Remove first element
    search_string = search_string.substring(1, search_string.length);

    //Split with & to get each parameter
    let search_string_arr = search_string.split("&")

    let params_map = {};
    search_string_arr.forEach(element => {
        let key_val = element.split("=");
        params_map[key_val[0]] = key_val[1];
    });
    return params_map;
}