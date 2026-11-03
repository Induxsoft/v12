
var _monacoVID=0;

function init_monaco()
{
    if (typeof monaco !=="undefined")
    {
        monaco.languages.register({id:"dkl"});
        monaco.languages.setMonarchTokensProvider("dkl",dkl_syntax);
        _monacoEditor=monaco.editor.create(document.getElementById("_code_editor"), {value:_monaco_code,language:_monaco_lang});
        _monacoVID=_monacoEditor.getModel().getAlternativeVersionId();
        _monacoEditor.getModel().onDidChangeContent((event) => {
        _monacoIsDirty=_monacoVID!=_monacoEditor.getModel().getAlternativeVersionId();
        
        var isdirty = document.getElementById("isdirty");
        if (isdirty) isdirty.innerHTML = _monacoIsDirty ? "Sucio!" : "";

        });
    }
    else
        setTimeout(function(){init_monaco();},1000);
}

function change_lang(lang)
{
    monaco.editor.setModelLanguage(_monacoEditor.getModel(), lang)
}

function reziseEditor()
{
    var code_editor = document.getElementById("_code_editor");
    if (code_editor) code_editor.style.height = (window.innerHeight-_monaco_margin) + "px";
    if (_monacoEditor!=null)
        _monacoEditor.layout();
}

function saveText()
{
    save(()=>{
        _monacoIsDirty=false;
        _monacoVID=_monacoEditor.getModel().getAlternativeVersionId();
        });
}

function save(callback_success, callback_fail)
{
    var params={".":{text:_monacoEditor.getValue()}};

    fetch(_monaco_uri, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", "Accept": "application/json" },
        body: JSON.stringify(params)
    })
    .then(function(r){
        if (!r.ok) throw r;
        return r.json();
    })
    .then(function(res){
        if (res.success)
        {
            if (callback_success)
                callback_success(res.data);
        }
        else
        {
            if (callback_fail)
                callback_fail(res.message);
        }
    })
    .catch(function(r){
        alert("Ocurrió un error al invocar el servicio."+r);
    })
    .finally(function(){
        location.reload();
    });
}

function quit(path){
    if(_monacoIsDirty)
        if(confirm("Se han realizado cambios en el archivo. ¿Desea guardarlos?"))
            saveText();

    window.location.href=path;
}



function monacoStart() {
    reziseEditor();
    window.onresize=function(){
        reziseEditor();
    };

    init_monaco();
}

if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", monacoStart);
else
    monacoStart();
