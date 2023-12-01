<script>
    import {all_data} from '../../components/mystore';
    import {retrieveGetParamsFromUrl} from '../../components/httputil';
    import { onMount } from 'svelte';
    import { BASE_URL, FETCH_MASTER_SLAVE_RESPONSE, SEND_COMMAND_TO_SLAVE, CLEAR_SLAVE_RESPONSE, SLAVE_FILE_DOWNLOAD_URL } from '../../config';
    import Loading from '/src/loading.gif';

    let mac_address = '';
    let contentLoading = false;
    let url="";
    let filename="";
    
    onMount(() => {
        mac_address=retrieveGetParamsFromUrl(window.location.search).mac;
    });
</script>
<section>
    {#if contentLoading}
        <img src={Loading} style="position:fixed; top:{top_pos}px;left:{left_pos}px"/>
    {/if}
    <div class="container">

    </div>
</section>

<style>
    .container{
        background-color: #272727;
        width:1000px;
        margin: 0px auto;
        max-height:800px;
        min-height:600px;
    }
</style>
