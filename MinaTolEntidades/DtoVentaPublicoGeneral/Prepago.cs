using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class Prepago : BaseObject
    {
        public string Folio { get; set; }
        public int NoVale {  get; set; }
        public string RFID { get; set; }
        public long IdCliente { get; set; }
        public string NombreCliente { get; set; }
        public string UserName { get; set; }
        public decimal ImporteVenta { get; set; }
        public long IdMaterial { get; set; }
        public string NombreMaterial { get; set; }
        public DateTime Fecha { get; set; }
    }
}
