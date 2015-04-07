namespace ChatSystem.Models
{
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class ChatGroup
    {
        private ICollection<User> users;

        public ChatGroup()
        {
            this.users = new HashSet<User>();
        }

        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public virtual ICollection<User> Users
        {
            get { return users; }
        }
    }
}
