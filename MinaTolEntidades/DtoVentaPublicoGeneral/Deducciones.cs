using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class Deducciones : BaseObject
    {

        public long TipoGastoId { get; set; }

        public string NombreGasto { get; set; }

        public string UsuarioName { get; set; }

        public DateTime Fecha { get; set; }

        public string Descripcion { get; set; }

        public decimal Monto { get; set; }

    }
}
