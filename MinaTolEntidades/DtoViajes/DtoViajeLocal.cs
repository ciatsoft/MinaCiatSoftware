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
    public class DtoViajeLocal : BaseObject
    {
        public DtoViajeLocal() {
            UbicacionOrigen = new DtoUbicacion();
            TipoMaterial = new DtoTipoMaterialUbicacion();
            Transportista = new DtoTrabajador();
            Vehiculo = new Vehiculo();
            UnidadMedida = new UnidadMedida();
            Cliente = new Cliente();
        }
        public DtoUbicacion UbicacionOrigen { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public DtoTrabajador Transportista { get; set; }
        public Vehiculo Vehiculo { get; set; }
        public UnidadMedida UnidadMedida { get; set; }
        public DateTime FechaViaje { get; set; }
        public string Observaciones { get; set; }
        public Cliente Cliente { get; set; }
        public string Folio { get; set; }
    }
}
