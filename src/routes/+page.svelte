<script>
	import {BASE_URL, FETCH_SLAVES_URI} from '../config';
	import ActiveConnections from '../components/ActiveConnections.svelte';
	import PasswordForm from '../components/PasswordForm.svelte';
	import SecretKey from '../components/mystore';
	import {validateSecretKey} from '../components/util';
	
	let secretKeyVal = "";
	let slaves = [];

	$: secretKeyVal && loadData();// If secretKey val changes then trigger load data. Poor ReactJS can't do these :P
	

	SecretKey.subscribe((data) => {
		secretKeyVal = data
    })

	async function loadData() {
		const requestOptions = {
                method: 'GET',
                headers: { 'auth_token': secretKeyVal },
        };
		const res = await fetch(`${BASE_URL}${FETCH_SLAVES_URI}`, requestOptions);
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
