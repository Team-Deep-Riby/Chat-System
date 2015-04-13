using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatSystem.Services.Models
{
    public class MessageViewModel
    {
        public string senderId { get; set; }
        public string senderName { get; set; }
        public string MessagesContent { get; set; }
        public DateTime MessagesDate { get; set; }
    }
}