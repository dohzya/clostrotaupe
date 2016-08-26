package actors

import akka.actor._
import play.api.libs.json._
import scala.concurrent.{ ExecutionContext, Future, Promise }
import scala.concurrent.ExecutionContext.Implicits.global

object GameActor {
  def props() = Props(new GameActor())
}

class GameActor() extends Actor {

  val players = scala.collection.mutable.Set.empty[ActorRef]

  def gameInfo: JsValue = Json.obj("players" -> players.size)

  def addPlayer(player: ActorRef) = players += player
  def removePlayer(player: ActorRef) = players -= player

  def receive = {
    case GameInfo(p) => p.success(gameInfo)
    case Connect(player) => addPlayer(player)
    case Disconnect(player) => removePlayer(player)
  }

}

case class GameInfo(p: Promise[JsValue])
case class Connect(ws: ActorRef)
case class Disconnect(ws: ActorRef)
