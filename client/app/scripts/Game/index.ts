class Game {

	constructor() {
		document.addEventListener("DOMContentLoaded", this.init.bind(this) )
	}

	public init(){
		this.gameBoard = document.getElementById("gameBoard") as HTMLCanvasElement

	}
	private gameBoard: HTMLCanvasElement;

	public new() {
		if( !this.gameBoard ){
			document.addEventListener("DOMContentLoaded", this.new.bind(this) )
			return;
		}

		const ctx = this.gameBoard.getContext("2d"),
					H = this.gameBoard.height = window.innerHeight,
					W = this.gameBoard.width  = window.innerWidth;

					ctx.globalAlpha = 1;
					ctx.beginPath();
					ctx.arc( W / 2,  H / 2, W / 10, 0, 2 * Math.PI, false);

					ctx.strokeStyle = "white";
					ctx.lineWidth = 1;
					ctx.stroke();

					ctx.fillStyle = "rgba(255,255,255,.5)";
					ctx.fill();

					ctx.closePath();
					ctx.globalAlpha = 1;

	//		ctx.clearRect(0, 0, W, H);

	}

}

export default new Game
