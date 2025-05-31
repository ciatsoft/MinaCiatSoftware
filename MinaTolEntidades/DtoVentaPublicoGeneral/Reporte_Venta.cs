using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class Reporte_Venta : BaseObject
    {
        public int UsuarioId { get; set; }
        public string UsuarioName { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaFiltro { get; set; }
    }
}
