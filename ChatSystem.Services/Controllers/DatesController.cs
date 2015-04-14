namespace ChatSystem.Services.Controllers
{
    using System.Linq;
    using System.Net;
    using System.Web.Http;

    using Microsoft.AspNet.Identity;

    using ChatSystem.Data;
    using ChatSystem.Models;
    using Services.Models;

    [Authorize]
    [RoutePrefix("api/Dates")]
    public class DatesController : BaseApiController
    {

        public DatesController(): base()
        {
        }

        [HttpGet]
        [Route("{groupId:int}")]
        public IHttpActionResult GetDatesByGroup(int groupId)
        {
            var currentUserId = User.Identity.GetUserId();
            var messageDates = from m in this.Data.Messages.All()
                               where m.SenderId == currentUserId && m.GroupId == groupId
                               orderby m.DateTime
                               select m.DateTime;
            return Ok(messageDates);

        }

    }
}
