using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MinaTolEntidades
{
    public class ModelResponse
    {
        public ModelResponse()
        {
            Enum = Enumeration.IsSuccess;
            IsSuccess = true;
        }

        public bool IsSuccess { get; set; }
        public string Message { get; set; }
        public object Response { get; set; }
        public Enumeration Enum { get; set; }
    }

    public class ModelSend : ModelResponse
    {
        public object Send { get; set; }
    }

    public class ErrorResponse
    {
        public string Message { get; set; }
        public int NumError { get; set; }
    }

    public enum Enumeration
    {
        [Description("La solicitud es exitosa")]
        IsSuccess,
        [Description("")]
        ErrorNoControlado,
        [Description("Usuario o Contraseña incorrecta.")]
        ErrorDeAutenticacion,
        [Description("Email se encuentra en uso.")]
        ErrorEmailIsAlreadyInUse,
        [Description("Archivo no cargado.")]
        FileNotLoad
    }
    public static class EnumExtensionMethods
    {
        public static string GetDescription(this Enum GenericEnum)
        {
            Type genericEnumType = GenericEnum.GetType();
            MemberInfo[] memberInfo = genericEnumType.GetMember(GenericEnum.ToString());
            if ((memberInfo != null && memberInfo.Length > 0))
            {
                var _Attribs = memberInfo[0].GetCustomAttributes(typeof(System.ComponentModel.DescriptionAttribute), false);
                if ((_Attribs != null && _Attribs.Count() > 0))
                {
                    return ((System.ComponentModel.DescriptionAttribute)_Attribs.ElementAt(0)).Description;
                }
            }
            return GenericEnum.ToString();
        }

    }
    public class ModelResponseObject
    {
        public long Id { get; set; }
        public string Folio { get; set; }
        public string Tipo { get; set; }
        public string CreadoPor { get; set; }
        public DateTime Fecha { get; set; }
        public decimal Monto { get; set; }
        public string Acronimo { get; set; }
    }
}
