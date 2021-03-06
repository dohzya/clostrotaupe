
const CONNECTING =0,
			OPEN =1,
			CLOSING =2,
			CLOSED =3;

if( ! (window as any).clostrotaupe) {
	window['clostrotaupe'] = {
		wsURL: "ws://localhost:9000/ws"
	}
}

interface iListeners {
	point?: any,
	bg?: any
}

class Server {

	constructor( game: any ) {
		this.game = game;
		this.init()

	}

	private game: any;

	private socket: WebSocket;

	private messageListeners: iListeners = {};

	public init() {
		this.connect()
	}

	private connect() {
		this.socket = new WebSocket(window.clostrotaupe.wsURL);
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

			const data = this.jsonParse(e.data);

			switch( data.type ){
				case "point":
					this.game.updateCirclePosition(data)
					break;
				case "bg":
					this.game.updateBGColor(data)
					break;
        case "playerInfo":
          this.game.updatePlayerInfo(data)
          break;
				default:
					console.info('WebSocket — Unknown message : ', this.jsonParse(e.data) );
			}

		};

	}

	public send( data: any ){
		console.log('WebSocket — SEND : ', data)
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

export default Server
