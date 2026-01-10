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
        public string UsuarioName { get; set; }
        public int Corte_Id { get; set; }
        public int VentaVale { get; set; }
        public int VentaTransferencia { get; set; }
        public int VentaEfectivo { get; set; }
        public decimal TotalUtilidad { get; set; }
        public decimal MontoTotal { get; set; }
        public decimal Ingreso { get; set; }
        public decimal Egreso { get; set; }
        public string Comentarios { get; set; }
        public int B1000 { get; set; }
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
        public DateTime Fecha { get; set; }
        public Usuario Usuario { get; set; }
    }
}
