﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoCatalogos
{
   public class DtoRoll: BaseObject
    {
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string NombreUbicacion { get; set; }
        public string DescripcionUbicacion { get; set; }

    }
}