using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoRfid
{
    public class IngresosRfid : BaseObject
    {
        public string RfidId { get; set; }
        public string Fecha { get; set; }
        public string Acceso { get; set; }

    }
}
