<script>
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE, SLAVE_FILE_DOWNLOAD_URL } from '../../config';
    import Folder from '/src/folder.svg';
    import Loading from '/src/loading.gif';
    import {clearSlaveResponse} from '../../components/util';

    let mac_address = '';
    let ostype = '';
    let win_width = null;
    let win_height = null;
    let top_pos = null;
    let left_pos = null;
    let component_data = {directories:[],files:[],working_dir:"ROOT"}
    let myInterval = null;
    let contentLoading=true;

    onMount(() => {
        console.log(window.innerWidth);
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;
        ostype=retrieveGetParamsFromUrl(window.location.search).ostype;

        win_width = window.innerWidth;
        win_height = window.innerHeight;
        top_pos = (win_height/2)-200;
        left_pos = (win_width/2)-200;


        //Send Request and get response
        sendFileBrowseRequest("ROOT");
    });

    function sendFileBrowseRequest(directory){
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mac: mac_address, type: 'FILEBROWSE', command: directory})
            };
        contentLoading = true;
        fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                myInterval = setInterval(pollForFileBrowseReplyFromServer, 1000);
        });
    }

    function sendCommandWindows(dir){
	if(component_data.working_dir==""){
            sendFileBrowseRequest(dir);
        }else{
            sendFileBrowseRequest(component_data.working_dir+"/"+dir);
        }
    }
    function sendCommandOthers(dir){
	if(component_data.working_dir=="/"){
            sendFileBrowseRequest(component_data.working_dir+dir);
        }else{
            sendFileBrowseRequest(component_data.working_dir+"/"+dir);
        }
    }
    function sendCommand(dir){
        if(ostype=="WIN"){
	    sendCommandWindows(dir)
	}
	else{
	    sendCommandOthers(dir)
	}
    }

    function getReverseString(mystring){
        return [...mystring].reverse().join("");
    }
    function goOneDirBackLinux(){
        if(component_data.working_dir!="/"){
            const reverse_directory = getReverseString(component_data.working_dir);
            console.log("Reverse Directory = ", reverse_directory);
            const slash_location = reverse_directory.search("/");
            let required_directory = component_data.working_dir.substring(0,reverse_directory.length-(slash_location+1))
            if(required_directory==""){
                // Root Special Case handled
                required_directory="/"
            }
            sendFileBrowseRequest(required_directory);
        }
    }

    function goOneDirBackWindows(){
        if(component_data.working_dir!=""){
            const reverse_directory = getReverseString(component_data.working_dir);
            console.log("Reverse Directory = ", reverse_directory);
            const slash_location = reverse_directory.search("/");
            let required_directory = component_data.working_dir.substring(0,reverse_directory.length-(slash_location+1))
            if(required_directory.length==2 && required_directory.substring(1)==":"){
                // Root Special Case handled
                required_directory="ROOT"
            }
            sendFileBrowseRequest(required_directory);
        }
    }

    function goOneDirBack(){
	if(ostype!="WIN"){
	    goOneDirBackLinux();
	}
        else{
            goOneDirBackWindows();
        }
    }

    function getFormattedSize(size){
        const kilobyte = size/1024;
        const megabyte = size/(1024*1024);
        const gigabyte = size/(1024*1024*1024);

        let response = "";

        if(gigabyte>=1){
            response+=gigabyte.toFixed(2)+" GB "
            return response;
        }

        if(megabyte>=1){
            response+=megabyte.toFixed(2)+" MB "
            return response;
        }

        if(kilobyte>=1){
            response+=kilobyte.toFixed(2)+" KB "
            return response;
        }
        else{
            response+=size+" Bytes "
            return response;
        }
    }
    function sendFileDownloadRequest(name){
        const downloadFileName = component_data.working_dir=="/"?component_data.working_dir+dir:component_data.working_dir+"/"+name;
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mac: mac_address, type: 'FILEDOWNLOAD', command: downloadFileName})
            };
        contentLoading = true;
        fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                myInterval = setInterval(pollForFileDownloadReplyFromServer, 1000);
        });
    }

    function setComponentData(data){
	if(ostype=="WIN"){
	   if(data.working_dir == "ROOT"){
	      data.working_dir = "";
	   }  
	}
	component_data = data;
    }

    function pollForFileBrowseReplyFromServer(){
        console.log(all_data.selected_mac_address)
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;
        fetch(url)
        .then(response => response.json())
        .then(data=>{
            if(data.code==200){
                contentLoading = false;
                console.log("Data is ",data)
                setComponentData(data)
                
                clearInterval(myInterval);
                clearSlaveResponse(mac_address);
            }
        })
    }

    function performFileDownload(mac_address, filename){
        let url = `${BASE_URL}${SLAVE_FILE_DOWNLOAD_URL}?mac=${mac_address}`;
        fetch(url)
        .then((result) => {
            console.log("Result is ",result)
            if (!result.ok) {
                throw Error(result.statusText);
            }
    
            return result.blob();
        })
        .then((blob) => {
            if (blob != null) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();

                // Clear Interval
                clearSlaveResponse(mac_address);
            }
        })
        .catch((err) =>
        {
            console.log(err);
        });
    }

    function pollForFileDownloadReplyFromServer(){
        console.log(all_data.selected_mac_address)
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;
        fetch(url)
        .then(response => response.json())
        .then(data=>{
            if(data.code==200){
                contentLoading = false;

                //File is ready. Now trigger the actual download
                performFileDownload(mac_address, data.file);

                clearInterval(myInterval);
            }
        })
    }
