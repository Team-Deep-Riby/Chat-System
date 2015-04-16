namespace ChatSystem.Data.Repositories
{
    using System.Data.Entity;
    using Models;

    public class MessagesRepository : GenericRepository<Message>
    {
        public MessagesRepository(DbContext context)
            : base(context)
        {
        }
    }
}
