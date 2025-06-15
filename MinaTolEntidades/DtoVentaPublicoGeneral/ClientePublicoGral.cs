using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class ClientePublicoGral : BaseObject
    {
        public string Nombre { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public string RFC {  get; set; }
        public string RazonSocial { get; set; }
        public string Comentarios { get; set; }
    }
}
