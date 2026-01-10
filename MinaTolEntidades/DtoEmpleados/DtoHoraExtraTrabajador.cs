using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class DtoHoraExtraTrabajador : BaseObject
    {
        public long IdTrabajador { get; set; }
        public long IdSalarioActivo { get; set; }
        public decimal Salario { get; set; }
    }
}
