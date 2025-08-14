using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoTaller
{
    public class Inventario : BaseObject
    {
        public string Nombre { get; set; }
        public long IdCategoria { get; set; }
        public string Marca { get; set; }
        public long CodigoFabricante { get; set; }
        public int CantidadExistente { get; set; }
        public string UbicacionAlmacen { get; set; }
        public decimal PrecioCompra {  get; set; }
        public string Proveedor { get; set; }
    }
}
