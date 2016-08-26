package actors

import akka.actor._
import play.api.libs.json._
import play.api.Logger

import models._

object PlayerActor {
  def props(ws: ActorRef, game: ActorRef) = Props(new PlayerActor(ws, game))
  val logger = Logger("application.player")
}

class PlayerActor(ws: ActorRef, game: ActorRef) extends Actor {
  import PlayerActor.logger

  override def preStart() {
    game ! Connect(self)
  }
  override def postStop() = {
    game ! Disconnect(self)
  }

  def receive = {
    case InEvent.Ping(msg) =>
      logger.info(s"Received Ping($msg)")
      ws ! OutEvent.Pong("I received your message: " + msg)

    case err =>
      logger.warn(s"Received invalid message: $err")
  }
}
