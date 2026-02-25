using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class Canjeo : BaseObject
    {
        public string Folio { get; set; }
        public string RFID { get; set; }
        public string NombreCliente { get; set; }
        public string Transporte { get; set; }
        public string Placa { get; set; }
        public decimal Cantidad { get; set; }
        public long PV_PlantaId { get; set; }
        public long PV_MaterialId { get; set; }
        public string FormaDePago { get; set; }
        public int UsuarioId { get; set; }
        public DateTime Fecha { get; set; }
        public decimal CantidadRecibida { get; set; }
        public string EstatusVenta { get; set; }
        public long UnidadMedida { get; set; }
        public decimal TotalPago { get; set; }
        public decimal PrecioUnidad { get; set; }
        public int FolioInicio { get; set; }
        public int FolioFinal { get; set; }
        public int NoVale { get; set; }
    }

}
