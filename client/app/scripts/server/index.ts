class Server {

	constructor() {
		this.connect()
	}

	private socket: WebSocket;

	public init() {
		this.connect()
	}

	private connect() {

		this.socket = new WebSocket("ws://localhost:9000/ws");
		this.handleWSEvents( this.socket )
		
	}

	private handleWSEvents( ws: WebSocket ){
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

	private jsonParse( jsonString: string ){
    try{
      return JSON.parse( jsonString );
    }catch(e){
      console.error(e);
    }
	}

}

export default new Server
