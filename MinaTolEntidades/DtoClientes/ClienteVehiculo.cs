using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
  public class ClienteVehiculo: BaseObject
    {
        public Cliente Cliente { get; set; }
        public Vehiculo Vehiculo { get; set; }  
   }
}