</script>
<section>
    {#if contentLoading}
        <img src={Loading} style="position:fixed; top:{top_pos}px;left:{left_pos}px"/>
    {/if}
    <div class="container">
        <div class="heading_container">
            <button on:click={()=>goOneDirBack()}>Go Back</button>
            <div style="padding-left:20px">{component_data.working_dir}</div>
        </div>
        <div class="body_container">
            <div class="directory_container">
                <div class="directory_header_container">Directories</div>
                <div class="directory_main_container">
                    {#each component_data.directories as dir, index}
                        <div class="dir_box">
                            <div style="float:left"><img src={Folder} width="20px" height="20px"/></div>
                            <div class="dir_entry"  on:click={()=>{sendCommand(dir)}}>{dir}</div>
                        </div>
	                {/each}
                </div>
            </div>
            <div class="files_container">
                <div class="files_main_container">
                    <div class="files_header">
                        <div>Name</div>
                        <div>Size</div>
                        <div>Action</div>
                    </div>
                    <div class="files_body_container">
                        {#each component_data.files as {name,size}, index}
                            <div class="file_entry_container">
                                <div>{name}</div>
                                <div>{getFormattedSize(size)}</div>
                                <div class="file_action_btn" on:click={()=>sendFileDownloadRequest(name)}>Download</div>
                            </div>
	                    {/each}
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .container{
        background-color: #272727;
        width:1000px;
        margin: 0px auto;
        max-height:800px;
        min-height:600px;
    }
    .files_container{
        background-color: #272727;
        color:white;
        overflow-y:scroll;
        margin-right:10px;
    }
    .file_action_btn{
        border:1px solid white;
        color:white;
        border-radius: 3px;
        text-align: center;
    }
    .file_action_btn:hover{
        background-color: #b34cb3;
        cursor:pointer;
    }
    .dir_entry{
        background-color: #2c2c2c;
        color:white;
        padding-left: 20px;
        border-radius: 2px;
        margin:3px;
    }
    .dir_entry:hover{
        background-color: #b34cb3;
    }
    .dir_box{
        padding-left:5px;
    }
    .dir_box:hover{
        background-color: #b34cb3;
        color: white;
        cursor:pointer;
    }
    .heading_container{
        background-color: aqua;
        display: grid;
        grid-template-columns: 1fr 5fr;
    }
    .directory_container{
        background-color: #2c2c2c;
        color:white;
        overflow-y:scroll;
        max-height:600px;
    }
    .files_body_container{
        max-height:600px;
    }
    .body_container{
        display: grid;
        grid-template-columns: 1fr 5fr;
    }
    .file_entry_container{
        display: grid;
        grid-template-columns: 4fr 1fr 1fr;
    }
    .file_entry_container:hover{
        background-color: #6082B6;
    }

    .files_header{
        display: grid;
        grid-template-columns: 4fr 1fr 1fr;
    }
    .files_header{
        font-weight:bold;
    }
    .directory_header_container{
        font-weight: bold;
    }
</style>
