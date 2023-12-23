<script>
    import LogoutBtn from '../../../components/Logout.svelte';
    import {BASE_URL, ADMIN_FILE_UPLOAD} from '../../../config';
    async function uploadFile(event){
        event.preventDefault();
        const data = new FormData(form);
        console.log(Array.from(data));
        const url = `${BASE_URL}${ADMIN_FILE_UPLOAD}`;
        try {
            const res = await fetch(
                url,
                {
                    method: 'POST',
                    body: data,
                    headers: { 'auth_token': localStorage.getItem("password") }
                },
            );
            const resData = await res.json();
            alert(resData["message"]);
        } catch (err) {
            console.log(err.message);
        }
    }
</script>
<LogoutBtn/>
<section>
    <div class="container">
        <form id="form">
            <div class="form-container">
                <span>Name </span>
                <input type="text" id="name" name="name" />
            </div>
            <div class="form-container">
                <span>Folder </span>
                <select name="folder" id="folder">
                    <option value="win">WIN</option>
                  </select>
            </div>
            <div class="form-container">
                <span>File </span>
                <input type="file" id="file" name="file" />
            </div>
            <div class="form-container">
                <span></span>
                <button type="submit" id="submit-btn" on:click = {(e)=>{uploadFile(e)}}>Upload File</button>
            </div>
        </form>
    </div>
</section>

<style>
    .container{
        margin: 0px auto;
        width: 40%;
    }
    .form-container{
        display: grid;
        padding-top:10px;
        padding-bottom:10px;
        grid-template-columns: 1fr 1fr;
    }
    button {
    --c:  #229091; /* the color*/
    
    box-shadow: 0 0 0 .1em inset var(--c); 
    --_g: linear-gradient(var(--c) 0 0) no-repeat;
    background: 
        var(--_g) calc(var(--_p,0%) - 100%) 0%,
        var(--_g) calc(200% - var(--_p,0%)) 0%,
        var(--_g) calc(var(--_p,0%) - 100%) 100%,
        var(--_g) calc(200% - var(--_p,0%)) 100%;
    background-size: 50.5% calc(var(--_p,0%)/2 + .5%);
    outline-offset: .1em;
    transition: background-size .4s, background-position 0s .4s;
    }
    button:hover {
    --_p: 100%;
    transition: background-position .4s, background-size 0s;
    }
    button:active {
    box-shadow: 0 0 9e9q inset #0009; 
    background-color: var(--c);
    color: #fff;
    }
</style>