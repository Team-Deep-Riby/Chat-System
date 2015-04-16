namespace ChatSystem.Data.Repositories
{
    using System.Data.Entity;
    using Models;

    public class UsersRepository : GenericRepository<User>
    {
        public UsersRepository(DbContext context) 
            : base(context)
        {
        }
    }
}
