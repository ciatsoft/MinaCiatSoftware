using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoIngresosRfid
{
    public class IngresosRfid : BaseObject 

    {
        
        public string RfidId { get; set; }
        public DateTime Fecha { get; set; }
        public string Accesos { get; set; }
       

    }
}
