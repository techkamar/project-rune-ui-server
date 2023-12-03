<script>
	import { onMount } from 'svelte';
	import {BASE_URL, FETCH_SLAVES_URI} from '../config';
	import ActiveConnections from '../components/ActiveConnections.svelte';
	import PasswordForm from '../components/PasswordForm.svelte';
	import SecretKey from '../components/mystore';
	
	let secretKeyVal = "";
	let slaves = [];

	$: secretKeyVal && loadData();// If secretKey val changes then trigger load data. Poor ReactJS can't do these :P
	

	SecretKey.subscribe((data) => {
		secretKeyVal = data
    })

	async function loadData() {
		console.log("Secret Val is "+secretKeyVal);
		const res = await fetch(`${BASE_URL}${FETCH_SLAVES_URI}`);
		slaves = await res.json();
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if secretKeyVal==""}
		<PasswordForm/>
	{:else if slaves.length> 0}
		<ActiveConnections {slaves}/>
	{:else}
		<h1> No Connections Yet :| </h1>
	{/if}
</section>

<style>
</style>
