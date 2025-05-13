using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades.DtoViajes
{
    public class DtoFoliador : BaseObject
    {
        public DtoFoliador()
        {
            CalcualrConsecutivoString();
        }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public long Consecutivo { get; set; }
        public string ConsecutivoString { get; set; } // Formateado para mostrar
        public DtoFoliador CalcualrConsecutivoString()
        {
            Consecutivo = Consecutivo + 1;
            var longitudConsecutivo = Consecutivo.ToString().Length;

            switch (longitudConsecutivo)
            {
                case 1:
                    ConsecutivoString = $"0000{Consecutivo}";
                    break;
                case 2:
                    ConsecutivoString = $"000{Consecutivo}";
                    break;
                case 3:
                    ConsecutivoString = $"00{Consecutivo}";
                    break;
                case 4:
                    ConsecutivoString = $"0{Consecutivo}";
                    break;
                case 5:
                    ConsecutivoString = $"{Consecutivo}";
                    break;
            }

            return this;
        }
    }
}
