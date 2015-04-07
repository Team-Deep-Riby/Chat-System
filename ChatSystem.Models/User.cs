namespace ChatSystem.Models
{
    using System.Collections.Generic;
    using System.Security.Claims;
    using System.Threading.Tasks;

    using Microsoft.AspNet.Identity;
    using Microsoft.AspNet.Identity.EntityFramework;

    public class User : IdentityUser 
    {
        private ICollection<ChatGroup> chatGroups;
        private ICollection<Message> messages;
        private ICollection<SentMessage> sentMessages;

        public User()
        {
            this.chatGroups = new HashSet<ChatGroup>();
            this.messages = new HashSet<Message>();
            this.sentMessages = new HashSet<SentMessage>();
        }

        public int NotReceivedMessagesCount { get; set; }

        public virtual ICollection<ChatGroup> ChatGroups
        {
            get { return chatGroups; }
        }

        public virtual ICollection<Message> Messages
        {
            get { return messages; }
        }

        public virtual ICollection<SentMessage> SentMessages
        {
            get { return this.sentMessages; }
        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<User> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}
