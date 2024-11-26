using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoViajes
{
    internal class DtoFoliador : BaseObject
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }

        public string Folio { get; set; }
    }
}
