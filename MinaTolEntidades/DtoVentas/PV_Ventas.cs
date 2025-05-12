using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoVentas
{
    public class PV_Ventas : BaseObject
    {
        public string Folio { get; set; }
        public DtoUbicacion Ubicacion { get; set; }
        public long PV_PlantaId { get; set; }
        public string NombreUbicacion { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public long PV_MaterialId { get; set; }
        public string NombreTipoMaterial { get; set; }
        public string FormaDePago { get; set; }
        public string CantidadRecibida { get; set; }
        public string Transporte { get; set; }
        public string Placa { get; set; }
        public string Cantidad { get; set; }
        public UnidadMedida UnidadMedida { get; set; }
        public long UnidadMedidaId { get; set; }
        public string NombreUnidadMedida { get; set; }
        public Usuario Usuario { get; set; }
        public long UsuarioId { get; set; }
        public string UserName { get; set; }
        public string EstatusVenta { get; set; }
        public int TotalPago { get; set; }
        public decimal PrecioUnidad { get; set; }
        public DateTime Fecha { get; set; }
    }
}
