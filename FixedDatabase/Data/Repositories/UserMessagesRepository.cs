namespace ChatSystem.Data.Repositories
{
    using System.Data.Entity;
    using Models;

    public class UserMessagesRepository : GenericRepository<UserMessage>
    {
        public UserMessagesRepository(DbContext context)
            : base(context)
        {
        }
    }
}
