using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.VehiculoCarga
{
    public class RFIDCarga : BaseObject
    {
        public long IdTrabajador { get; set; }
        public long IdVehiculoCarga { get; set; }
        public string RFIDAsignado { get; set; }
        public DateTime FechaHora { get; set; }
        public bool Devuelto { get; set; }
        public bool Activo { get; set; }

    }
}
