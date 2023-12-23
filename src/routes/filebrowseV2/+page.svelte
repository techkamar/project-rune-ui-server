<script>
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE, SLAVE_FILE_DOWNLOAD_URL } from '../../config';
    import Folder from '/src/folder.svg';
    import Loading from '/src/loading.gif';
    import GoBackIcon from '/src/goback.png';
    import HomeIcon from '/src/home.png';
    import DownloadButton from '/src/download.png';
    import DeleteButton from '/src/delete.svg';
    import {clearSlaveResponse} from '../../components/util';
    import LogoutBtn from '../../components/Logout.svelte';

    let mac_address = '';
    let ostype = '';
    let win_width = null;
    let win_height = null;
    let top_pos = null;
    let left_pos = null;
    let component_data = {directories:[],files:[],working_dir:"ROOT"}
    let myInterval = null;
    let contentLoading=true;
    let dirSearchValue = "";
    let fileSearchValue = "";

    function filterDirectory(){
        component_data.directories = component_data.directories.filter(dir=>{
            if(dir.toLowerCase().indexOf(dirSearchValue.toLocaleLowerCase()) >= 0){
                return dir;
            }
        })
    }

    function filterFiles(){
        component_data.files = component_data.files.filter(fileEntry=>{
            if(fileEntry.name.toLowerCase().indexOf(fileSearchValue.toLocaleLowerCase()) >= 0){
                return fileEntry;
            }
        })
    }
    
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
                headers: { 'Content-Type': 'application/json' , 'auth_token': localStorage.getItem("password")},
                body: JSON.stringify([{ mac: mac_address, type: 'FILEBROWSE', command: directory}])
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
                headers: { 'Content-Type': 'application/json', 'auth_token': localStorage.getItem("password") },
                body: JSON.stringify([{ mac: mac_address, type: 'FILEDOWNLOAD', command: downloadFileName}])
            };
        contentLoading = true;
        fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                myInterval = setInterval(pollForFileDownloadReplyFromServer, 1000);
        });
    }

    function sendFileRemoveRequest(name){
        if (confirm("Remove "+name+" ?") == true) {
            const deleteFileName = component_data.working_dir=="/"?component_data.working_dir+dir:component_data.working_dir+"/"+name;
            const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'auth_token': localStorage.getItem("password") },
                    body: JSON.stringify([{ mac: mac_address, type: 'FILEREMOVE', command: deleteFileName}])
                };
            contentLoading = true;
            fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    myInterval = setInterval(pollForFileDownloadReplyFromServer, 1000);
            });
        }
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
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;

        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        fetch(url, requestOptions)
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
        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        let url = `${BASE_URL}${SLAVE_FILE_DOWNLOAD_URL}?mac=${mac_address}`;
        fetch(url, requestOptions)
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
        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;
        fetch(url, requestOptions)
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
<LogoutBtn/>
<section>
    {#if contentLoading}
        <img src={Loading} style="position:fixed; top:{top_pos}px;left:{left_pos}px"/>
    {/if}
    <div class="container">
        <div class="top-container">
            <div class="top-left-container">
                <img title="Go back one folder" on:click={()=>goOneDirBack()} src={GoBackIcon} class="navigation-btn"/>
                <img title="Go Home" on:click={()=>sendFileBrowseRequest("ROOT")} src={HomeIcon} class="navigation-btn"/>
            </div>
            <div class="top-right-container">
                <div>Present Working Directory : {component_data.working_dir}</div>
            </div>
        </div>

        <div class="bottom-container">
            <div class="bottom-left-container" style="border:1px solid black">
                <div class="directory_container">
                    <div class="directory_header_container" style="border-bottom:1px solid black">Directories</div>
                    <div>
                        <input type="text" placeholder="Search folders.." bind:value={dirSearchValue}/>
                        <button on:click={()=>{filterDirectory()}}> Go </button>
                    </div>
                    <div class="directory_main_container">
                        {#each component_data.directories as dir, index}
                            <div class="dir_box" on:click={()=>{sendCommand(dir)}}>
                                <div class="folder-img-container"><img src={Folder} width="20px" height="20px"/></div>
                                <div class="dir_entry">{dir}</div>
                            </div>
                        {/each}
                    </div>
                </div>
            </div>
            <div class="bottom-right-container">
                        <div class="files_header" style="border:1px solid black">
                            <div>Name</div>
                            <div>Size</div>
                            <div>Action</div>
                        </div>
                        <div>
                            <input type="text" placeholder="Search files.." bind:value={fileSearchValue}/>
                            <button on:click={()=>{filterFiles()}}> Go </button>
                        </div>
                        {#each component_data.files as {name,size}, index}
                            <div class="file_entry_container">
                                <div style="overflow-wrap: break-word;">{name}</div>
                                <div>{getFormattedSize(size)}</div>
                                <div class="action-btns">
                                    <img src={DownloadButton} class="action-btn-image" on:click={()=>sendFileDownloadRequest(name)} title="Download File"/>
                                    <img src={DeleteButton} class="action-btn-image" on:click={()=>sendFileRemoveRequest(name)} title="Delete File"/>
                                </div>
                            </div>
                        {/each}
            </div>
        </div>
    </div>
</section>

<style>
    .container{
        margin: 30px auto;
        border-radius: 10px;
        border:5px solid black;
        width:90%;
    }
    .top-container{
        display: grid;
        grid-template-columns: 3fr 7fr;
    }
    .bottom-container{
        display: grid;
        grid-template-columns: 3fr 7fr;
    }
    .directory_header_container{
        text-align: center;
        font-size: 21px;
    }
    .dir_box{
        display: flex;
        padding:10px;
        border:1px solid white;
    }

    .dir_box:hover{
        border:1px solid crimson;
        cursor: pointer;
    }
    
    .dir_entry{
        margin-left: 10px;
    }
    .folder-img-container{
        align-items: center;
    }

    .files_header{
        display: grid;
        grid-template-columns: 4fr 1fr 2fr;
        font-size: 21px;
    }
    .file_entry_container{
        display: grid;
        grid-template-columns: 4fr 1fr 2fr;
        border:1px solid white;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .file_entry_container:hover{
        border:1px solid crimson;
        cursor: pointer;
    }
    .action-btns{
        display: flex;
    }
    .action-btn-image{
        margin-left:10px;
    }
    .action-btn-image:hover{
        cursor: pointer;
        transform: scale(1.5);
    }
    .navigation-btn{
        cursor: pointer;
    }
</style>
