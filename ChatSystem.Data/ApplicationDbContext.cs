namespace ChatSystem.Data
{
    using System.Data.Entity;
    using Microsoft.AspNet.Identity.EntityFramework;
    using Migrations;
    using Models;
    using System.Data.Entity.ModelConfiguration.Conventions;

    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<ApplicationDbContext, Configuration>());
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public DbSet<Message> Messages { get; set; }

        public DbSet<ChatGroup> ChatGroups { get; set; }

        public DbSet<UserMessage> UserMessages { get; set; }
    }
}
