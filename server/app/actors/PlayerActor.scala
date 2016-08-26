package actors

import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

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

  var lastPoint: OutEvent.Point = Gameplay.genPoint()

  override def preStart() {
    game ! Connect(self)
  }
  override def postStop() = {
    game ! Disconnect(self)
  }

  def receive = {
    case Connected(player) =>
      logger.info(s"Received player info: $player")

    case UpdatePoint(point) =>
      logger.info(s"Updating point coordinates: $point")
      lastPoint = Gameplay.genNearPoint(lastPoint)
      ws ! lastPoint

    case InEvent.Ping(msg) =>
      logger.info(s"Received Ping($msg)")
      ws ! OutEvent.Pong("I received your message: " + msg)
      ws ! lastPoint
      context.system.scheduler.scheduleOnce(100 milliseconds, self, UpdatePoint(Gameplay.genPoint()))
      ws ! OutEvent.Bg(123, 23, 345)

    case InEvent.Click(x, y) =>
      logger.info(s"Received Click($x, $y)")
      val isHit = Gameplay.checkHit(lastPoint, x, y)
      isHit.map { hit =>
        val score = Gameplay.calculateScoreFromHit(lastPoint, hit)
        game ! TargetHit(self, score)
      }
      lastPoint = Gameplay.genPoint()
      ws ! lastPoint


    case err =>
      logger.warn(s"Received invalid message: $err")
  }
}
