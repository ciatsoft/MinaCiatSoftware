using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoViajes
{
    public class PrecioCombustible : BaseObject
    {
        public decimal Precio {  get; set; }
        public bool PrecioActivo {  get; set; }
    }
}
