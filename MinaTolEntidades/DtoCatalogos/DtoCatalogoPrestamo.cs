using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoSucursales;

namespace MinaTolEntidades.DtoCatalogos
{
    public class DtoCatalogoPrestamo : BaseObject
    {
        public long IdTrabajador { get; set; }
        public string NombreTrabajador { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string UsuarioName { get; set; }
    }
}
