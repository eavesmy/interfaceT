<script>
	export let name;
    
    import marked from 'marked';
    import Interface from './lib/interface.js';

    window.Interface = Interface;

    let interfaces;

    let readme = `
const HOST = "http://127.0.0.1:8080";

Interface.Register({    
   method: POST,     
   path: HOST + "/user/register",    
   params: {     
        phone: String,    
        email: String,    
        pwd: String,    
        inviteCode: String,    
   },      
   headers: {},     
   callback: async ctx => {      
    ctx = await ctx.json();     
    ctx.msg = "会展示到左面res中";    
    ctx.obj = {
        show: "该键值对会放到变量对象中"
    }
   }      
});        
    `

    import C_STATUS from './components/status.svelte';
    import C_INFO from './components/info.svelte';
    import C_HISTORY from './components/history.svelte';
    import C_INTERFACE from './components/interface.svelte';

    function ReadFile(){
        let file = this.files[0];
        let reader = new FileReader();
        reader.readAsText(file);

        reader.onload = (e) => {
            eval(e.target.result);
            interfaces = Interface;
        }
    }

    function Reset(){
        interfaces = null;
        Interface.Empty();
    }
    
</script>

<main>
    <navbar class="navbar is-dark">
        <div class="navbar-brand">
            <a class="navbar-item" href="/">
               {name} 
            </a>
        </div>
    </navbar>
    <div class="content">
        <div class="container">
            <div class="content"></div>
            <div class="columns">
                <div class="column is-4">
                    <C_STATUS />
                    <div class="content"></div>
                    <C_INFO />
                    <div class="content"></div>
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
                                完善记录详情
                            </li>
                            <li>
                                支持记录重发
                            </li>
                            <li>
                                支持自动测试
                            </li>
                            <li>
                                完善错误提示
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
                            <button class="button is-success">生成接口</button>
                            <button class="button is-success">顺序测试</button>
                            <button class="button is-success">顺序测试并生成报告</button>
                        </div>
                        {#each interfaces.List() as item}
                            <C_INTERFACE item={item} />
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
                                    使用方法(多个接口按顺序写就可以)： 
                                </p>
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
</main>

<style>
    #interface{
        height: 80vh;
        overflow-y: scroll;
    }
	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
