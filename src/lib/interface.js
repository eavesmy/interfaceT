import uuid from 'node-uuid';

let map = {}
let interfaces = {};
let iHeaders = {};

class Interface {
    
    constructor({method,path,params,headers,callback,readme} = data){

        this.id = uuid.v4();
        this.method = method;
        this.path = path;
        this.readme = readme || "";
        this.headers = headers;
        this.params = [];
        this.el;
        this.res = "";

        if(typeof params == "object") {
            for(let item in params) {
            
                let type = "string";
                let value = "";

                switch(params[item]) {
                    case String:
                    type = "string";
                    break
                    case Date:
                    type = "date"
                    break
                    case Number:
                    type = "number";
                    break
                    case Object:
                    type = "object";
                    break
                    case File:
                    type = "file";
                    break
                    default:
                    type = typeof params[item];
                    value = params[item];
                }

                this.params.push({
                    type : type,
                    key: item,
                    required: true,
                    value
                });
            }  
        }
        
        this.callback = !!callback ? callback : (ctx) => {
        };
    }

    /*
     * Generate interface doc.
     *  
     *  ### METHOD path
     *  ### Readme
     *  ### Params:
     *  - name string 
     *  ### Res
     *
     *
     * */

    GenerateDoc(){

        let text = "";
        text += `#### ${this.readme} \n`
        text += `#### ${this.method.toUpperCase()} ${this.path} \n`
        text += `#### headers \n`
        text += `${JSON.stringify(this.headers)} \n`
        text += `#### Params: \n`

        for(let item of this.params) {
            let _type = item.type;
            if(_type === "file") _type = "base64 string"
            text += `- ${item.key} [${_type}] \n`
        }

        text += `\n`
        text += `#### Res \n`
        text += `${JSON.stringify(this.res)} \n`
        text += `\n`
        text += `------------------------------`
        text += `\n \n`

        return text
    }

    parseRes(){
        if(!this.res) return
        console.log(this.res,typeof this.res);

        let ret = this.traverseRes(this.res);
        this.res = ret;
    }

    traverseRes(obj){
        let ret = {};
        for(let key in obj) {
            let _type = typeof obj[key];

            if(_type == "object" && Array.isArray(obj[key])) {
                ret[key] = "array";
            } else if(_type == "object" && !Array.isArray(obj[key])){
                ret[key] = this.traverseRes(obj[key]);
            } else {
                ret[key] = typeof obj[key];
            }
        }
        return ret
    }

    static Register(data) {
        let i = new Interface(data);
        interfaces[i.id] = i;
    }

    static List(){
        let list = [];
        for (let id in interfaces) {
            list.push(interfaces[id]);
        }
        return list;
    }

    static GetById(id) {
        return interfaces[id];
    }

    static Set(k,v) {
        map[k] = v;  
    }
    static Get(k) {
        return map[k] || null
    }
    static Empty(){
        interfaces = {};
        map = {};
    }
    static SetHeader(k,v){
        iHeaders[k] = v;
    }
    static GetHeader(k) {
        return iHeaders[k] || null;
    }
    static GetHeaders(){
        return iHeaders;
    }
}

export default Interface;
