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

  def connect(team: String) = WebSocket.acceptOrResult[InEvent, OutEvent] { request =>
    Future.successful {
      Color.get(team) match {
      case None =>
        Left(NotFound)
      case Some(color) =>
        Right(ActorFlow.actorRef(ws =>
          PlayerActor.props(ws, game, color)
        ))
      }
    }
  }

  def home(team: Option[String]) = Action { implicit request =>
    team match {
      case None =>
        Redirect(routes.HomeController.home(Some(Player.genColor().name)))
      case Some(team) =>
        Ok(views.html.index(routes.HomeController.connect(team).webSocketURL))
    }
  }

  def info = Action.async {
    val p = Promise[JsValue]()
    game ! GameInfo(p)
    p.future.map { info =>
      Ok(info)
    }
  }

}
