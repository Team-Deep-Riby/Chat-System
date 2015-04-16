namespace ChatSystem.Services.Models
{
    public class GroupFullModel
    {
        public string Name { get; set; }

        public int GroupId { get; set; }

        public int UnreceivedMessages { get; set; }
    }
}