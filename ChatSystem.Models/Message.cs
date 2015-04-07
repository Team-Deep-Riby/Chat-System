namespace ChatSystem.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public class Message
    {
        private ICollection<User> recievers;

        public Message()
        {
            this.recievers = new HashSet<User>();
        }

        public int Id { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public MessageType MessageType { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [MaxLength(128)]
        public string SenderId { get; set; }

        [Required]
        public int GroupId { get; set; }

        public virtual User Sender { get; set; }

        public virtual ChatGroup Group { get; set; }

        public virtual ICollection<User> Recievers
        {
            get { return recievers; }
        }
    }
}
