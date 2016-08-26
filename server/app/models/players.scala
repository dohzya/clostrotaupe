package models

import akka.actor.ActorRef

sealed trait Color { def name: String }
object Color {
  case object Red extends Color { val name = "red" }
  case object Green extends Color { val name = "green" }
  case object Blue extends Color { val name = "blue" }

  def all = Seq(Red, Green, Blue)
  def get(name: String): Option[Color] = {
    all.find(_.name == name)
  }
}

case class Player(
  ref: ActorRef,
  name: String,
  color: Color
)
object Player {
  def create(ref: ActorRef, color: Color) = Player(
    ref = ref,
    name = genName(),
    color = color
  )

  def genName()  = "zengular-" + scala.util.Random.alphanumeric.take(5).mkString
  def genColor() = scala.util.Random.shuffle(Color.all).head
}
