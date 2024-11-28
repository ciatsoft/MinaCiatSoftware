using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoViajes
{
    public class DtoFoliador : BaseObject
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public long Consecutivo { get; set; }
        public string ConsecutivoString { get; set; } // Formateado para mostrar
    }
}
