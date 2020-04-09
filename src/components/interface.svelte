<script>
    
    import interfaces from '../lib/interface.js';
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

        let item = interfaces.Get(id);

        let params = {};

        for(let param of item.params) {
            params[param.key] = param.value;
        }

        HISTORY.set(item);
        
        let res = await fetch(item.path,{
            method: item.method,
            body: (typeof params !== "string") ? JSON.stringify(params) : params,
            headers: item.headers || {},
        }).then(res => {

            REQ_STATUS.set(STATUS_SUCCESS);
            
            item.callback(res);
            
            REQ_MSG.set(res.msg);
            OBJ.set(res.obj);

        }).catch(err => {
            REQ_STATUS.set(STATUS_FAIELD);
            REQ_MSG.set(err);
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
                            <input class="input" type="text" placeholder={param.type} bind:value={param.value}>
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

