import rAF from "../rAF"
import Server from "../server"

const TRANSITION_LENGTH = 50;
const TRANSITION_DURATION = 10;

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
		this.updateDisplay = this.updateDisplay.bind(this)
		this.userInteraction = this.userInteraction.bind(this)
		this.updateIntermediateCircle = this.updateIntermediateCircle.bind(this)
		this.server = new Server( this );
	}

	private server: any;

	private board: iBoard;

	private frameIndex: number = 0;

	private fromCircle: iCircle = {
		cx: .5, cy: .5, cr: 0,
		color: {
			r: 0, g: 0, b: 0, a: 0
		}
	};

	private toCircle: iCircle = {
		cx: .5, cy: .5, cr: 0,
		color: {
			r: 0, g: 0, b: 0, a: 0
		}
	};

	private intermediateCircle: iCircle = {
		cx: .5, cy: .5, cr: 0,
		color: {
			r: 0, g: 0, b: 0, a: 0
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
		this.updateDisplay()

		setInterval( this.updateIntermediateCircle, TRANSITION_DURATION )
	}

	public updateCirclePosition(data: any){
		const ctx = this.board.ctx,
					H = this.board.height,
					W = this.board.width;
		const vmin = (H > W )? W : H;

		this.fromCircle = this.intermediateCircle;
		this.frameIndex = 0;

		this.toCircle = {
			cx: W * data.x,
			cy: H * data.y,
			cr: vmin * data.size,
			color: {
				r: 0,
				g: 0,
				b: 0,
				a: 0
			}
		};

	}
  public updatePlayerInfo(data: any) {
    console.log("data", data)
    var playerInfoDiv = document.getElementById("playerInfo");
    var content    = document.createTextNode("Team: "+ data.team);
    playerInfoDiv.appendChild(content);
  }

	public updateBGColor(data: any){
		this.board.color.r =  data.r;
		this.board.color.g = data.g;
		this.board.color.b = data.b;
	}

	private updateDisplay(){

		this.clearBoard()

		this.drawCircle( this.intermediateCircle )

		rAF(this.updateDisplay)
	}
	private updateIntermediateCircle(){
		if( this.frameIndex > TRANSITION_LENGTH ) return

	  this.frameIndex++

		this.intermediateCircle = {
			cx: ( this.toCircle.cx * this.frameIndex + this.fromCircle.cx * (TRANSITION_LENGTH - this.frameIndex) ) / TRANSITION_LENGTH,
			cy: ( this.toCircle.cy * this.frameIndex + this.fromCircle.cy * (TRANSITION_LENGTH - this.frameIndex) ) / TRANSITION_LENGTH,
			cr: ( this.toCircle.cr * this.frameIndex + this.fromCircle.cr * (TRANSITION_LENGTH - this.frameIndex) ) / TRANSITION_LENGTH,
			color: {
				r: 0,
				g: 0,
				b: 0,
				a: 1
			}
		}
	}

	private clearBoard(){
		const ctx = this.board.ctx;
		ctx.clearRect(0, 0, this.board.width, this.board.height);

		ctx.beginPath();
		ctx.rect(0, 0, this.board.width, this.board.height);
		ctx.fillStyle = `rgb( ${this.board.color.r}, ${this.board.color.g}, ${this.board.color.b})`;
		ctx.fill();
		ctx.closePath();

	}

	private drawCircle( circle: iCircle ){
		if( ! circle.color.a ) return;

		const {cx, cy, cr, color} = circle;
		const ctx = this.board.ctx;

		ctx.globalAlpha = 1;
		ctx.beginPath();

		// FIXME : WTF ( cr < 0 ) ? 0 (negative value)
		ctx.arc( cx,  cy, ( cr < 0 ) ? 0 : cr, 0, 2 * Math.PI, false);

		ctx.lineWidth = 15;
		ctx.strokeStyle = `rgba( 200,200,200,.5 )`;
		ctx.stroke();

		ctx.fillStyle = `rgba( ${color.r}, ${color.g}, ${color.b}, ${color.a} )`;
		ctx.fill();

		ctx.closePath();

	}

	public userInteraction(e: any){
		e.preventDefault();
		if( e.clientX ){
			this.server.send( {
				type: "click",
				x: e.clientX / this.board.width,
				y: e.clientY / this.board.height
			} )
		}

		if( e.touches ){
			for (let i = 0; i < e.touches.length; i++) {
				this.server.send( {
					type: "click",
					x: e.touches[i].clientX / this.board.width,
					y: e.touches[i].clientY / this.board.height
				} )
			}
		}

	}

}

export default new Game
