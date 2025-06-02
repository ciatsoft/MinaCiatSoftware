using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoCatalogos
{
    public class DtoCatalogoPrestamo : BaseObject
    {

        public string Nombre { get; set; }

        public string Descripcion { get; set; }

        public decimal Monto { get; set; }

        public DateTime Fecha { get; set; }

        public string UsuarioName { get; set; }


    }
}
