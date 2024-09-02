using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.Security
{
    public class Usuario : BaseObject
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Nombre { get; set; }
    }
}
