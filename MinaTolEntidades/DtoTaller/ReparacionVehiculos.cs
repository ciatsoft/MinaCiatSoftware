using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoTaller
{
    public class ReparacionVehiculos : BaseObject
    {
        public long IdVehiculo { get; set; }
        public int TipoVehiculo { get; set; }
        public long IdEmpleado { get; set; }
        public int TipoServicio { get; set; }
        public string Recibido { get; set; }
        public DateTime Fecha { get; set; }
    }
}
