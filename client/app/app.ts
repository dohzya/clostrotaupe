import rAF from "./scripts/rAF"

import Server from "./scripts/Server"
import Game from "./scripts/Game"

interface Player {

}

class App {

	constructor() {
		this.init()
	}

	private init() {
		Server.init()
		Game.new()
	}

	private gamePlayers: Array<Player>


}

export = new App
