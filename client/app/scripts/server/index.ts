class Server {

	constructor() {
		console.log('Server')
		this.connect()
	}

	private socket: WebSocket;

	public init() {
		this.connect()
	}

	private connect() {

		const ws = this.socket = new WebSocket("ws://localhost:9000/ws");

		ws.onopen = function () {
	  	ws.send('{"type":"ping","msg":"coucou"}');
			console.log('WebSocket — Opening')
		};
		ws.onerror = function (error: any) {
		  console.error('WebSocket — Error :', error);
		};
		ws.onmessage = function (e: any) {
		  console.info('WebSocket — Message : ', e.data);
		};
	}

}

export default new Server
