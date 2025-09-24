using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class ConceptoEmpleado : BaseObject
    {
        public long IdTrabajador {  get; set; }
        public long IdConceptoEmpleado {  get; set; }
        public string NombreConceptoEmpleado {  get; set; }
        public int Cantidad { get; set; }
        public decimal Valor {  get; set; }
        public decimal TotalNeto { get; set; }
        public DateTime Fecha {  get; set; }
    }
}
