const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const UglifyJS = require("uglify-es");
const production = process.argv[2];
let pathName="";
if(production){
	pathName = "build/prod/service_worker.js";
}else{
	pathName = "build/dev/service_worker.js";
}

fs.readFile("src/service_worker.js",(error,data)=>{
	if(error){
		console.error(error);
	}else{
		const id = crypto.randomBytes(16).toString("hex");
		const dataString = data.toString();
		let code = "";
		if(production){
			const minifyResult = UglifyJS.minify(dataString,{
				sourceMap:true,
				ecma:8,
				compress: {
					ecma:8,
					passes:2,
				},
				output:{
					ecma:8
				}
			});
			code = `const CACHE_NAME="choremanager${id}";${minifyResult.code}`;
		}else{
			code = `const CACHE_NAME="choremanager${id}";${dataString}`;
		}	
		pathName = path.resolve(__dirname,pathName);
		fs.writeFile(pathName,code,(error)=>{
			if(error){
				console.error(error);
			}
		});
		/*if(production){
			const map = minifyResult.map
			fs.writeFile(`${pathName}.map`,map,(error)=>{
				if(error){
					console.error(error);
				}
			});
		}*/
	}
})