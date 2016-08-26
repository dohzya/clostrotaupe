package actors

import akka.actor._
import play.api.libs.json._
import play.api.Logger
import scala.concurrent.{ ExecutionContext, Future, Promise }
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

import models._

object GameActor {
  def props() = Props(new GameActor())
  val logger = Logger("application.player")
}

class GameActor() extends Actor {
  import GameActor.logger

  val players = scala.collection.mutable.Map.empty[ActorRef, Player]

  val colors = scala.collection.mutable.Map[Color, Double](Color.all.map(_ -> 0d): _*)

  def gameInfo: JsValue = Json.obj(
    "total" -> players.size,
    "players" -> JsArray(players.toSeq.map { case (ref, player) => Json.obj("name" -> player.name, "color" -> player.color.name)}) )

  def addPlayer(ref: ActorRef) = {
    val player = Player.create(ref)
    logger.info(s"Add Player $player")
    players += (ref -> player)
    player
  }
  def removePlayer(ref: ActorRef) = {
    logger.info("Remove Player")
    players -= ref
  }

  def targetHit(ref: ActorRef, score: Double) = {
    val player = players.getOrElse(ref, sys.error(s"Unknown player for actor ref $ref"))
    val currentColorScore = colors.getOrElse(player.color, sys.error(s"Unknown player color ${player.color}"))
    colors += (player.color -> (currentColorScore + score))
  }

  def sendBg() = {
    def calcColorValue(color: Color, totalScore: Double): Int = {
      val colorScore = colors.getOrElse(color, sys.error(s"Unknown player color ${color}"))
      val res = colorScore / totalScore * 255
      res.toInt
    }
    val totalScore = colors.values.foldLeft(0d)((acc, score) => acc + score)

    val bg = OutEvent.Bg(
      r = calcColorValue(Color.Red, totalScore),
      g = calcColorValue(Color.Green, totalScore),
      b = calcColorValue(Color.Blue, totalScore)
    )
    players.keys.map { ref =>
      ref ! bg
    }
  }

  override def preStart() {
    self ! TickBg
  }

  def receive = {
    case GameInfo(p) => p.success(gameInfo)
    case Connect(ref) => ref ! Connected(addPlayer(ref))
    case Disconnect(ref) => removePlayer(ref)
    case TargetHit(ref, score) => targetHit(ref, score)
    case TickBg =>
      sendBg()
      context.system.scheduler.scheduleOnce(100 milliseconds, self, TickBg)
  }

}

case class GameInfo(p: Promise[JsValue])
case class Connect(ref: ActorRef)
case class Disconnect(ref: ActorRef)
case class Connected(player: Player)
case class TargetHit(ref: ActorRef, score: Double)
case class UpdatePoint(point: OutEvent.Point)
case object TickBg
