import rAF from "../rAF"
import Server from "../Server"


interface iBoard {
	$el?: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
	height: number;
	width: number;
}

interface iCircle {
	cx: number,
	cy: number,
	cr: number,
	color: {
		r: number,
		g: number,
		b: number
	}
}

class Game {

	constructor() {
		this.update = this.update.bind(this)
		this.userInteraction = this.userInteraction.bind(this)
		this.server = new Server( this );
	}

	private server: any;

	private board: iBoard;

	private teamCircle: iCircle = {
		cx: .5,
		cy: .5,
		cr: 0,
		color: {
			r: 0,
			g: 0,
			b: 0
		}
	};

	public init(){
		const $C = document.getElementById("gameBoard") as HTMLCanvasElement

		this.board = {
			$el: $C,
			ctx: $C.getContext("2d"),
			height: $C.height = window.innerHeight,
			width: $C.width = window.innerWidth
		}

		this.new();
	}

	public new() {


		this.clearBoard()

		this.update()

	}

	public updateCirclePosition(data: any){
		const ctx = this.board.ctx,
					H = this.board.height,
					W = this.board.width;

		const vmin = (H > W )? W : H;

			this.teamCircle.cx = W * data.x;
			this.teamCircle.cy = H * data.y;
			this.teamCircle.cr = vmin * data.size;

	}
	public updateCircleColor(data: any){
		this.teamCircle.color.r = data.r;
		this.teamCircle.color.g = data.g;
		this.teamCircle.color.b = data.b;
	}

	private update(){
		this.clearBoard()
		//console.log("update", this.teamCircle)
		this.drawCircle( this.teamCircle )
		rAF(this.update)
	}

	private clearBoard(){
		const ctx = this.board.ctx;
		ctx.clearRect(0, 0, this.board.width, this.board.height);
	}

	private drawCircle( circle: iCircle ){
		const {cx, cy, cr, color} = circle;
		const ctx = this.board.ctx;

		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc( cx,  cy, cr, 0, 2 * Math.PI, false);

		ctx.fillStyle = `rgb( ${color.r}, ${color.g}, ${color.b} )`;
		ctx.fill();

		ctx.closePath();

	}

	public userInteraction(e: MouseEvent){

		this.server.send( {
			type: "click",
			x: e.clientX / this.board.width,
			y: e.clientY / this.board.height
		} )

	}

}

export default new Game
