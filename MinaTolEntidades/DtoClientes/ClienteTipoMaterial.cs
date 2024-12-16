using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
    public class ClienteTipoMaterial : BaseObject
    {
        public ClienteTipoMaterial() {
            Cliente = new Cliente();
            TipoMaterial = new DtoTipoMaterialUbicacion();
        }

        public Cliente Cliente { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
    }
}
