<script>
    
    import interfaces from '../lib/interface.js';
    import Ctx from '../lib/ctx.js';
    import {HISTORY,SIGNAL} from '../service.js';
    import { onMount } from 'svelte';
    import Info from './info.svelte';

    export let item;

    const STATUS_DEFAULT = "is-default";
    const STATUS_SUCCESS = "is-success";
    const STATUS_FAIELD = "is-danger";

    let MSG_REQ = "";
    let MSG_RES = "";

    let REQ_STATUS = STATUS_DEFAULT;
    let RES_STATUS = STATUS_DEFAULT;

    let RESULT = "";

    SIGNAL.subscribe(msg => {
        if(msg == "start_" + item.id) {
            Submit.call(item.el.querySelector(".is-submit"));
        }
    });

    async function Submit(){
        const that = this;

        REQ_STATUS = STATUS_DEFAULT;
        RES_STATUS = STATUS_DEFAULT;
        
        MSG_REQ = "";
        MSG_RES = "";

        let id = that.getAttribute("data-id");

        let item = interfaces.GetById(id);

        HISTORY.set(item);

        if(item.method == "ws://") {
            await dealWs(item);
        } else {
            await dealHttp(item)
        }
    }

    async function dealWs(item){
        let ws = new WebSocket(item.method + item.path);

        let ctx  = new Ctx();
        // ctx.setOutput(RES_MSG);

        ws.onmessage = (ret)=>{
            ctx.body = ret.data;
            item.callback(ctx);
            MSG_RES = ctx.body
        }

        ws.onclose = () => {
            RES_STATUS = STATUS_FAIELD;
            MSG_RES = "ws disconnec.";
        }
        SIGNAL.set("rd_" + item.id);
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

        await fetch(item.path,{
            method: item.method,
            body: (typeof params !== "string") ? JSON.stringify(params) : params,
            headers: Object.assign(item.headers || {},headers),
        }).then(async res => {

            if(res.status == 200) {
                REQ_STATUS = STATUS_SUCCESS;
                MSG_REQ = "success";
            } else {
                REQ_STATUS = STATUS_FAIELD
            }
            
            let ctx  = new Ctx(res);

            ctx.body = await res.text();
            
            try {
                ctx.body = JSON.parse(ctx.body);
            } catch(e) { console.log(e) }

            item.res = ctx.body;
            item.parseRes()

            RESULT = item.res;
            
            if(!!item.callback) {
                await item.callback(ctx);
                MSG_RES = ctx.msg;
            }
            RES_STATUS = ctx.status === false ? STATUS_FAIELD : STATUS_SUCCESS
            // OBJ.set(JSON.stringify(ctx.obj));

        }).catch(err => {
            REQ_STATUS = STATUS_FAIELD
            MSG_REQ = err;
        });

        SIGNAL.set("rd_" + item.id);
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

    // TODO: 提交后，展示一个 res payload 的框，里面有 res 的 data

</script>

<div class="card" bind:this={item.el}>
    <header class="card-header">
        <p class="card-header-title is-5">
            {item.readme || ""}
            <br>
            {item.method} {item.path}
        </p>
    </header>
    <div class="card-content">
        {#each item.params as param}
            <div class="field is-horizontal">
                <div class="field-label is-normal">
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
                                <input class="input" type="text" placeholder="{param.type} {param.remark}" bind:value={param.value}>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div class="card-content">
        <p class="notification {REQ_STATUS}">Req: {MSG_REQ}</p>
        <p class="notification {RES_STATUS}">Res: {MSG_RES}</p>
    </div>
    {#if !!RESULT}
    <Info id={item.id} items={RESULT} />
    {/if}
    <footer class="card-footer">
        <a class="card-footer-item is-success is-submit" on:click={Submit} data-id={item.id}>
            提交
        </a>
        <a class="card-footer-item is-info" on:click={Empty}>
            重置
        </a>
    </footer>
</div>
<style>
    .notification {
        word-break: break-all; 
    }
</style>
