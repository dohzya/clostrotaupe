class Server {

	constructor() {
		this.connect()
	}

	private socket: WebSocket;

	private connect() {
		const ws = this.socket = new WebSocket("ws://localhost:9000/ws");
		ws.onopen = function () {
	  	ws.send('{"type":"ping","msg":"coucou"}');
		};
		ws.onerror = function (error: any) {
		  console.error('WebSocket Error ', error);
		};
		ws.onmessage = function (e: any) {
		  console.info('Server: ', e.data);
		};
	}
}

export = new Server
