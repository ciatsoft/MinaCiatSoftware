using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoEmpleados
{
    public class Empleado : BaseObject
    {
        public string Nombre { get; set; }
        public string ApellidoPaterno { get; set; }
        public string ApellidoMaterno { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }
        public DateTime FechaContratacion { get; set; }
        public string NSS {  get; set; }
        public string DiaNomina { get; set; }
        public long IdDepartamento { get; set; }
        public string NombreDepartamento { get; set; }
        public string Comentario { get; set; }
        public string RutaFoto { get; set; }
        public string GitFoto { get; set; }
    }
}
