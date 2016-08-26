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
	cc: string
}

class Game {

	constructor() {
		Server.init()
		this.update = this.update.bind(this)
	}

	private board: iBoard;

	private teamCircle: iCircle;

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

		const ctx = this.board.ctx,
					H = this.board.height,
					W = this.board.width;

		this.clearBoard()

		const newCircle = {
			cx: W * .5,
			cy: H * .5,
			cr: W * .2,
			cc: "rgba(255,255,255,.5)"
		};

		this.teamCircle = newCircle;
		this.update()

	}

	private update(){
		this.clearBoard()
		this.drawCircle( this.teamCircle )
		rAF(this.update)
	}

	private clearBoard(){
		const ctx = this.board.ctx;
		ctx.clearRect(0, 0, this.board.width, this.board.height);
	}

	private drawCircle( circle: iCircle ){
		const {cx, cy, cr, cc} = circle;
		const ctx = this.board.ctx;

		ctx.globalAlpha = 1;
		ctx.beginPath();
		ctx.arc( cx,  cy, cr, 0, 2 * Math.PI, false);

		ctx.fillStyle = cc;
		ctx.fill();

		ctx.closePath();

	}

}

export default new Game
