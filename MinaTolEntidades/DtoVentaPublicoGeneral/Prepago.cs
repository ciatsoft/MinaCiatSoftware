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
        public int NoVale { get; set; }
        public long IdMaterial { get; set; }
        public string NombreMaterial { get; set; }
        public decimal CantidadM3 { get; set; }
        public decimal M3Faltantes { get; set; }
        public decimal PrecioUnidad { get; set; }
        public decimal ImporteVenta { get; set; }
        public string RFID { get; set; }
        public long IdCliente { get; set; }
        public string NombreCliente { get; set; }
        public long CantidadVales { get; set; }
        public DateTime Fecha { get; set; }
        public string UserName { get; set; }
        public string Estado { get; set; }
        public int FolioInicio { get; set; }
        public int FolioFinal { get; set; }
    }
}
