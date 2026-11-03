
var fileman={

	dropArea : null,
	button : null,
	input : null,
	file : null,
	cookieData:null,
	selectedFiles:[],
	codeExts:null,
	files:null,
	
	onClickCopy:function()
	{
		var clipboard={
			type:"clipboard",
			data:{
				files:fileman.selectedFiles,
				action:"copy",
				path:fileman.folderPath
			}
		};

		this.setCookieData(clipboard);
	},
	onClickCut: function(){
		var clipboard={
			type:"clipboard",
			data:{
				files:fileman.selectedFiles,
				action:"move",
				path:fileman.folderPath
			}
		};

		this.setCookieData(clipboard);
	},
	onClickDelete:function(){
		if (fileman.selectedFiles.length===0){
			alert("No ha seleccionado ningún archivo");
			return;
		}
		if(!confirm("¿Está seguro que desea eliminar los archivos seleccionados?"))
			return;

		var rq={};
		for(const er of fileman.selectedFiles)
		{
			rq[er]={ action:"delete"};
		}

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se ha podido eliminar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	onClickPaste:function(){

		if(fileman.cookieData==null){
			alert("No hay archivos en el portapapeles.");
			return;
		}
		if(fileman.cookieData.data.path == fileman.folderPath)
		{
			alert("No es posible pegar el archivo en el mismo directorio.");
			return;
		}
		var rq={};
		for(const er of fileman.cookieData.data.files)
		{
			rq[er]={
				action:fileman.cookieData.data.action,
				to:fileman.folderPath
			};
		}
		fileman.invoqueCopy(rq,fileman.cookieData.data.path, function(data){
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se pudo pegar.\n" + data[r].message);
			}
			fileman.setCookieData(null);

		},function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	invoqueCopy:function(data, fromPath, callback_success, callback_fail)
	{
		fileman.waiting();
		fileman.post(fromPath+"do.fso", JSON.stringify(data), true, function(res){
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
		}, function(){
			location.reload();
		});
	},
	setCookieData:function(data,success){
		fileman.post(fileman.currentURL, JSON.stringify(data), true, function(r){
			fileman.cookieData=r;
			if (success)
				success(r);
		});
	},
	addSelectedFile:function(fn)
	{
		fileman.selectedFiles.push(fn);
	},
	delSelectedFile:function(fn)
	{
		fileman.selectedFiles=fileman.selectedFiles.filter(e => e !== fn);
	},
	load_drag : function(){

		fileman.dropArea = document.querySelector(".fileman-viewfolder");
		fileman.button = document.querySelector(".upload_file");
		fileman.input = document.querySelector("#input_file");
		fileman.input_folder = document.querySelector("#input_folder");
		fileman.input_zip = document.querySelector("#input_file_zip");
		fileman.input_websencia = document.querySelector("#input_file_websencia");
		fileman.up_file = document.querySelector("#up_file");
		fileman.up_options = document.querySelector("#upload_options");

		if(fileman.up_file)fileman.up_file.addEventListener('click', () => {
			fileman.up_options.classList.toggle("upload_options_show");
		});
		if(fileman.up_options)fileman.up_options.childNodes.forEach(c => {
			c.addEventListener('click', () => fileman.up_options.classList.remove("upload_options_show"));
		});

		//Encima del control
		fileman.dropArea.addEventListener('dragover', e =>{
			e.preventDefault();
			fileman.dropArea.classList.add('drop_active');
		});
		//Cuando deja el control
		fileman.dropArea.addEventListener('dragleave', e =>{
			e.preventDefault();
			fileman.dropArea.classList.remove('drop_active');
		});
		//Cuando suelta el elemento en el control
		try{
			fileman.dropArea.addEventListener('drop', async b => {
				
				fileman.input.files = b.dataTransfer.files;
				const promise = fileHandler.getFiles(b);
				var formData = new FormData();
				
				b.preventDefault();
				b.stopPropagation();
				
				if(promise) await promise.then( v => {
					
					v.forEach( f => {
						
						let exist=(fileman.files && fileman.files.some(fe => fe.name==f.name));
						
						if (exist && !confirm(`El archivo ${f.name} ya existe en el directorio actual. ¿Desea reemplazarlo?`)){
							//ignore
						}else{
							
							var nf = new File([f.fileObject], f.name, {type:f.type});
							formData.append(f.fullPath, nf, f.name);
						}
					});
				});

				if (Array.from(formData.keys()).length < 1){

					alert("Debe seleccionar al menos un archivo.");
					fileman.dropArea.classList.remove('drop_active');
					return;
				}
				
				fileman.invoqueUpFiles(formData, function(data)
				{
					let res = Object.keys(data);
		
					for(var i=0; i<res.length; i++){
						let r = res[i];
		
						if(!data[r].done)
							alert(r + " no se pudo subir.\n" + data[r].message);
					}
				},
				function(message){
					alert("Ha ocurrido un error al realizar la operación\n\r"+message);
				});
	
				fileman.dropArea.classList.remove('drop_active');
			});
		}catch(error){
			alert("No fué posible subir el archivo.");
		}
		finally{
			fileman.dropArea.classList.remove('drop_active');
		}

		fileman.input.addEventListener('change', e => {
			
			let files = fileman.input.files;

			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}

			fileman.invoqueUpFiles(new FormData(document.getElementById("formData")), function(data)
			{
				let res = Object.keys(data);
	
				for(var i=0; i<res.length; i++){
					let r = res[i];
	
					if(!data[r].done)
						alert(r + " no se pudo subir.\n" + data[r].message);
				}
			},
			function(message){
				alert("Ha ocurrido un error al realizar la operación\n\r"+message);
			});
		});
		fileman.input_zip.addEventListener('change', e => {
			let files = fileman.input_zip.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}
			if(files.length > 1){
				alert("Debe selecionar solo un archivo.");
				return;
			}

			var fd = new FormData();
			var f = files.item(0);

			var nf = new File([f], f.name, {type:f.type})
			fd.append(f.name+"*", nf, f.name);

			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
				let r = res[0];
				if(!data[r].done) alert(r + " no se pudo subir.\n" + data[r].message);
			},
			function(message){
				alert("Ha ocurrido un error al subir el archivo.\n\r"+message);
			});
		});
		fileman.input_websencia.addEventListener('change', e => {
			let files = fileman.input_websencia.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos un archivo.");
				return;
			}
			if(files.length > 1){
				alert("Debe selecionar solo un archivo.");
				return;
			}

			var fd = new FormData();
			var f = files.item(0);

			var nf = new File([f], f.name, {type:f.type})
			fd.append(f.name+(fileman.renderWebsencia?"*":""), nf, f.name);

			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
				let r = res[0];
				if(!data[r].done) alert(r + " no se pudo subir.\n" + data[r].message);
			},
			function(message){
				alert("Ha ocurrido un error al subir el archivo.\n\r"+message);
			});
		});
		fileman.input_folder.addEventListener('change', e => {
			
			let files = fileman.input_folder.files;
			
			if(files.length < 1){
				alert("Debe seleccionar al menos una carpeta que contenga archivos.");
				return;
			}

			var fd = new FormData();

			for(let i=0; i<files.length; i++)
			{
				var f = files.item(i);
				var nf = new File([f], f.name, {type:f.type})
				
				fd.append(f.webkitRelativePath, nf, f.name);
			}
			
			fileman.invoqueUpFiles(fd, function(data)
			{
				let res = Object.keys(data);
	
				for(var i=0; i<res.length; i++){
					let r = res[i];
	
					if(!data[r].done)
						alert(r + " no se pudo subir.\n" + data[r].message);
				}
			},
			function(message){
				alert("Ha ocurrido un error al realizar la operación\n\r"+message);
			});
		});
	},

	search:function(view){

		let search = document.querySelector("#input_search");

		if (search.value.trim()=='') return
		
		url=window.location.href;
		let p = url.includes("?") ? '&' : '?';
		url += p+"search="+search.value.trim()+"&view="+view;

		window.location.href=url;
	},

	upl_file:function(){
		fileman.input.click();
	},
	upl_file_zip:function(){
		fileman.input_zip.click();
	},
	upl_file_websencia:function(){
		fileman.input_websencia.click();
	},
	upl_folder:function(){
		fileman.input_folder.click();	
	},

	do_delete: function (file)
	{
		if (!confirm("¿Está seguro de eliminar el archivo?")) return;

		var rq={};
		rq[file]={ action:"delete" };

		fileman.invoque(rq, function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				let r = res[i];

				if(!data[r].done)
					alert(r + " no se ha podido eliminar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},

	do_mkdir: function ()
	{
		var fname=prompt("Ingresa el nombre de la carpeta:");

		if (!fname) return;
		if(fname.includes("/") || fname.includes("\\") || fname.includes(":") || fname.includes("*") || fname.includes("?") || fname.includes("\"") || fname.includes("<") || fname.includes(">") || fname.includes("|")){
			alert("El nombre no debe contener:\n / \\ : * ? \" < > |");
			return;
		}
		var rq={};
		rq["."]={ action:"mkdir", path:fname };

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				
				let r = res[i];

				if(!data[r].done) alert(fname + " no se ha podido crear.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},

	do_rename: function (file)
	{
		var nname=prompt("Ingresa el nuevo nombre:",file);

		if (!nname) return;
		if(nname.trim().length==0){
			alert("El nombre no debe ir vacío.");
			return;
		}

		var rq={};
		rq[file]={ action:"rename", as:nname };

		fileman.invoque(rq,function(data)
		{
			let res = Object.keys(data);

			for(var i=0; i<res.length; i++){
				
				let r = res[i];

				if(!data[r].done) alert(r + " no se ha podido renombrar.\n" + data[r].message);
			}
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
	},
	set_file : function(){

		var fname=prompt("Ingresa el nombre del archivo:");
		if (!fname) return;
		
		if(fname.includes("/") || fname.includes("\\") || fname.includes(":") || fname.includes("*") || fname.includes("?") || fname.includes("\"") || fname.includes("<") || fname.includes(">") || fname.includes("|")){
			alert("El nombre no debe contener:\n / \\ : * ? \" < > |");
			return;
		}
		var rq={};
		rq[fname]={ text:"" };

		fileman.invoque_set_file(rq,function(data)
		{
			let res = Object.keys(data);
			let fileExt = "."+res[0].split('.').pop();

			let r = res[0];
			if(!data[r].txt_done)
				alert(fname + " no se ha podido crear.\n" + data[r].message);
			else
				if(fileman.codeExts[fileExt.toLocaleLowerCase()])
					window.location.href = fileman.folderPath+res[0]+fileman.codeExts[fileExt.toLocaleLowerCase()];
		},
		function(message){
			alert("Ha ocurrido un error al realizar la operación\n\r"+message);
		});
		location.reload();
	},
	invoque: function (params,callback_success, callback_fail)
	{
		fileman.waiting();
		fileman.post(fileman.folderPath+"do.fso", JSON.stringify(params), true, function(res){
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
		}, function(){
			location.reload();
		});
	},

	invoqueUpFiles: function (formData,callback_success, callback_fail)
	{
		fileman.waiting();
		fileman.post(fileman.folderPath+"upl.fso", formData, false, function(res){
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
		}, function(){
			location.reload();
		});
	},
	invoque_set_file: function (params,callback_success, callback_fail)
	{
		fileman.post(fileman.folderPath+"set.fso", JSON.stringify(params), true, function(res){
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
		});
	},
	checkboxFile:function(cb,fn)
	{
		if(cb.checked){
			fileman.addSelectedFile(fn);
		}
		else{
			fileman.delSelectedFile(fn);
		}
		if(fileman.selectedFiles.length<1){
			document.querySelectorAll("div.tool_bar_copy, div.tool_bar_cut, div.tool_bar_delete").forEach(el => el.style.pointerEvents = "none");
		}else{
			document.querySelectorAll(".tool_bar_copy, .tool_bar_cut, .tool_bar_delete").forEach(el => el.style.pointerEvents = "auto");
		}
	},
	// POST al servicio de FSO (antes $.ajax). json=true: el cuerpo va como application/json; si no, es FormData.
	// La respuesta se interpreta como JSON; si falla la red, el estado HTTP o el JSON, avisa como antes. always corre al final.
	post:function(url, body, json, success, always){
		const opts = { method: "POST", body: body, cache: "no-store", headers: { "Accept": "application/json" } };
		if (json) opts.headers["Content-Type"] = "application/json; charset=utf-8";
		fetch(url, opts)
		.then(r => { if (!r.ok) throw r; return r.json(); })
		.then(r => { if (success) success(r); })
		.catch(r => { alert("Ocurrió un error al invocar el servicio.\n\r"+((r && (r.statusText || r.message)) || "")); })
		.finally(() => { if (always) always(); });
	},
	waiting:function(){
		let processing = document.querySelector("#processing");
		processing.classList.add("processing_show");
		document.oncontextmenu = new Function("return false");
	},
	hidde_waiting:function(){
		let processing = document.querySelector("#processing");
		processing.classList.remove("processing_show");
		document.oncontextmenu = new Function("return true");
	}
};

function filemanStart() {
	fileman.load_drag();
	document.querySelectorAll(".privileges_select, #modal_con_select, #modal_id_select").forEach(el => el.value = "");
}

if (document.readyState === "loading")
	document.addEventListener("DOMContentLoaded", filemanStart);
else
	filemanStart();
