using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoVentas;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class PV_Precio : BaseObject
    {
        public decimal PrecioActual { get; set; }
        public string Comentario { get; set; }
        public Boolean EsPrecioActivo { get; set; }
        public int MayoreoMenudeo { get; set; }
        public PV_Material Material { get; set; }
        
    }
}