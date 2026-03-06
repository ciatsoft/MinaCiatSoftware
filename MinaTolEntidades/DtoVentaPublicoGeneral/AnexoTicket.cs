using MinaTolEntidades.DtoVentas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class AnexoTicket : BaseObject
    {
        public long IdVenta { get; set; }
        public int Carga { get; set; }
        public string RutaFoto { get; set; }
        public string GitFoto { get; set; }
    }
}
