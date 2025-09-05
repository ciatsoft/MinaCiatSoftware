using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class DocumentosEmpleado : BaseObject
    {
        public long IdTrabajador { get; set; }
        public long IdTipoDocumento { get; set; }
        public string NombreDocumento { get; set; }
        public DateTime Fecha { get; set; }
    }
}
