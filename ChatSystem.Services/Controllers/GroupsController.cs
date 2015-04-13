using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

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
        [ActionName("Index")]
        public IHttpActionResult GetAllGroups()
        {
            var groups = data.Groups.All()
                .Select(g => new GroupViewModel
                {
                    GroupId = g.Id, 
                    GroupName = g.Name
                });
            return Ok(groups);
        }

        [HttpPost]
        [ActionName("create")]
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


        private IHttpActionResult CustomResult(HttpStatusCode code,string message)
        {
             HttpResponseMessage responseMsg = new HttpResponseMessage(code);
             responseMsg.Content = new StringContent(message);
             return ResponseMessage(responseMsg);
        }

    }
}
