package actors

import akka.actor._
import play.api.libs.json._
import play.api.Logger
import scala.concurrent.{ ExecutionContext, Future, Promise }
import scala.concurrent.ExecutionContext.Implicits.global

import models._

object GameActor {
  def props() = Props(new GameActor())
  val logger = Logger("application.player")
}

class GameActor() extends Actor {
  import GameActor.logger

  val players = scala.collection.mutable.Map.empty[ActorRef, Player]

  def gameInfo: JsValue = Json.obj(
    "total" -> players.size,
    "players" -> JsArray(players.toSeq.map { case (ref, player) => Json.obj("name" -> player.name, "color" -> player.color.name)}) )

  def addPlayer(ref: ActorRef) = {
    val player = Player.create(ref)
    logger.info(s"Add Player $player")
    players += (ref -> player)
    player
  }
  def removePlayer(player: ActorRef) = {
    logger.info("Remove Player")
    players -= player
  }

  def receive = {
    case GameInfo(p) => p.success(gameInfo)
    case Connect(ref) => ref ! Connected(addPlayer(ref))
    case Disconnect(player) => removePlayer(player)
  }

}

case class GameInfo(p: Promise[JsValue])
case class Connect(ws: ActorRef)
case class Disconnect(ws: ActorRef)
case class Connected(color: Player)
