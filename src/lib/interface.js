import uuid from 'node-uuid';

let map = {}
let interfaces = {};
let iHeaders = {};

class Interface {
    
    constructor({method,path,params,headers,callback} = data){

        this.id = uuid.v4();
        this.method = method;
        this.path = path;
        this.headers = headers;
        this.params = [];

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
