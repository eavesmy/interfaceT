<script>
    import {navigate} from 'svelte-routing';
    import { DOC,SIGNAL } from '../service.js';
    import Interface from '../lib/interface.js';

    import marked from 'marked';
    window.Interface = Interface;

    let interfaces;

    let readme = `说明文档: https://github.com/eavesmy/interfaceT `

    import C_HISTORY from './history.svelte';
    import C_INTERFACE from './interface.svelte';

    function ReadFile(){
        let file = this.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
            try {
                eval(e.target.result);
            } catch(e) {
                if(!!e) console.log(e);
            }
            interfaces = Interface;
        }
    }

    function Reset(){
        interfaces = null;
        Interface.Empty();
    }

    function GenerateInterface(){

        let list = interfaces.List();
        let text = ``;

        for(let item of list) {
            let doc = item.GenerateDoc();
            text += doc
            text + "\n"
        }
        DOC.set(text);
        navigate("/doc");
    }

    async function TestAll(){
        let items = interfaces.List();
        let _it = it(items);
        
        let item = _it.next().value;
        SIGNAL.set("start_" + item.id);

        SIGNAL.subscribe(msg => {
            if(msg !== "rd_" + item.id) {
                return
            }

            item = _it.next().value;

            if(!item) return // 处理完毕

            SIGNAL.set("start_" + item.id);
        })
    }

    function *it(list){
        for(let item of list){
            yield item
        }
    }
 
</script>

<div>
    <navbar class="navbar is-dark">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
               模拟接口测试
            </a>
        </div>
    </navbar>
    <div class="content">
        <div class="container">
            <div class="content"></div>
            <div class="columns">
                <div class="column is-4">
                    <C_HISTORY />
                    <div class="content"></div>
                    <div class="card">
                        <header class="card-header">
                            <p class="card-header-title">
                                TODO
                            </p>
                        </header>
                        <div class="card-content">
                            <ul>
                            <li>
                                支持自动测试
                            </li>
                            <li>
                                完善ws相关
                            </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="column is-8" id="interface">
                    {#if !!interfaces}
                        <div class="container buttons">
                            <button class="button is-warning" on:click={Reset}>
                                重新读取配置
                            </button>
                            <button class="button is-success" on:click={GenerateInterface}>生成接口文档</button>
                            <button class="button is-success" on:click={TestAll}>顺序测试</button>
                        </div>
                        {#each interfaces.List() as item}
                            <C_INTERFACE item={item}/>
                            <div class="content"></div>
                        {/each}
                    {:else}
                        <div class="card">
                            <header class="card-header">
                                <p class="card-header-title">
                                    提交测试文件
                                </p>
                            </header>
                            <div class="card-content">
                                <div class="file">
                                    <label class="file-label">
                                        <input class="file-input" type="file" name="resume" on:change={ReadFile}>
                                        <span class="file-cta">
                                            <span class="file-label">
                                                Choose a file...
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <div class="content"></div>
                                <p>
                                    {@html marked(readme)}
                                </p>
                            </div>
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    #interface{
        height: 80vh;
        overflow-y: scroll;
    }
</style>
