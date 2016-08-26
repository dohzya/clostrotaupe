const CONNECTING =0,
			OPEN =1,
			CLOSING =2,
			CLOSED =3;

class Server {

	constructor() {
		this.init()
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
		ws.onopen = () => {

			this.send( {
				"type":"ping",
				"msg":"connected"
			} );

			console.log('WebSocket — Opening')
		};

		ws.onerror = (error: any) => {
			console.error('WebSocket — Error :', error);
		};

		ws.onclose = (error: any) => {
			console.error('WebSocket — Close :', error);
		};

		ws.onmessage = (e: any) => {
			console.info('WebSocket — Message : ', this.jsonParse(e.data) );
		};

	}

	public send( data: any ){
		this.socket.send( JSON.stringify( data ) );

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
