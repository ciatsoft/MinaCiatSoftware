using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class HistoricoRFID : BaseObject
    {
        public long IdCliente { get; set; }
        public string RFID_Anterior { get; set; }
        public string RFID_Nuevo { get; set; }
        public DateTime Fecha_Cambio { get; set; }
    }
}
