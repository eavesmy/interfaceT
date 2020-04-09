<script>
    import { onMount } from 'svelte';
    import { HISTORY } from '../service.js';

    let history = [];
    const store = localStorage;

    HISTORY.subscribe(item => {

        if(!item.id) return

        let _item = Object.assign({},item);
        _item.callback= (item.callback || function(){}).toString();
        _item = JSON.stringify(_item);
        
        let list = store.getItem("history");
        if(!list) list = "[]";
            
        list = JSON.parse(list);
        list.push(_item);

        history.push(item);
        history = history;

        store.setItem("history",JSON.stringify(list));
    });
    
    onMount(()=>{
        history = store.getItem("history");

        if(!history) {
            history = "[]"
        }

        history = JSON.parse(history);
        
        let arr = [];
        for(let item of history) {
            item = JSON.parse(item);
            item.callback = eval(item.callback);
            arr.push(item);
        }
        history = arr;
    });

    function Empty(){
        history = [];
        store.setItem("history","");
    }

</script>

<div class="card">
    <header class="card-header">
        <div class="container level">
            <div class="level-left">
                <p class="card-header-title">
                        记录 
                </p>
            </div>
            <div class="level-item">
                <button class="button is-small is-primary" on:click={Empty}>
                    清空
                </button>
            </div>
        </div>
    </header>
    <div class="card-content">
        {#each history as item}
            <div>
                {item.method} {item.path}
            </div>
        {/each}
    </div>
</div>
