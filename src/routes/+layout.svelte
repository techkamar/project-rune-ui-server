<script>
	
</script>

<div class="app">
	<div class="main">
		<slot />
	</div>
</div>

<style>
	.app {
		min-height: 100vh;
	}

	.main {
		/* flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem; */
		width: 100%;
		margin: 0px auto;
		box-sizing: border-box;
	}
</style>
