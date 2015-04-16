namespace ChatSystem.Models
{
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class UserMessage
    {

        [Key, Column(Order = 0)]
        [MaxLength(128)]
        public string UserId { get; set; }

        [Key, Column(Order = 1)]
        public int MessageId { get; set; }

        public virtual User User { get; set; }
  
        public virtual Message Message { get; set; }

        [DefaultValue(false)]
        public bool IsRecieved { get; set; }
    }
}
