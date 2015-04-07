namespace ChatSystem.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    public class SentMessage
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(128)]
        public string RecieverId { get; set; }

        [Required]
        public int MessagesId { get; set; }

        [Required]
        public bool IsRecieved { get; set; }

        public virtual User Reciever { get; set; }

        public virtual Message Message { get; set; }
    }
}
