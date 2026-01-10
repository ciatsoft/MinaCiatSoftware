using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentas
{
    public class MaterialUbicacion : BaseObject
    {
        public DtoTipoMaterialUbicacion Material { get; set; }
        public DtoUbicacion Ubicacion { get; set; }
    }
}
