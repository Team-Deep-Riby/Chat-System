﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatSystem.Services.Models
{
    public class FriendViewModel
    {
        public string FriendName { get; set; }

        public int GroupId { get; set; }

        public int UnreceivedMessages { get; set; }
    }
}