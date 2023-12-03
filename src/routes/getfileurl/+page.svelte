<script>
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, SEND_COMMAND_TO_SLAVE, ACTION_TYPE_GETFILEURL, FILE_DOWNLOAD_SPLIT_DELIMETER, FETCH_MASTER_SLAVE_RESPONSE } from '../../config';
    import Loading from '/src/loading.gif';
    import {clearSlaveResponse} from '../../components/util';

    let mac_address = '';
    let contentLoading = false;
    let url="";
    let filename="";
    let serverResponse = "";
    let myInterval=null;

    let win_width = null;
    let win_height = null;
    let top_pos = null;
    let left_pos = null;
    
    onMount(() => {
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;
        win_width = window.innerWidth;
        win_height = window.innerHeight;
        top_pos = (win_height/2)-200;
        left_pos = (win_width/2)-200;
    });

    function getCommand(){
        return url+FILE_DOWNLOAD_SPLIT_DELIMETER+filename;
    }

    function pollForFileBrowseReplyFromServer(){
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
                serverResponse = data.content;
                
                clearInterval(myInterval);
                clearSlaveResponse(mac_address);
            }
        })
    }

    function sendFileDownloadCommand(){
        const command = getCommand();
        sendRequest(command);
    }

    function sendRequest(payloadCommand){
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'auth_token': localStorage.getItem("password") },
                body: JSON.stringify({ mac: mac_address, type: ACTION_TYPE_GETFILEURL, command: payloadCommand})
            };
        contentLoading = true;
        fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Started polling...");
                myInterval = setInterval(pollForFileBrowseReplyFromServer, 1000);
        });
    }
</script>
<section>
    {#if contentLoading}
        <img src={Loading} style="position:fixed; top:{top_pos}px;left:{left_pos}px"/>
    {/if}
    <div class="container">
        <div class="header">
            File Download for Slave
        </div>
        <div class="download-form">
            <div class="form-entry">
                <div class="form-textbox">URL</div>
                <div class="form-inputbox">
                    <input class="inputboxentry" type="text" bind:value={url}>
                </div>
            </div>
            <div class="form-entry">
                <div class="form-textbox">Filename</div>
                <div class="form-inputbox">
                    <input class="inputboxentry" type="text" bind:value={filename}>
                </div>
            </div>
            <div class="form-entry">
                <div>&nbsp</div>
                <div>
                    <button class="blue-btn" on:click={()=>{sendFileDownloadCommand()}}>Download File</button>
                </div>
            </div>
        </div>
        <div>
            {#if serverResponse!=""}
                {serverResponse}
            {/if}
        </div>
    </div>
</section>

<style>
    .container{
        background-color: cream;
        width:1000px;
        margin: 0px auto;
        max-height:800px;
        min-height:600px;
        border:1px solid #36454F;
    }
    .download-form{
        padding-top:20px;
    }
    .header{
        font-size: 40px;
        padding-top:10px;
        padding-bottom:10px;
        background-color: #36454F;
        color:wheat;
        text-align: center;
    }
    .form-textbox{
        text-align: right;
        padding-right: 10px;
    }
    .form-entry{
        display: grid;
        grid-template-columns: 2fr 4fr;
        padding-bottom:10px;
    }
    .inputboxentry{
        width: 90%;
        height:20px;
    }
    .blue-btn{
        font-size:20px;
        background-color: #7393B3;
        border:0px;
        padding:10px;
        border-radius: 3px;
        color:white;
    }
    .blue-btn:hover{
        background-color: crimson;
    }
</style>
