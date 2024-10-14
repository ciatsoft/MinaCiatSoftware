using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoViajes
{
    public class DtoViajeInterno : BaseObject
    {
        public DtoViajeInterno()
        {
            UbicacionOrigen = new DtoUbicacion();
            UbicacionDestino = new DtoUbicacion();
            TipoMaterial = new DtoTipoMaterialUbicacion();
            Transportista = new DtoTrabajador();
            Vehiculo = new Vehiculo();
        }
        public DtoUbicacion UbicacionOrigen { get; set; }
        public DtoUbicacion UbicacionDestino { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public DtoTrabajador Transportista { get; set; }
        public Vehiculo Vehiculo { get; set; }
        public DateTime FechaViaje { get; set; }
        public string Observaciones { get; set; }
    }
}
