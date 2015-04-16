namespace ChatSystem.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class Message
    {
        private ICollection<UserMessage> userMessages;

        public Message()
        {
            this.userMessages = new HashSet<UserMessage>();
        }

        public int Id { get; set; }

        [Required]
        public DateTime DateTime { get; set; }

        [Required]
        public MessageType MessageType { get; set; }

        [Required]
        public string Content { get; set; }

        [ForeignKey("Sender")]
        public string SenderId { get; set; }
        [ForeignKey("SenderId")]
        public virtual User Sender { get; set; }

        [ForeignKey("Group")]
        public int GroupId { get; set; }
        [ForeignKey("GroupId")]
        public virtual ChatGroup Group { get; set; }

        public virtual ICollection<UserMessage> UserMessages
        {
            get { return userMessages; }
        }
    }
}
