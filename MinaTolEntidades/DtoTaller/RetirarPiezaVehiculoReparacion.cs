using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoTaller
{
    public class RetirarPiezaVehiculoReparacion : BaseObject
    {
        public long IdReparacion { get; set; }
        public long IdCategoriaInventario { get; set; }
        public long IdVehiculo { get; set; }
        public int TipoVehiculo { get; set; }
        public bool Reutilizable { get; set; }
        public string Nombre { get; set; }
        public string Marca { get; set; }
        public int Cantidad { get; set; }
        public int UbicacionAlmacen { get; set; }
        public DateTime Fecha { get; set; }
        public string RutaFoto { get; set; }
        public string GitFoto { get; set; }
        public int CantidadRetirada { get; set; }

    }
}
