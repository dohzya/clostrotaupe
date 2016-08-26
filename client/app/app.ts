import rAF from "./rAF"

interface Player {

}

class App {

	constructor() {
		document.addEventListener("DOMContentLoaded", this.init.bind(this) )
	}

	private init() {
		this.gameBoard = document.getElementById("gameBoard") as HTMLCanvasElement
		this.newGame()
	}

	private gameBoard: HTMLCanvasElement;
	private gamePlayers: Array<Player>

	private newGame() {
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

export = new App
