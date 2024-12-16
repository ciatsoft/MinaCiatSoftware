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
            ClienteVI = new Cliente();
            TipoMaterial = new DtoTipoMaterialUbicacion();
            Transportista = new DtoTrabajador();
            Vehiculo = new Vehiculo();
        }
        public DtoUbicacion UbicacionOrigen { get; set; }
        public Cliente ClienteVI { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public DtoTrabajador Transportista { get; set; }
        public Vehiculo Vehiculo { get; set; }
        public DateTime FechaViaje { get; set; }
        public string Observaciones { get; set; }
        public string Folio { get; set; }
    }
}
