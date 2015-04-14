using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatSystem.Services.Models
{
    public class MessagePostModel
    {
        public int GroupId { get; set; }
        public string Content { get; set; }
    }
}