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
        public DtoCatalogoPrestamo()
        {
            IdTrabajador = new DtoTrabajador();
        }
        public DtoTrabajador IdTrabajador { get; set; }  // Se usará para mostrar en GetAllPrestamos
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string UsuarioName { get; set; }
    }
}
