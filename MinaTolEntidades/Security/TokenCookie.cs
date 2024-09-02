﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.Security
{
    public class TokenCookie
    {
        public Token Token { get; set; }
        public long UserID { get; set; }
        public string UserName { get; set; }
        public string ProfileImage { get; set; }
    }
}
