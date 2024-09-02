using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoSucursales
{
    public class Producto : BaseObject
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public UnidadMedida UnidadMedida { get; set; }
        public string Imagen { get; set; }
    }
}
