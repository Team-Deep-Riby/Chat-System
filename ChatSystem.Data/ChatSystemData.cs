namespace ChatSystem.Data
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using Models;
    using Repositories;

    public class ChatSystemData : IChatSystemData
    {
        private DbContext context;
        private IDictionary<Type, object> repositories;

        public ChatSystemData(DbContext context)
        {
            this.context = context;
            this.repositories = new Dictionary<Type, object>();
        }


        public UsersRepository Users
        {
            get { return (UsersRepository) this.GetRepository<User>(); }
        }

        public MessagesRepository Messages
        {
            get { return (MessagesRepository) this.GetRepository<Message>(); }
        }

        public GroupsRepository Groups
        {
            get { return (GroupsRepository) this.GetRepository<ChatGroup>(); }
        }

        public int SaveChanges()
        {
            return this.context.SaveChanges();
        }

        private IRepository<T> GetRepository<T>() where T : class
        {
            var type = typeof(T);
            if (!this.repositories.ContainsKey(type))
            {
                var typeOfRepository = typeof(GenericRepository<T>);

                if (type.IsAssignableFrom(typeof(User)))
                {
                    typeOfRepository = typeof(UsersRepository);
                }

                if (type.IsAssignableFrom(typeof(Message)))
                {
                    typeOfRepository = typeof(MessagesRepository);
                }

                if (type.IsAssignableFrom(typeof(ChatGroup)))
                {
                    typeOfRepository = typeof(GroupsRepository);
                }

                var repository = Activator.CreateInstance(typeOfRepository, this.context);
                this.repositories.Add(type, repository);
            }

            return (IRepository<T>)this.repositories[type];
        }
    }
}
