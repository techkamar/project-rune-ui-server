<script>
    import LogoutNormal from '../logout.png';
    import LogoutHover from '../logout_hover.png';

    let source = LogoutNormal;

    function mouneEnter(){
        source = LogoutHover;
    }

    function mouneLeave(){
        source = LogoutNormal;
    }
    
    function logout(){
        localStorage.clear();
        window.location.href="/";
    }
</script>
<div>
    <img src={source} class="btn" on:click={()=>{ logout()}}  on:mouseenter={()=>{mouneEnter()}} on:mouseleave={()=>{mouneLeave()}} width="50px" height="50px"/>
</div>

<style>
    .btn{
        position: fixed;
        right:0px;
        margin:1px solid white;
        cursor: pointer;
    }
    .btn:hover{
        margin: 1px solid crimson;
    }
</style>