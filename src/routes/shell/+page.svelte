<script>
    
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE } from '../../config'
    import Switch from '../../components/Switch.svelte';

    let mac_address = '';
    let secret_key = "";
    let shellTypeSwitchSelection;
    $: commandType = shellTypeSwitchSelection == "Command"? "SHELL":"POWERSHELL";
    
    onMount(() => {
        console.log(window.innerWidth);
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;
        secret_key = localStorage.getItem("password");

    });




    let command = "";
    let myInterval = null;
    let command_response = "";
    
    function clearSlaveResponse(mac_address){
        let url = `${BASE_URL}${CLEAR_SLAVE_RESPONSE}?mac=${mac_address}`;
        const requestOptions = {
                method: 'GET',
                headers: { 'auth_token': secret_key },
        };
        
        fetch(url, requestOptions).then(response=>response.text());
    }
    function pollForAnswer(){
        let url = `${BASE_URL}${FETCH_MASTER_SLAVE_RESPONSE}?mac=${mac_address}`;

        const requestOptions = {
                method: 'GET',
                headers: { 'auth_token': secret_key },
        };

        fetch(url, requestOptions)
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
                headers: { 'Content-Type': 'application/json', 'auth_token': secret_key },
                body: JSON.stringify({ mac: mac_address, type: commandType , command: command })
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
	<div class="shell_toggle">
		<Switch bind:value={shellTypeSwitchSelection} label="Choose Type of Shell" design="multi" options={['Command', 'Powershell']} fontSize={21}/>
	</div>
        <div class="output">
            {@html command_response}
        </div>
        <input type="text" class="command_box"  placeholder="Enter Shell Command Here..."  bind:value={command} on:keydown={(event)=>{submitCommand(event)}} />
    </div>
</section>

<style>
    .container{
        width:800px;
        margin: 0px auto;
        background-color: #36454F;
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
        width: 99%;
        background-color: black;
        color:white;
    }
</style>
