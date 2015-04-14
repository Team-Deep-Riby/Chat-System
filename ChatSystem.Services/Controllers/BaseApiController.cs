namespace ChatSystem.Services.Controllers
{
    using System.Web.Http;
    using System.Data.Entity;
    using ChatSystem.Data;
    using ChatSystem.Data.Migrations;

    public abstract class BaseApiController : ApiController
    {
        private IChatSystemData data;

        protected BaseApiController()
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ApplicationDbContext, Configuration>());
            this.data = new ChatSystemData(new ApplicationDbContext());
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