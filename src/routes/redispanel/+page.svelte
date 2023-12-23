<script>
    import {BASE_URL, REDIS_DATA_URL} from '../../config';
    import { onMount } from 'svelte';
    import LogoutBtn from '../../components/Logout.svelte';
    
    let allData = [];
    function getTableRowDivClass(i){
        if(i%2==0){
            return "content-odd-row";
        }
        return "content-even-row";

    }
    
    function getAllData(){
        const requestOptions = {
            method: 'GET',
            headers: { 'auth_token': localStorage.getItem("password") },
        };
        let url = `${BASE_URL}${REDIS_DATA_URL}`;
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(data=>{
            allData = data;
        })
    }

    function deleteKey(key){
        var r = confirm(`Do you want to delete key ${key}`);  
        if (r == true) {
            const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' ,'auth_token': localStorage.getItem("password") },
            body: JSON.stringify({ key: key})
            };
            let url = `${BASE_URL}${REDIS_DATA_URL}`;
            fetch(url, requestOptions)
            .then(response => response.json())
            .then(data=>{
                getAllData();
            })    
        } else {    
        }  
        
    }

    onMount(() => {
        getAllData();
    });
</script>
<LogoutBtn/>
<section>
    <div class="container">
        <div class="header">
            <h1 align="center"> [ Redis Control Panel ]</h1>
        </div>
        <div class="content-heading">
            <div class="row">
                <div>SL NO</div>
                <div>Key </div>
                <div>Value</div>
                <div>Action</div>
            </div>
        </div>
        {#each allData as { key,value }, i}
            <div class={getTableRowDivClass(i)}>
                <div class="row">
                    <div>{i+1}</div>
                    <div>{key} </div>
                    <div>{value}</div>
                    <div><button on:click={()=>{deleteKey(key)}}>DELETE</button></div>
                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    .container{
        width:80%;
        margin: 0px auto;
    }
    .row{
        border: 0px;
        display: grid;
        grid-template-columns: 1fr 3fr 5fr 1fr;
    }
    .content-heading{
        padding: .5rem .5rem;
        background-color: #bbd6fe;
        background-image: linear-gradient(var(--bs-table-accent-bg),var(--bs-table-accent-bg));
        border-bottom-width: 1px;
    }
    .content-odd-row{
        padding: .5rem .5rem;
        background-color: rgba(0, 0, 0, 0.05);
        background-image: linear-gradient(rgba(0, 0, 0, 0.05),rgba(0, 0, 0, 0.05));
        border-bottom-width: 1px;
    }
    .content-even-row{
        padding: .5rem .5rem;
        background-color: transparent;
        background-image: linear-gradient(rgba(0, 0, 0, 0.05),rgba(0, 0, 0, 0.05));
        border-bottom-width: 1px;
    }
</style>