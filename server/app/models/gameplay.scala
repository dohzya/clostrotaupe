package models

import akka.actor._

case class TargetHit(ref: ActorRef, score: Double)

object Gameplay {
  def genPoint(): OutEvent.Point = OutEvent.Point(math.random, math.random, math.random)

  def checkHit(point: OutEvent.Point, x: Double, y: Double): Option[Double] = {
    val xDiff = point.x - x
    val yDiff = point.y - y
    val rPow  = scala.math.pow(point.radius, 2.0)
    val xdiffPow  = scala.math.pow(xDiff, 2.0)
    val ydiffPow  = scala.math.pow(yDiff, 2.0)

    val score = xdiffPow + ydiffPow
    val hit = if (score <= rPow) Some(score) else None

    hit
  }
}
