namespace ChatSystem.Models
{
    using System.Collections.Generic;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;

    public class ChatGroup
    {
        private ICollection<User> users;
        private ICollection<Message> messages;

        public ChatGroup()
        {
            this.users = new HashSet<User>();
            this.messages = new HashSet<Message>();
        }

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [DefaultValue(0)]
        public int UnreceivedMessages { get; set; }

        public virtual ICollection<User> Users
        {
            get { return users; }
        }

        public virtual ICollection<Message> Messages
        {
            get { return messages; }
        }
    }
}
