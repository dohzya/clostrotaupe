package models

import akka.actor._

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

  def smallVariation(c: Double) = {
    val random = math.random
    val variation = if(random < 0.1) random else 1.0 - random

    val result = math.abs(c + variation)
    if (result <= 1.0) result else result - 1.0
  }

  def genNearPoint(point: OutEvent.Point): OutEvent.Point =
    point.copy(
      x = smallVariation(point.x),
      y = smallVariation(point.y),
      radius = smallVariation(point.radius))

  def calculateScoreFromHit(point: OutEvent.Point, hit: Double): Double = scala.math.pow(point.radius, 2.0) - hit
}
