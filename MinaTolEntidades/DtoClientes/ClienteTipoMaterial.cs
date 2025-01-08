using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
    public class ClienteTipoMaterial : BaseObject
    {
        public ClienteTipoMaterial() {
            Cliente = new Cliente();
            TipoMaterial = new DtoTipoMaterialUbicacion();
        }

        public Cliente Cliente { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public decimal P_Mta_M3 { get; set; }
        public decimal P_Flete_M3 { get; set; }
        public decimal Precio_M3 { get; set; }
        public decimal KM_Cargado { get; set; }
        public decimal KM_Basico { get; set; }
        public decimal Total_KM_Recorridos { get; set; }
        public decimal Carga_Disel { get; set; }
        public decimal Total_Diesel_Precio_XLT { get; set; }
        public decimal Casetas { get; set; }
        public decimal Mano_De_Obra { get; set; }
        public decimal Material_Viajes_De_30M3 { get; set; }
        public decimal Total_Gastos { get; set; }
        public decimal Subtotal_Ingreso_Viajes_M3 { get; set; }

    }
}
