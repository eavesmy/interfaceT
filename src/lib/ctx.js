class Ctx {
    constructor(res){
        this.res = res;
        this.body = "";
        this.msg = "success";
        this.obj = {};
    }

    async json(){
        this.body = await this.res.json()
        return this.body;
    }
    async text(){
        this.body = await this.res.text()
        return this.body;
    }
}

export default Ctx;
