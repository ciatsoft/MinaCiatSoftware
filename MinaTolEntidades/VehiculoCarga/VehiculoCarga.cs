using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.VehiculoCarga
{
    public class VehiculoCarga : BaseObject
    {
        public string Descripcion { get; set; }
        public string RutaArchivo { get; set; }
        public string GitArchivo { get; set; }
    }
}
