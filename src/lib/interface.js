import uuid from 'node-uuid';

let interfaces = {};

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
                }

                this.params.push({
                    type : type,
                    key: item,
                    required: true,
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

    static Get(id) {
        return interfaces[id];
    }
}

export default Interface;
