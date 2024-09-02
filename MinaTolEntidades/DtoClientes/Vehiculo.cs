using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
 public  class Vehiculo : BaseObject
    {
        public TipoVehiculo TipoVehiculo { get; set; }
        public string Placa { get; set; }
        public string Color { get; set; }
    }
}
