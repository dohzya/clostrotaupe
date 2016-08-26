package models

import akka.actor._

case class TargetHit(ref: ActorRef, score: Double)

object Gameplay {
  def genPoint(): OutEvent.Point = OutEvent.Point(math.random, math.random, math.random)
}
