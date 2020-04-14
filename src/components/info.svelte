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
        {JSON.stringify(obj)}
    </div>
</div>

<style>
    .card-content {
        word-break: break-all; 
    }
</style>
