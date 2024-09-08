using MinaTolEntidades.DtoSucursales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class DtoSalario : BaseObject
    {
        public DateTime FechaInicial { get; set; }
        public DateTime? FechaFinal { get; set; }
        public decimal Monto { get; set; }
        public bool EsSalarioActual { get; set; }
        public DtoTrabajador Empleado { get; set; }
    }
}
