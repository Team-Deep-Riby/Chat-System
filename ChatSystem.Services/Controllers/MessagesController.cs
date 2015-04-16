namespace ChatSystem.Services.Controllers
{
    using System;
    using System.Linq;
    using System.Web;
    using System.Web.Http;

    using Microsoft.AspNet.Identity;

    using ChatSystem.Models;
    using ChatSystem.Data;
    using Services.Models;
    using System.Net.Http;
    using System.Net;

    [Authorize]
    [RoutePrefix("api/Messages")]
    public class MessagesController : BaseApiController
    {
        public MessagesController() : base()
        {
        }

        // GET api/Messages/groupId
        [HttpGet]
        [Route("{groupId:int}")]
        public IHttpActionResult GetMessagesByGroupId(int groupId)
        {
            var messages = from m in this.Data.Messages.All() where m.Group.Id == groupId
                           select new MessageViewModel
                           {
                                senderId = m.Sender.Id,
                                senderName = m.Sender.UserName,
                                MessagesContent = m.Content,
                                MessagesDate = m.DateTime
                           };
               
            return Ok(messages);
        }

        [HttpGet]
        [Route("unreceived/{groupId:int}")]
        public IHttpActionResult GetMessagesByGroupIdUnreceived(int groupId)
        {
            var messages = from m in this.Data.Messages.All()
                           where m.Group.Id == groupId && m.UserMessages.Count() == 0
                           select new MessageViewModel
                           {
                               senderId = m.Sender.Id,
                               senderName = m.Sender.UserName,
                               MessagesContent = m.Content,
                               MessagesDate = m.DateTime
                           };

            return Ok(messages);
        }

        [HttpGet]
        [Route("{groupId:int}/{datetime:datetime}")]
        public IHttpActionResult GetMessagesByGroupIdAndDate(int groupId,DateTime datetime)
        {
            var messages = from m in this.Data.Messages.All()
                           where m.Group.Id == groupId && m.DateTime == datetime
                           select new MessageViewModel
                           {
                               senderId = m.Sender.Id,
                               senderName = m.Sender.UserName,
                               MessagesContent = m.Content,
                               MessagesDate = m.DateTime
                           };

            return Ok(messages);
        }
		

        [HttpPost]
        [Route("send")]
        public IHttpActionResult SendMessageToGroup([FromBody]MessagePostModel msg)
        {
            var userId = User.Identity.GetUserId();
            var user = this.Data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }
            var group = this.Data.Groups.All().Where(g => g.Id == msg.GroupId).FirstOrDefault();
            if (group == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "Group not found");
            }
            
            var message = new Message
            {
                Content = msg.Content,
                DateTime = DateTime.Now
            };

            group.Messages.Add(message);
            user.Messages.Add(message);

            this.Data.Messages.Add(message);
            this.Data.SaveChanges();

            var usersInGroup = (from g in Data.Groups.All()
                                where
                                    g.Id == msg.GroupId
                                select g).FirstOrDefault().Users;

            foreach (var u in usersInGroup)
            {
                var um = new UserMessage
                {   
                    UserId = u.Id,
                    MessageId = message.Id                 
                };
                this.Data.UserMessages.Add(um);
            }

            this.Data.SaveChanges();

            return Ok();
        }

        private IHttpActionResult CustomResult(HttpStatusCode code, string message)
        {
            HttpResponseMessage responseMsg = new HttpResponseMessage(code);
            responseMsg.Content = new StringContent(message);
            return ResponseMessage(responseMsg);
        }
	}
}