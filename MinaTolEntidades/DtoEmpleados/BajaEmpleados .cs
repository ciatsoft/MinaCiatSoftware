using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class DtoBajasEmpleado : BaseObject
    {
        public long IdTrabajador { get; set; }
        public string Nombre { get; set; }
        public DateTime Fecha { get; set; }
        public string Comentario { get; set; }
    }
}
