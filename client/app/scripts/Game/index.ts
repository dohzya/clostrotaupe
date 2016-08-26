import rAF from "../rAF"
import Server from "../Server"


interface iBoard {
	$el?: HTMLCanvasElement;
	ctx?: CanvasRenderingContext2D;
	height: number;
	width: number;
	color: {
		r: number,
		g: number,
		b: number
	}
}

interface iCircle {
	cx: number,
	cy: number,
	cr: number,
	color: {
		r: number,
		g: number,
		b: number,
		a: number
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


	private fromCircle: iCircle = {
		cx: .5,
		cy: .5,
		cr: 0,
		color: {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	};

	private toCircle: iCircle = {
		cx: .5,
		cy: .5,
		cr: 0,
		color: {
			r: 0,
			g: 0,
			b: 0,
			a: 0
		}
	};

	public init(){
		const $C = document.getElementById("gameBoard") as HTMLCanvasElement

		this.board = {
			$el: $C,
			ctx: $C.getContext("2d"),
			height: $C.height = window.innerHeight,
			width: $C.width = window.innerWidth,
			color: {
				r: 0,
				g: 0,
				b: 0
			}
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

		this.fromCircle = this.toCircle;

		this.toCircle = {
			cx: W * data.x,
			cy: H * data.y,
			cr: vmin * data.size,
			color: {
				r: 180,
				g: 120,
				b: 40,
				a: 0
			}
		};

	}
	public updateBGColor(data: any){
		this.board.color.r = data.r;
		this.board.color.g = data.g;
		this.board.color.b = data.b;
	}

	private update(){

		this.clearBoard()

		this.fromCircle.color.a -= .01
		this.toCircle.color.a += .01

		this.drawCircle( this.fromCircle )
		this.drawCircle( this.toCircle )

		rAF(this.update)
	}

	private clearBoard(){
		const ctx = this.board.ctx;
		ctx.clearRect(0, 0, this.board.width, this.board.height);
	}

	private drawCircle( circle: iCircle ){
		if( ! circle.color.a ) return;

		const {cx, cy, cr, color} = circle;
		const ctx = this.board.ctx;

		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc( cx,  cy, cr, 0, 2 * Math.PI, false);

		ctx.fillStyle = `rgba( ${color.r}, ${color.g}, ${color.b}, ${color.a} )`;
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
