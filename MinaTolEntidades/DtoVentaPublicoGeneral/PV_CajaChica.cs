using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.Security;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class PV_CajaChica : BaseObject
    {
        public decimal Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string Comentarios { get; set; }
        public string UsuarioName { get; set; }
        public Usuario Usuario { get; set; }
    }
}
