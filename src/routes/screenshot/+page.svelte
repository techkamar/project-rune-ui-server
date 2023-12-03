<script>
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, GET_SCREENSHOT_FROM_SLAVE, SLAVE_SCREENSHOT_EXISTS, SEND_COMMAND_TO_SLAVE, SLAVE_SCREENSHOT_DELETE } from '../../config'

    let mac_address = '';
    let screenshot_recieved = false;
    let screenshot_url = null;
    let myInterval = null;

    function pollForAnswer(){
        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        fetch(`${BASE_URL}${SLAVE_SCREENSHOT_EXISTS}?mac=${mac_address}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                if(data.code == 200){
                    clearInterval(myInterval);
                    screenshot_recieved = true;
                }
            });
    }

    function deleteScreenshot(){
        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        fetch(`${BASE_URL}${SLAVE_SCREENSHOT_DELETE}?mac=${mac_address}`, requestOptions)
            .then(response => response)
            .then(data => {
                alert("Screenshot Deleted");
            });
    }

    onMount(() => {
        console.log(window.innerWidth);
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;
        screenshot_url = BASE_URL+GET_SCREENSHOT_FROM_SLAVE+"?mac="+mac_address;

        //Trigger Screenshot command for user
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'auth_token': localStorage.getItem("password") },
            body: JSON.stringify({ mac: mac_address, type: 'SCREENSHOT', command: "SCREENSHOT" })
        };
        fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
            .then(response => response.json())
            .then(data => {
                myInterval = setInterval(pollForAnswer, 2000);
            });

    });
</script>


<section>
    {#if screenshot_recieved}
        <div>
            <h1> Screenshot Obtained is </h1>
            <img src="{screenshot_url}" alt="Image missing">
            <div>
                <button on:click={()=>{deleteScreenshot()}}> Delete Screenshot </button>
            </div>
        </div>
    {:else}
	    <h1> Waiting for Server Reponse</h1>
    {/if}

</section>

<style>
    .container{
        width:800px;
        margin: 0px auto;
        background-color: aqua;
        border: 0px;
        padding:10px;
    }
    .output{
        height:600px;
        background-color: white;
        padding-left:20px;
        overflow-y: scroll;
    }
    .command_box{
        height:100px;
        width: 98%;
        background-color: black;
        color:white;
    }
</style>