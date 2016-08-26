package models

import play.api.libs.functional.syntax._
import play.api.libs.json._

sealed trait InEvent
object InEvent {
  case class Ping(msg: String) extends InEvent
  case class Click(x: Double, y: Double) extends InEvent

  implicit val jsonReads: Reads[InEvent] = {
    (__ \ "type").read[String].flatMap {
      case "ping" => (__ \ "msg").read[String].map(Ping(_))
      case "click" => ((__ \ "x").read[Double] ~ (__ \ "y").read[Double])(Click.apply _)
      case _ => Reads[InEvent] { _ => JsError("invalid type") }
    }
  }
}

sealed trait OutEvent
object OutEvent {
  case class Pong(msg: String) extends OutEvent
  case class Point(x: Double, y: Double, radius: Double) extends OutEvent
  case class Bg(r: Int, g: Int, b: Int) extends OutEvent

  implicit val jsonWrites = Writes[OutEvent] {
    case Pong(msg) => Json.obj("type" -> "pong", "msg" -> msg)
    case Point(x, y, radius) => Json.obj("type" -> "point", "x" -> x, "y" -> y, "size" -> radius)
    case Bg(r, g, b) => Json.obj("type" -> "bg", "r" -> r, "g" -> g, "b" -> b)
  }
}
