<script>
    import { REQ_STATUS,RES_STATUS, REQ_MSG,RES_MSG } from '../service.js';

    let req_msg;
    let res_msg;

    let status_req;
    let status_res;

    REQ_MSG.subscribe(msg => {
        req_msg = msg;
    });
    RES_MSG.subscribe(msg => {
        res_msg = msg;
    });
    REQ_STATUS.subscribe(status => {
        status_req = status;
    });
    RES_STATUS.subscribe(status => {
        status_res = status;
    });
</script>

<div class="card">
    <header class="card-header">
        <p class="card-header-title">
            请求状态
        </p>
    </header>
    <div class="card-content">
        <p class="notification card-header-title is-4 {status_req}">
            Req: {req_msg}
        </p>
        <p class="notification card-header-title is-4 {status_res}">
            Res: {res_msg}
        </p>
    </div>
</div>

<style>

</style>
