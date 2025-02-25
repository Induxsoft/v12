var tools =
{
    /**
     * @param {*} elementOrSelector Elemento HTML o selector del elemento.
     * @param {string} eventName Nombre qualificado del evento.
     * @returns 
     */
    trigger(elementOrSelector,eventName)
    {
        if (!elementOrSelector || !eventName) return;

        const element = (typeof elementOrSelector === "string") ? document.querySelector(elementOrSelector) : elementOrSelector;
        if (!element) {
            console.error("Elemento no encontrado.");
            return
        }

        const event = new Event(eventName, {
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    },

    uuid(dashes=false) {
        function segment() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
    
        const guid = `${segment()}${segment()}${segment()}${segment()}${segment()}${segment()}${segment()}${segment()}`;
    
        if (dashes) {
            return `${guid.substring(0, 8)}-${guid.substring(8, 12)}-${guid.substring(12, 16)}-${guid.substring(16, 20)}-${guid.substring(20)}`;
        }
    
        return guid;
    },

    ParseBool(v) 
    {
        if (typeof v === "number") return (v != 0);
        if (typeof v === "string") {
            return ["true","1","yes","y","si","sí","s","ok","on","v","verdadero","verdad","correcto","cierto","positivo","+"].includes(v.toString().trim().toLowerCase());
        }

        return false
    },

    path_concat(p1,p2,...px)
    {
        p1 = p1.toString().replaceAll("\\","/");
        p2 = p2.toString().replaceAll("\\","/");

        let l1 = p1.split("/");
        let l2 = p2.split("/");
        
        let path = [...l1, ...l2];

        for (let i = 0; i < px.length; i++) {
            const p = px[i].toString().replaceAll("\\","/");
            let l = p.split("/");
            path = path.concat(l);
        }

        return path.join("/").replace(/\/+/g, '/');
    },

    url_encode(url)
    {
        let _url = btoa(url);
        
        _url = _url.replaceAll("=","|");
        _url = _url.replaceAll("/","_");
        _url = _url.replaceAll("+","-");
        
        return _url;
    },

    url_decode(url)
    {
        url = url.replaceAll("|","=");
        url = url.replaceAll("_","/");
        url = url.replaceAll("-","+");
        
        return atob(url);
    },

    distinctArrays(arr1, arr2)
    {
        if (arr1.length !== arr2.length) return true;
        // Comparar cada objeto dentro de los arrays
        for (let i = 0; i < arr1.length; i++) {
            if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) return true;
        }

        return false;
    },

    isValidFloat(number,decimals)
    {
        const regex = "^\([0-9]+\.?[0-9]{0,"+decimals+"})$";
        const preg = new RegExp(regex);
        return preg.test(number);
    },

    showModal:function(idmodal)
	{
		this.getBSModal(idmodal).show();
	},
	hideModal:function(idmodal)
	{
		this.getBSModal(idmodal).hide();
	},
	getBSModal(modalId='')
    {
        const modalElement = document.getElementById(modalId);

        if(!modalElement)
        {
            console.log("Elemento no definido");
            return;
        }
        const bsModal = bootstrap.Modal.getInstance(modalElement);
        if (!bsModal) return new bootstrap.Modal(modalElement);

        return bsModal;
    },
    V12FormBarDisableControls(disable,form=null)
    {
        const v12FormBar = document.getElementById("v12FormBar_content");
        if (v12FormBar) v12FormBar.querySelectorAll("button,a").forEach(v12btn => 
        {
            v12btn.style.pointerEvents = (disable) ? "none" : "";
            v12btn.style.backgroundColor = (disable) ? "#e9ecef" : "";
            v12btn.style.opacity = (disable) ? "1" : "";
        });
        
        if(form)form.querySelectorAll("button").forEach(frmbtn => 
        {
            frmbtn.disabled = disable;
        });
    }
}