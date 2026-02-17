using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.VehiculoCarga
{
    public class EventosRFIDCarga : BaseObject
    {
        public string RFIDCarga { get; set; }
        public string Evento { get; set; }
        public DateTime FechaHora { get; set; }
    }
}
