using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
    public class Vehiculo : BaseObject
    {

        public Vehiculo() {
            TipoVehiculo = new TipoVehiculo();
            
        }

        public string Placa { get; set; }
        public string Color { get; set; }
        public String Estado { get; set; }
        public TipoVehiculo TipoVehiculo { get; set; }
        

    }
}
