<script>
    export let slaves;
	let mac = '';
	import {all_data} from './mystore.js';
	import {secondsToHms} from '../components/util.js';
	import {ONLINE_SECONDS_THRESHOLD} from '../config.js';
	import { BASE_URL, GET_SCREENSHOT_FROM_SLAVE } from '../config.js'

    function getLastSeenInSeconds(timestamp){
		let seconds = (new Date().getTime()/1000)-timestamp;
		seconds = seconds.toFixed(2);
		return secondsToHms(seconds);
	}

	function getOnlineStatus(timestamp){
		let seconds = (new Date().getTime()/1000)-timestamp;
		seconds = seconds.toFixed(2);

		if(seconds < ONLINE_SECONDS_THRESHOLD){
			return '<div style="background-color:green;color:white;padding:10px">ONLINE</div>';
		}
		else{
			return '<div style="background-color:red;color:white;padding:10px">OFFLINE</div>';
		}
	}

	function getScreenShot(mac){
		window.location.href="/screenshot?mac="+mac;
	}

	async function runShellCommand(mac){
		window.location.href="/shell?mac="+mac;
	}

	async function runFileBrowseCommand(mac,ostype){
		window.location.href="/filebrowse?mac="+mac+"&ostype="+ostype;
	}
</script>
<section>
	<h1 class="banner"> List of connections </h1>
	<table class="conn_list">
		<tr>
		  <th>IP Address</th>
		  <th>Username</th>
		  <th>MAC Address</th>
		  <th>Hostname</th>
		  <th>OS</th>
		  <th>Last Seen </th>
		  <th>Status </th>
		  <th>Shell </th>
		  <th>File Browser </th>
		  <th>Screenshot </th>
		</tr>
		{#each slaves as { ip, username, mac, hostname, os, ostype, timestamp }, i}
		<tr>
			<td class="dark">{ip}</td>
			<td class="light">{username}</td>
			<td class="dark">{mac}</td>
			<td class="light">{hostname}</td>
			<td class="dark">{os}</td>
			<td class="light">{getLastSeenInSeconds(timestamp)}</td>
			<td>
				{@html getOnlineStatus(timestamp)}
			</td>
			<td>
				<button  class="redbtn"   on:click={()=>{runShellCommand(mac)}}>Run Shell</button>
			</td>
			<td>
				<button class="redbtn" on:click={()=>{runFileBrowseCommand(mac,ostype)}}>Browse File </button>
			</td>
			<td>
				<button  class="redbtn"   on:click={()=>{getScreenShot(mac)}}>Screenshot</button>
			</td>
		  </tr>
		{/each}
	  </table> 
</section>

<style>
	.banner{
		font-family: 'Open Sans', sans-serif;
	}
	.conn_list{
		border: 0px;
	}
	td{
		border:0px solid;
		font-family: 'Roboto', sans-serif; 
		padding: 10px;
	}
	th{
		border:0px;
		background-color: #fac146;
		font-family: 'Roboto', sans-serif; 
		padding: 10px;
	}
	.dark{
		background-color: #0ad8f7;
	}
	.light{
		background-color: #82ffea;
	}
	.redbtn{
		background-color: black;
		color:whitesmoke;
		padding:10px;
		border-radius: 4px;
		border:0px;
	}
	.redbtn:hover{
		background-color:crimson;
	}
</style>
