using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.Security;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class PV_CorteCaja : BaseObject
    {
        public double MontoTotal { get; set; }
        public double Ingreso { get; set; }
        public double Egreso { get; set; }
        public string Comentario { get; set; }
        public int B500 {get; set;}
        public int B200 { get; set; }
        public int B100 { get; set; }
        public int B50 { get; set; }
        public int B20 { get; set; }
        public int M10 { get; set; }
        public int M5 { get; set; }
        public int M2 { get; set; }
        public int M1 { get; set; }
        public int M050{ get; set; }
        public Usuario Usuario { get; set; }
    }
}
