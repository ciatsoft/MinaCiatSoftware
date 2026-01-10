using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoTaller
{
    public class ComponenteVehiculo : BaseObject
    {
        public long IdInventario { get; set; }
        public string NombreInventario { get; set; }
        public int CantidadComponente { get; set; }
        public long IdVehiculo { get; set; }
        public string Placa {  get; set; }
    }
}
