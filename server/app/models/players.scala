package models

import akka.actor.ActorRef

sealed trait Color { def name: String }
object Color {
  case object Red extends Color { val name = "Red" }
  case object Green extends Color { val name = "Green" }
  case object Blue extends Color { val name = "Blue" }

  def all = Seq(Red, Green, Blue)
}

case class Player(
  ref: ActorRef,
  name: String,
  color: Color
)
object Player {
  def create(ref: ActorRef) = Player(
    ref = ref,
    name = genName(),
    color = genColor()
  )

  def genName()  = "zengular-" + scala.util.Random.alphanumeric.take(5).mkString
  def genColor() = {
    def chance(random: Double): Color  = {
      if (random < 1/3) Color.Red
      else if (random > 2/3) Color.Green
      else Color.Blue
    }

    chance(math.random)
  }
}
