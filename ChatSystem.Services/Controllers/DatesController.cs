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
    [RoutePrefix("api/Dates")]
    public class DatesController : ApiController
    {
        private readonly IChatSystemData data;

        public DatesController()
        {
            this.data = new ChatSystemData(new ApplicationDbContext());
        }

        [HttpGet]
        [Route("{groupId:int}")]
        public IHttpActionResult GetDatesByGroup(int groupId)
        {
            var currentUserId = User.Identity.GetUserId();
            List<DateTime> messageDates = 
                               (from m in data.Messages.All()
                               where m.SenderId == currentUserId && m.GroupId == groupId
                               orderby m.DateTime
                               select m.DateTime).ToList();

            return Ok(messageDates);

        }

    }
}
