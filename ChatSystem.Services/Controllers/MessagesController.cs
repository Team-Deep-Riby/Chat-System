﻿namespace ChatSystem.Services.Controllers
{
    using System;
    using System.Linq;
    using System.Web;
    using System.Web.Http;

    using Microsoft.AspNet.Identity;

    using ChatSystem.Models;
    using ChatSystem.Data;
    using Services.Models;

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
            var messages = from m in this.Data.Messages.All() where m.GroupId == groupId
                           select new MessageViewModel
                           {
                                senderId = m.SenderId,
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
                           where m.GroupId == groupId && m.Recievers.Count() == 0
                           select new MessageViewModel
                           {
                               senderId = m.SenderId,
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
                           where m.GroupId == groupId && m.DateTime == datetime
                           select new MessageViewModel
                           {
                               senderId = m.SenderId,
                               senderName = m.Sender.UserName,
                               MessagesContent = m.Content,
                               MessagesDate = m.DateTime
                           };

            return Ok(messages);
        }
		
		[HttpPost]
        [Route("send")]
        public IHttpActionResult PostMessage([FromBody]MessagePostModel msg)
        {
            var userId = User.Identity.GetUserId();
            var message = new Message
            {
                Content = msg.Content,
                DateTime = DateTime.Now,
                SenderId = userId,
                GroupId = msg.GroupId
            };

            this.Data.Messages.Add(message);
            this.Data.SaveChanges();

            return Ok();
        }
	}
}