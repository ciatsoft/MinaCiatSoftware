using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentaPublicoGeneral
{
    public class TicketModel
    {
        public string Folio { get; set; }
        public string NombrePlanta { get; set; }
        public string NombreMaterial { get; set; }
        public string FormaPago { get; set; }
        public string TotalPago { get; set; }
        public string Transporte { get; set; }
        public string Placa { get; set; }
        public string Cantidad { get; set; }
        public string PrecioUnidad { get; set; }
        public string Vendedor { get; set; }
        public string RFID { get; set; }
        public string NombreCliente { get; set; }
        public string Fecha { get; set; }

        // Este campo lo usamos para diferenciar el tipo de ticket (ej. Vale de Carga, Vale de Salida, etc.)
        public string TituloSecundario { get; set; }
    }
}
