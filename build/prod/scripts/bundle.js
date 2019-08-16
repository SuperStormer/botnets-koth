new class{constructor(t){this.grid=[],this.canvas=t,this.grid[100]=[],this.grid[100][100]=void 0}display(){const t=this.canvas.width/100;let s=this.canvas.getContext("2d");for(let i=0;i<100;i++)for(let e=0;e<100;e++)s.lineWidth=.3,s.strokestyle="rgb(20,20,20)",s.strokeRect(i*t,e*t,t,t)}}(document.getElementById("grid")).display();
//# sourceMappingURL=bundle.js.map
