using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoSeguridad
{
    public class UsuarioRol : BaseObject
    {
        public long UsuarioId { get; set; }
        public long RolId { get; set; }
        public string NombreRol { get; set; }
    }
}
