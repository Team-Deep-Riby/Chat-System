namespace ChatSystem.Data.Repositories
{
    using System.Data.Entity;
    using Models;

    public class GroupsRepository : GenericRepository<ChatGroup>
    {
        public GroupsRepository(DbContext context) 
            : base(context)
        {
        }
    }
}
