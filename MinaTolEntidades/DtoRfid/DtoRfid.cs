using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.Dto_Rfid
{
    public class Rfid : BaseObject
    {

        public string rfid { get; set; }
        public long idUsuario { get; set; }
        public string NombreUsuario { get; set; }

    }
}
