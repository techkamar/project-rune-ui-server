<script>
    import {all_data} from '../../components/mystore';
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE } from '../../config'

    let mac_address = '';

    onMount(() => {
        console.log(window.innerWidth);
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;

    });




    let command = "";
    let myInterval = null;
    let command_response = "";
    
    function clearSlaveResponse(mac_address){
        let url = `${BASE_URL}${CLEAR_SLAVE_RESPONSE}?mac=${mac_address}`;
        fetch(url).then(response=>response.text())
    }
    function pollForAnswer(){
        console.log(all_data.selected_mac_address)
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;
        fetch(url)
        .then(response => response.json())
        .then(data=>{
            if(data.code==200){
                console.log("Data is ",data)
                command_response = format_by_line(data.content);
                
                clearInterval(myInterval);
                clearSlaveResponse(mac_address);
            }
        })
    }
    function format_by_line(content){
        if(content==undefined){
            return content;
        }

        content = content.replaceAll("\n","<br/>");
        return content;
    }
    function submitCommand(event){
        console.log(event.key)
        if(event.key === 'Enter') {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mac: mac_address, type: 'SHELL', command: command })
            };
            fetch(`${BASE_URL}${SEND_COMMAND_TO_SLAVE}`, requestOptions)
                .then(response => response.json())
                .then(data => {
                    command_response = "Waiting for Slave Response....";
                    myInterval = setInterval(pollForAnswer, 1000);
                });    
            
        }
    }
</script>
<section>
    <div class="container">
        <div class="output">
            {@html command_response}
        </div>
        <input type="text" class="command_box" bind:value={command} on:keydown={(event)=>{submitCommand(event)}} />
    </div>
    <div>
        My MAC is {mac_address}
    </div>
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