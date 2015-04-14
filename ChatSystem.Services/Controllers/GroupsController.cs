namespace ChatSystem.Services.Controllers
{
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    using Microsoft.AspNet.Identity;
    using ChatSystem.Data;
    using ChatSystem.Models;
    using Services.Models;
    using System.Data.Entity.Validation;
    using System.Diagnostics;

    [Authorize]
    [RoutePrefix("api/Groups")]
    public class GroupsController : BaseApiController
    {

        public GroupsController() : base()
        {
        }

        [HttpGet]
        [Route]
        public IHttpActionResult GetAllGroups()
        {
            var currentUserId = User.Identity.GetUserId();
            var user = this.Data.Users.All().Where(u => u.Id == currentUserId).FirstOrDefault();

            var groups = this.Data.Groups.All().Where(g => g.Users.Count > 2 && g.Users.Contains(user))
                .Select(g => new GroupViewModel
                {
                    GroupId = g.Id, 
                    Name = g.Name,
                    UnreceivedMessages = g.UnreceivedMessages
                });
            return Ok(groups);
        }

        [HttpPost]
        [Route("create")]
        public IHttpActionResult CreateNewGroup([FromBody]string groupName)
        {
            var group = new ChatGroup { Name = groupName };
            this.Data.Groups.Add(group);
            
            try
            {
                this.Data.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Debug.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Debug.WriteLine("- Property: \"{0}\", Value: \"{1}\", Error: \"{2}\"",
                            ve.PropertyName,
                            eve.Entry.CurrentValues.GetValue<object>(ve.PropertyName),
                            ve.ErrorMessage);
                    }
                }
                throw;
            }
            return this.Ok(group.Id);
        }

        [HttpPost]
        [Route("add/{userId}")]
        public IHttpActionResult AddUserToGroup(string userId,[FromBody]int groupId)
        {
            var group = this.Data.Groups.All().Where(g => g.Id == groupId).FirstOrDefault();
            if(group == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "Group not found");
            }

            var user = this.Data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }

            group.Users.Add(user);
            this.Data.SaveChanges();

            return this.Ok();        
        }

        [HttpDelete]
        [Route("remove/{userId}")]
        public IHttpActionResult RemoveUserFromGroup(string userId, int groupId)
        {
            var group = this.Data.Groups.All().Where(g => g.Id == groupId).FirstOrDefault();
            if (group == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "Group not found");
            }

            var user = this.Data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (user == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }

            group.Users.Remove(user);
            this.Data.SaveChanges();

            return this.Ok();   
        }

        [HttpGet]
        [Route("~/api/Friends")]
        public IHttpActionResult GetFriendsGroups()
        {
            var currentUserId = User.Identity.GetUserId();

            var friendsGroups = from g in this.Data.Groups.All()
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
            var friend = this.Data.Users.All().Where(u => u.Id == userId).FirstOrDefault();
            if (friend == null)
            {
                return CustomResult(HttpStatusCode.NotFound, "User not found");
            }
            var currentUserId = User.Identity.GetUserId();
            var currentUser = this.Data.Users.All().Where(u => u.Id == currentUserId).FirstOrDefault();

            var group = new ChatGroup
            {
                Name = currentUser.UserName + "_" + friend.UserName
            };

            group.Users.Add(currentUser);
            group.Users.Add(friend);
            this.Data.Groups.Add(group);
            this.Data.SaveChanges();

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
