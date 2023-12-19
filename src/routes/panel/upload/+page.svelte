<script>
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
<section>
    <div class="container">
        <form id="form">
            <div class="form-container">
                <span>Name </span>
                <input type="text" id="name" name="name" />
            </div>
            <div class="form-container">
                <span>Folder </span>
                <input type="text" id="folder" name="folder" />
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
        width: 50%;
    }
    .form-container{
        display: grid;
        padding-top:10px;
        padding-bottom:10px;
        grid-template-columns: 1fr 1fr;
    }
</style>