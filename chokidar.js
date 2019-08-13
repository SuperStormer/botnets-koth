const chokidar = require("chokidar");
const childProcess = require("child_process")
const args = process.argv.slice(2);
chokidar.watch(args[0],{ignoreInitial:true}).on('all', (event, path) => {
	console.log(event,path);
	const command = childProcess.spawn(args[1],{shell:true,stdio:"inherit"});
});