using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class ReporteEmpleadosDeducciones : BaseObject
    {
        public long IdTrabajador { get; set; }
        public string NombreEmpleado { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFinal { get; set; }
        public decimal SalarioSemanal { get; set; }
        public decimal Aumento { get; set; }
        public decimal Descuento { get; set; }
        public decimal SalarioFinal { get; set; }
    }
}
