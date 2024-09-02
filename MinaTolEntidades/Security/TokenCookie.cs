using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.Security
{
    public class TokenCookie
    {
        public TokenCookie()
        {
            BranchOffices = new List<long>();
        }
        public Token Token { get; set; }
        public long UserID { get; set; }
        public List<long> BranchOffices { get; set; }
        public string UserName { get; set; }
        public string ProfileImage { get; set; }
    }
}
