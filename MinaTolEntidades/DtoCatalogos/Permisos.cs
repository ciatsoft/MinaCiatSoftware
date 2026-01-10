using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoCatalogos
{
    public class Permisos : BaseObject
    {

        public string URLVentana { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string TipoMenu { get; set; }
        public Permisos PermisoPadre { get; set; }
        public int Orden { get; set; }

    }
}
