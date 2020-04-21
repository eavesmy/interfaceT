<script>
    import interfaces from '../lib/interface.js';

    import Info from './info.svelte';

    export let items;
    export let id;

    let _id = null;

    function Submit(){
        interfaces[id].res = items;
        alert("提交完毕");
    }
</script>

<div class="card-content">
    {#each items as item}
        <div class="columns">
            <div class="column">
                <b>{item.key}</b> 
            </div>
            {#if item.type !== "array" && item.type !== "object"}
                <div class="column is-half">
                    {item.val}
                </div>
                <div class="column">
                    <input class="input is-small" type="text" placeholder="{item.key} 描述" bind:value={item.remark}>
                </div>
            {:else}
               <Info id={_id} items={item.val} />
            {/if}
        </div>
    {/each}
    {#if !!id}
        <button class="button is-success" on:click={Submit}>
            提交描述
        </button>
    {/if}
</div>

<style>
</style>
