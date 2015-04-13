﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatSystem.Services.Models
{
    public class GroupViewModel
    {
        public string GroupName { get; set; }

        public int GroupId { get; set; }

        public int UnreceivedMessages { get; set; }
    }
}