/* use this for perf tests on dev builds to bypass browser-sync or testing prod builds */
const fs = require("fs");
const express = require("express");
const path = require("path");
const app = express();
const port = 8;
const production = process.argv[2]==="production";
const pathName = production?"build/prod":"build/dev";
const options = /*production?{
	setHeaders(response,path){
		if(path.endsWith("html")||path.endsWith("js")||path.endsWith("css")){
			response.set("Content-Encoding","gzip");
		}
	}
}:*/{};
app.use(express.static(path.join(__dirname,pathName),options));
app.get('/', (request, response) => {
	response.render("index.html")
});
/*app.use((request,response)=>{
	const url = request.url;
	console.log(url);
	if(url.endsWith(".gz")){
		response.set("Content-Encoding","gzip");
	}
	response.render(url);
});*/
app.listen(port, (err) => {
	if (err) {
	return console.error(err)
	}
	console.log(`server is listening on ${port}`)
})