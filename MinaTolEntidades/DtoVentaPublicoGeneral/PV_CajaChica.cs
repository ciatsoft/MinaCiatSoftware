using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class PV_CajaChica : BaseObject
    {
        public int Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string Comentario { get; set; }
    }
}
