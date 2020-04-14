<script>
    
    import interfaces from '../lib/interface.js';
    import Ctx from '../lib/ctx.js';
    import {OBJ, HISTORY, REQ_MSG,RES_MSG,REQ_STATUS,RES_STATUS } from '../service.js';

    export let item;

    const STATUS_DEFAULT = "is-default";
    const STATUS_SUCCESS = "is-success";
    const STATUS_FAIELD = "is-danger";

    let MSG_REQ = "";
    let MSG_RES = "";

    async function Submit(){
        const that = this;

        REQ_STATUS.set(STATUS_DEFAULT);
        RES_STATUS.set(STATUS_DEFAULT);
        
        MSG_REQ = "";
        MSG_RES = "";

        let id = that.getAttribute("data-id");

        let item = interfaces.GetById(id);

        HISTORY.set(item);

        if(item.method == "ws://") {
            dealWs(item);
        } else {
            dealHttp(item)
        }
    }

    async function dealWs(item){
        let ws = new WebSocket(item.method + item.path);

        let ctx  = new Ctx();

        ctx.setOutput(RES_MSG);

        ws.onmessage = (ret)=>{
            ctx.body = ret.data;
            item.callback(ctx);
        }

        ws.onclose = () => {
            RES_STATUS.set(STATUS_FAIELD);
            RES_MSG.set("ws disconnec.");
        }
    }

    async function dealHttp(item){
        let headers = Interface.GetHeaders();

        let params = {};

        for(let param of item.params) {
            
            if(param.type == "file") {
                if(param.value.files && param.value.files[0]) {
                    let reader = new FileReader();
                    reader.readAsDataURL(param.value.files[0]);
                    await AsyncRead(reader);
                    param.value = reader.result;
                } 
            }

            params[param.key] = param.value;
        }

        let res = await fetch(item.path,{
            method: item.method,
            body: (typeof params !== "string") ? JSON.stringify(params) : params,
            headers: Object.assign(item.headers || {},headers),
        }).then(async res => {

            if(res.status == 200) {
                REQ_STATUS.set(STATUS_SUCCESS);
                REQ_MSG.set("success");
            } else {
                REQ_STATUS.set(STATUS_FAIELD);
            }

            let ctx  = new Ctx(res);
            
            await item.callback(ctx);
            
            RES_MSG.set(ctx.msg);
            RES_STATUS.set(ctx.status === false ? STATUS_FAIELD : STATUS_SUCCESS)

            OBJ.set(JSON.stringify(ctx.obj));

        }).catch(err => {
            REQ_STATUS.set(STATUS_FAIELD);
            REQ_MSG.set(err);
        });
    }

    function AsyncRead(reader) {
        return new Promise(re => {
            reader.onload = ret => {
                re(ret.target);
            }
        });
    }

    function Empty(){
        for(let _item of item.params) {
            _item.value = "";
        }
        item = item;
    }

</script>

<div class="card">
    <header class="card-header">
        <p class="card-header-title is-5">
            {item.method} {item.path}
        </p>
    </header>
    <div class="card-content">
        {#each item.params as param}
            <div class="field is-horizontal">
                <div class="field-label is-normarl">
                    <label class="label">
                        {param.key}
                    </label>
                </div>
                <div class="field-body">
                    <div class="field">
                        <div class="control is-expanded">
                            {#if param.type == "file"}
                            <div class="file">
                                  <label class="file-label">
                                    <input class="file-input" type="file" name="resume" bind:this={param.value}>
                                    <span class="file-cta">
                                      <span class="file-icon">
                                        <i class="fas fa-upload"></i>
                                      </span>
                                      <span class="file-label">
                                        Choose a file…
                                      </span>
                                    </span>
                                  </label>
                                </div>
                            {:else}
                                <input class="input" type="text" placeholder={param.type} bind:value={param.value}>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <footer class="card-footer">
        <a class="card-footer-item is-success" on:click={Submit} data-id={item.id}>
            提交
        </a>
        <a class="card-footer-item is-info" on:click={Empty}>
            重置
        </a>
    </footer>
</div>

