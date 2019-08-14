export default class Controller{
	constructor(canvas){
		this.grid=[];
		this.canvas=canvas;
		this.grid[100]=[];
		this.grid[100][100]=undefined
	}
	display(){
		const CANVAS_SIZE=this.canvas.width;
		const SQUARE_SIZE=CANVAS_SIZE/100;
		let context=this.canvas.getContext("2d");
		for(let i=0;i<100;i++){
			for(let j=0;j<100;j++){
				context.lineWidth=0.5
				context.strokestyle="rgb(30,30,30)";
				context.strokeRect(i*SQUARE_SIZE,j*SQUARE_SIZE,SQUARE_SIZE,SQUARE_SIZE)
			}
		}
	}
}