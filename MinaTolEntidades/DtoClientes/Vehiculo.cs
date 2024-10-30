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
            AreaTrabajo = new DtoAreaTrabajo();
            Transportista = new DtoTrabajador();
        }

        public string Placa { get; set; }
        public string Color { get; set; }
        public TipoVehiculo TipoVehiculo { get; set; }
        public DtoAreaTrabajo AreaTrabajo { get; set; }
        public DtoTrabajador Transportista { get; set; }

    }
}
