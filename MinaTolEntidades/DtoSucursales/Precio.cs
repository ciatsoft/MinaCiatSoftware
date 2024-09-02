using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoSucursales
{
    public class Precio : BaseObject
    {
        public decimal PrecioActual { get; set; }
        public string Comentario { get; set; }
        public Boolean EsPrecioActivo { get; set; }
        public Producto Producto { get; set; }

    }
}
