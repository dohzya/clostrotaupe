package models

import play.api.libs.json._

sealed trait InEvent
object InEvent {
  case class Ping(msg: String) extends InEvent

  implicit val jsonReads: Reads[InEvent] = {
    (__ \ "type").read[String].flatMap {
      case "ping" => {
        (__ \ "msg").read[String].map(Ping(_))
      }
      case _ => Reads[InEvent] { _ => JsError("invalid type") }
    }
  }
}

sealed trait OutEvent
object OutEvent {
  case class Pong(msg: String) extends OutEvent

  implicit val jsonWrites = Writes[OutEvent] {
    case Pong(msg) => Json.obj("type" -> "pong", "msg" -> msg)
  }
}
