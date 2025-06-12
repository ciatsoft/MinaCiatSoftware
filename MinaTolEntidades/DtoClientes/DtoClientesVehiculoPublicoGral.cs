using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MinaTolEntidades.DtoClientes;

namespace MinaTolEntidades.DtoClientes
{
    public class DtoClientesVehiculoPublicoGral : BaseObject
    {
        public string Nombre { get; set; }

        public int Capacidad { get; set; }

        public DtoClientesVehiculoPublicoGral()
        {
            ClienteID = new Cliente();
        }

        public Cliente ClienteID { get; set; }

        public string Color { get; set; }

        public string Placa { get; set; }


    }
}
