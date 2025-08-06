using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class UbicacionesMaterial : BaseObject
    {
        public long UbicacionId { get; set; }
        public string NombreUbicacion { get; set; }
        public long MaterialId { get; set; }
        public string NombreTipoMaterial { get; set; }
    }
}
