package models

import akka.actor._

object Gameplay {
  def calibratePoint(point: OutEvent.Point): OutEvent.Point = {
    val x = if (point.radius - point.x < 0) point.radius else point.x
    val y = if (point.radius - point.y < 0) point.radius else point.y

    point.copy(x = x, y = y)
  }

  def genPoint(): OutEvent.Point = calibratePoint(OutEvent.Point(math.random, math.random, math.random / 10))

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

  def smallVariation(c: Double) = {
    val sign = if (math.random < 0.5) -1 else 1
    val variation = math.random / 100 * sign

    val result = c + variation

    if (result > 1.0) c + variation * sign
    else if (result < 0) c + variation * sign
    else result
  }

  def genNearPoint(point: OutEvent.Point): OutEvent.Point =
    calibratePoint(point.copy(
      x = smallVariation(point.x),
      y = smallVariation(point.y),
      radius = smallVariation(point.radius)))

  def calculateScoreFromHit(point: OutEvent.Point, hit: Double): Double = scala.math.pow(point.radius, 2.0) - hit
}
