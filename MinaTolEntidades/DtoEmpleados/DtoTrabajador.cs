using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoSucursales
{
    public class DtoTrabajador : BaseObject
    {
        public string Nombre { get; set; }
        public string Email { get; set; }
        public string Telefono { get; set; }
        public DateTime FechaContratacion { get; set; }
        public string Seguro { get; set; }
        public string Turno { get; set; }
        public DtoAreaTrabajo AreaTrabajo { get; set; }
    }
}
