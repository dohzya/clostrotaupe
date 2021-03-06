package actors

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

import akka.actor._
import play.api.libs.json._
import play.api.Logger

import models._

object PlayerActor {
  def props(ws: ActorRef, game: ActorRef, color: Color) = Props(new PlayerActor(ws, game, color))
  val logger = Logger("application.player")
}

class PlayerActor(ws: ActorRef, game: ActorRef, color: Color) extends Actor {
  import PlayerActor.logger

  var lastPoint: OutEvent.Point = Gameplay.genPoint()

  var player: Option[Player] = None

  override def preStart() {
    game ! Connect(self, color)
  }
  override def postStop() = {
    game ! Disconnect(self)
  }

  def receive = {
    case Connected(player) =>
      this.player = Some(player)
      logger.info(s"Received player info: $player")

    case UpdatePoint() =>
      //logger.info(s"Updating point coordinates: $point")
      val point = Gameplay.genNearPoint(lastPoint)
      lastPoint = point
      ws ! lastPoint
      context.system.scheduler.scheduleOnce(100 milliseconds, self, UpdatePoint())

    case InEvent.Ping(msg) =>
      logger.info(s"Received Ping($msg)")
      ws ! OutEvent.Pong("I received your message: " + msg)
      ws ! lastPoint
      context.system.scheduler.scheduleOnce(100 milliseconds, self, UpdatePoint())
      ws ! player.map(player => OutEvent.PlayerInfo(player.name, player.color.name)).getOrElse(sys.error("Player not initialized"))

    case InEvent.Click(x, y) =>
      logger.info(s"Received Click($x, $y)")
      val isHit = Gameplay.checkHit(lastPoint, x, y)
      isHit.map { hit =>
        val score = Gameplay.calculateScoreFromHit(lastPoint, hit)
        game ! TargetHit(self, score)
        lastPoint = Gameplay.genPoint()
        ws ! lastPoint
      }

    case bg: OutEvent.Bg =>
      ws ! bg

    case err =>
      logger.warn(s"Received invalid message: $err")
  }
}
