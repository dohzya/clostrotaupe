
import Game from "./scripts/Game"

interface Player {

}

class App {

	constructor() {
		document.addEventListener("DOMContentLoaded", this.init.bind(this) )
	}

	private init() {
		Game.init()
	}

	private gamePlayers: Array<Player>


}

export = new App
