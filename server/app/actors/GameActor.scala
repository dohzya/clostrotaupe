package actors

import akka.actor._
import play.api.libs.json._
import play.api.Logger
import scala.concurrent.{ ExecutionContext, Future, Promise }
import scala.concurrent.ExecutionContext.Implicits.global

object GameActor {
  def props() = Props(new GameActor())
  val logger = Logger("application.player")
}

class GameActor() extends Actor {
  import GameActor.logger

  val players = scala.collection.mutable.Set.empty[ActorRef]

  def gameInfo: JsValue = Json.obj("players" -> players.size)

  def addPlayer(player: ActorRef) = {
    logger.info("Add Player")
    players += player
  }
  def removePlayer(player: ActorRef) = {
    logger.info("Remove Player")
    players -= player
  }

  def receive = {
    case GameInfo(p) => p.success(gameInfo)
    case Connect(player) => addPlayer(player)
    case Disconnect(player) => removePlayer(player)
  }

}

case class GameInfo(p: Promise[JsValue])
case class Connect(ws: ActorRef)
case class Disconnect(ws: ActorRef)
