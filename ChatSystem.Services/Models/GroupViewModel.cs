﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ChatSystem.Services.Models
{
    public class GroupViewModel
    {
        public string Name { get; set; }

        public int GroupId { get; set; }

        public int UnreceivedMessages { get; set; }
    }
}