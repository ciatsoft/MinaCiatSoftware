using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class TotalPlanta
    {
        public long PV_PlantaId { get; set; }
        public string NombreUbicacion { get; set; }
        public decimal TotalVendido { get; set; }
    }
}
