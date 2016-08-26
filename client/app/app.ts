
import Game from "./scripts/Game"

const pointer = ("ontouchstart" in window || navigator.msMaxTouchPoints) ? "touchstart" : "mousedown";

interface Player {

}

class App {

	constructor() {
		document.addEventListener("DOMContentLoaded", this.init.bind(this) )
	}

	private init() {
		Game.init()
		document.addEventListener( pointer, Game.userInteraction )
	}

	private gamePlayers: Array<Player>


}

export = new App
