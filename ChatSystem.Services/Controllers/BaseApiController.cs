namespace ChatSystem.Services.Controllers
{
    using System.Web.Http;
    using ChatSystem.Data;

    public abstract class BaseApiController : ApiController
    {
        private IChatSystemData data;

        protected BaseApiController(IChatSystemData data)
        {
            this.data = data;
        }

        protected IChatSystemData Data
        {
            get
            {
                return this.data;
            }
        }
    }
}