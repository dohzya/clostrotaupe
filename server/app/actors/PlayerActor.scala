package actors

import akka.actor._
import play.api.libs.json._

object PlayerActor {
  def props(ws: ActorRef, game: ActorRef) = Props(new PlayerActor(ws, game))
}

class PlayerActor(ws: ActorRef, game: ActorRef) extends Actor {
  override def preStart() {
    game ! Connect(self)
  }
  override def postStop() = {
    game ! Disconnect(self)
  }



  def receive = {
    case msg: JsValue =>
      ws ! ("I received your message: " + msg)
  }
}
