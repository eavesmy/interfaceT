<script>
    import { OBJ } from '../service.js';

    let obj = {}
    OBJ.subscribe(item => {
        obj = Object.assign({},item.obj);
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
