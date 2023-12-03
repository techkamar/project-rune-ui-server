<script>
	import { onMount } from 'svelte';
	import {BASE_URL, FETCH_SLAVES_URI} from '../config';
	import ActiveConnections from '../components/ActiveConnections.svelte';
	let slaves = [];

	onMount(async () => {
		const res = await fetch(`${BASE_URL}${FETCH_SLAVES_URI}`);
		slaves = await res.json();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if slaves.length> 0}
		<ActiveConnections {slaves}/>
	{:else}
		<h1> No Connections Yet :| </h1>
	{/if}
</section>

<style>
</style>
