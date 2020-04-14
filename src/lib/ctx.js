class Ctx {
    constructor(res){
        this.res = res;
        this.body = "";
        this.msg = "success";
        this.obj = {};
        this.headers = {};
        this.output = "";
    }

    async json(){
        this.body = await this.res.json()
        return this.body;
    }
    async text(){
        this.body = await this.res.text()
        return this.body;
    }
    setOutput(store){
        this.output = store;
    }
    show(msg){
        if (!!this.output) this.output.set(msg);
    }
}

export default Ctx;
