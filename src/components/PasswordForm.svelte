<script>
    import SecretKey from '../components/mystore';
	import { BASE_URL, MASTER_PASSWORD_VALIDATE } from '../config';
    import {validateSecretKey} from '../components/util';

	let secretKeyVal = "";
	let password = "";
    let error_message = "";

	SecretKey.subscribe((data) => {
		secretKeyVal = data
    })

    async function updatePassword(){
        //Validate whether password is true. If yes set it 
        let passwordValid = await validateSecretKey(password);
        if(passwordValid){
                SecretKey.update(data => {
                    return password;
                })
                localStorage.setItem("password", password);
        }
        else{
            error_message = "Error!!! Password is incorrect";
        }
    }
</script>
<section>
    <div class="container">
        <div class="header">
            Enter Secret Key for the application
        </div>
        <div class="download-form">
            <div class="form-entry">
                <div class="form-textbox">Secret Key</div>
                <div class="form-inputbox">
                    <input class="inputboxentry" type="text" bind:value={password}>
                </div>
            </div>
            </div>
            <div class="form-entry">
                <div></div>
                <div class="bottom-pane">
                    <div class="err-msg">{error_message}</div>
                    <button class="blue-btn" on:click={async ()=>{updatePassword()}}>Set Secret Key</button>
                </div>
            </div>
        </div>
</section>

<style>
    .container{
        background-color: cream;
        width:1000px;
        margin: 0px auto;
        border:1px solid #36454F;
    }
    .bottom-pane{
        display: grid;
        grid-template-columns: 3fr 2fr;

    }
    .download-form{
        padding-top:20px;
    }
    .err-msg{
        color:red;
    }
    .header{
        font-size: 40px;
        padding-top:10px;
        padding-bottom:10px;
        background-color: #36454F;
        color:wheat;
        text-align: center;
    }
    .form-textbox{
        text-align: right;
        padding-right: 10px;
    }
    .form-entry{
        display: grid;
        grid-template-columns: 1fr 5fr;
        padding-bottom:10px;
    }
    .inputboxentry{
        width: 95%;
        height:20px;
    }
    .blue-btn{
        font-size:20px;
        background-color: #7393B3;
        border:0px;
        padding:10px;
        border-radius: 3px;
        color:white;
        width:90%;
    }
    .blue-btn:hover{
        background-color: crimson;
    }
</style>
