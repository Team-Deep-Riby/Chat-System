using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace ChatSystem.Services.Controllers
{
    using ChatSystem.Data;
    using ChatSystem.Models;
    using Services.Models;
    [Authorize]
    [RoutePrefix("api/Groups")]
    public class GroupsController : ApiController
    {
        private readonly IChatSystemData data;

        public GroupsController()
        {
            this.data = new ChatSystemData(new ApplicationDbContext());
        }

        [HttpGet]
        [Route]
        public IHttpActionResult GetAllGroups()
        {
            var groups = data.Groups.All()
                .Select(g => new GroupViewModel
                {
                    GroupId = g.Id, 
                    GroupName = g.Name,
                    UnreceivedMessages = g.UnreceivedMessages
                });
            return Ok(groups);
        }

        [HttpPost]
        [Route("create")]
        public IHttpActionResult CreateNewGroup(string groupName)
        {
            var group = new ChatGroup { Name = groupName };
            data.Groups.Add(group);
            data.Groups.SaveChanges();

            return this.Ok(group.Id);
        }

        [HttpPost]
        [Route("add/{userId}")]
        public IHttpActionResult AddUserToGroup(string userId, int groupId)
        {
            var group = data.Groups.All().Where(g => g.Id == groupId).FirstOrDefault();
            if(group == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "Group not found");
            }

            var user = data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }

            group.Users.Add(user);
            data.Groups.SaveChanges();

            return this.Ok();        
        }

        [HttpDelete]
        [Route("remove/{userId}")]
        public IHttpActionResult RemoveUserFromGroup(string userId, int groupId)
        {
            var group = data.Groups.All().Where(g => g.Id == groupId).FirstOrDefault();
            if (group == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "Group not found");
            }

            var user = data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }

            group.Users.Remove(user);
            data.Groups.SaveChanges();

            return this.Ok();   
        }

        [HttpGet]
        [Route("~/api/Friends")]
        public IHttpActionResult GetFriendsGroups()
        {
            var currentUserId = User.Identity.GetUserId();

            var friendsGroups = from g in data.Groups.All()
                                where g.Users.Count() == 2 && g.Users.Where(u => u.Id == currentUserId).Any()
                                select new FriendViewModel
                                {
                                    FriendName = g.Users.Where(u => u.Id != currentUserId).Select(u => u.UserName).FirstOrDefault(),
                                    GroupId = g.Id,
                                    UnreceivedMessages = g.UnreceivedMessages
                                };

            return Ok(friendsGroups);
        }

        [HttpPost]
        [Route("~/api/Friends/add/{userId}")]
        public IHttpActionResult CreateNewFriendGroup(string userId)
        {
            var friend = data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (friend == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }
            var currentUserId = User.Identity.GetUserId();
            var currentUser = data.Users.All().Where(u => u.Id == currentUserId).FirstOrDefault();

            var group = new ChatGroup
            {
                Name = currentUser.UserName + "_" + friend.UserName
            };

            group.Users.Add(currentUser);
            group.Users.Add(friend);
            data.Groups.Add(group);
            data.Groups.SaveChanges();

            return Ok();
        }

        private IHttpActionResult CustomResult(HttpStatusCode code,string message)
        {
             HttpResponseMessage responseMsg = new HttpResponseMessage(code);
             responseMsg.Content = new StringContent(message);
             return ResponseMessage(responseMsg);
        }

    }
}
