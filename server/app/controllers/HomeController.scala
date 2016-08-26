package controllers

import akka.actor.ActorSystem
import akka.stream._
import javax.inject._
import play.api._
import play.api.libs.json._
import play.api.libs.streams._
import play.api.mvc._
import play.api.mvc.WebSocket.MessageFlowTransformer
import scala.concurrent.duration._
import scala.concurrent.{ ExecutionContext, Future, Promise }

import actors._
import models._

@Singleton
class HomeController @Inject() (implicit actorSystem: ActorSystem, materializer: Materializer, exec: ExecutionContext) extends Controller {

  val game = actorSystem.actorOf(GameActor.props)

  implicit val messageFlowTransformer =
    MessageFlowTransformer.jsonMessageFlowTransformer[InEvent, OutEvent]

  def connect = WebSocket.accept[InEvent, OutEvent] { request =>
    ActorFlow.actorRef(ws =>
      PlayerActor.props(ws, game)
    )
  }

  val home = {
    val asset = controllers.Assets.Asset.string2Asset("index.html")
    controllers.Assets.versioned(path="/public", asset)
  }

  def info = Action.async {
    val p = Promise[JsValue]()
    game ! GameInfo(p)
    p.future.map { info =>
      Ok(info)
    }
  }

}
