using MinaTolEntidades.DtoCatalogos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoClientes
{
    public class DireccionCliente : BaseObject
    {
        public DireccionCliente() {
            Cliente = new Cliente();

        }

        public Cliente Cliente { get; set; }
        public DtoTipoMaterialUbicacion TipoMaterial { get; set; }
        public string calle { get; set; }
        public string NoExterno { get; set; }
        public string NoInterno { get; set; }
        public string Colonia { get; set; }

        public int Cp { get; set; }
        public string Delegacion { get; set; }
        public string Municipio { get; set; }
        public string Estado{ get; set;}
        public string ClienteID { get; set; }


    }
}
