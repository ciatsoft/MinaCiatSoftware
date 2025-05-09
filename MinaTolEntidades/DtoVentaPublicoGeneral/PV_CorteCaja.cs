using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class PV_CorteCaja : BaseObject
    {
        public double MontoTotal { get; set; }
        public double Ingreso { get; set; }
        public double Egreso { get; set; }
        public string Comentarioa { get; set; }
        public int c500 {get; set;}
        public int c200 { get; set; }
        public int c100 { get; set; }
        public int c50 { get; set; }
        public int c10 { get; set; }
        public int c5 { get; set; }
        public int c2 { get; set; }
        public int c1 { get; set; }
        public int c50c{ get; set; }
    }
}
