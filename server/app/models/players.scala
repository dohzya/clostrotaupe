package models

import akka.actor.ActorRef

sealed trait Color
object Color {
  case object Red extends Color
  case object Green extends Color
  case object Blue extends Color

  def all = Seq(Red, Green, Blue)
}

case class Player(
  ref: ActorRef,
  color: Color
)
object Player {
  def create(ref: ActorRef) = Player(
    ref = ref,
    color = genColor()
  )
  def genColor() = Color.Red
}
