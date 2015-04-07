namespace ChatSystem.Data
{
    using Repositories;

    public interface IChatSystemData
    {
        UsersRepository Users { get; }

        MessagesRepository Messages { get; }

        GroupsRepository Groups { get; }

        int SaveChanges();

    }
}
