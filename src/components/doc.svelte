<script>
    import marked from 'marked';
    import { DOC } from '../service.js';
    
    let doc = "";

    DOC.subscribe(msg => {
        if(!msg) return;
        doc = msg;
    });

    function Download(){

        let filename = "interface.html";
        
        var eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址

        let content = `<html>
            <head>
                <meta http-equiv="content-type" content="text/html; charset=utf-8">
            </head>
            <body>
        `;
        content += marked(doc);
        content += `</body></html>`
        var blob = new Blob([content]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    }

</script>

<div class="container">
    <div class="content"></div>
    <div class="buttons">
        <button class="button is-success" on:click={Download}>
            下载
        </button>
    </div>
    <div class="content">
        {@html marked(doc)}
    </div>
</div>

<style>
    .container {
        margin: 0 20vw;
        word-break: break-all; 
    }
    p {
        word-break: break-all; 
    }
</style>
