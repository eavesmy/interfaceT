<script>
    import { OBJ } from '../service.js';

    let obj = {}
    OBJ.subscribe(item => {
        if(!item) return;
        item = JSON.parse(item);
        obj = Object.assign({},obj,item);
    });
</script>

<div class="card">
    <header class="card-header">
        <p class="card-header-title">
            变量
        </p>
    </header>
    <div class="card-content">
        {@html JSON.stringify(obj,null,"<br>")}
    </div>
</div>

<style>
    .card-content {
        word-break: break-all; 
        height: auto;
    }
    textarea {
        resize: none;
        width: 100%;
        height: auto;
        border: none;
    }
</style>
