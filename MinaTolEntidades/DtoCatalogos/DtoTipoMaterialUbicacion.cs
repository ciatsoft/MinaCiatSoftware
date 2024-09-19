using MinaTolEntidades.DtoSucursales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoCatalogos
{
    public  class DtoTipoMaterialUbicacion:BaseObject
    {
        public string NombreTipoMaterial { get; set; }
        public string DescripcionTipoMaterial { get; set; }
        public UnidadMedida UnidadMedida { get; set; }
        public DtoUbicacion DtoUbicacion { get; set; }
    }
}
