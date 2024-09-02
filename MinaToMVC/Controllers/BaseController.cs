using MinaTolEntidades;
using MinaTolEntidades.Security;
using MinaToMVC.DAL;
using MinaToMVC.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Net.Mail;
using System.Reflection;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class BaseController : Controller
    {
        public HttpClientConnection httpClientConnection;
        Usuario userAutenticated;
        public ModelResponse mr { get; set; }

        public BaseController()
        {
            httpClientConnection = new HttpClientConnection();
            mr = new ModelResponse();
            var token = SessionHelper.GetSessionUser();

            if (token?.Token?.ExpirationDate <= DateTime.Now)
            {
                SessionHelper.CloseSession();
                Redirect("~/Home/Autenticacion");
            }
        }
        public List<SelectListItem> MappingPropertiToDropDownList<T>(IEnumerable<T> items, string value, string title, string prefix = "")
        {
            List<SelectListItem> list = new List<SelectListItem>();

            foreach (var r in items)
            {
                var id = r.GetType().GetProperty(value);
                var nombre = r.GetType().GetProperty(title);

                PropertyInfo segundoNombre = null;
                if (!string.IsNullOrEmpty(prefix))
                    segundoNombre = r.GetType().GetProperty(prefix);

                list.Add(new SelectListItem()
                {
                    Value = id.GetValue(r).ToString(),
                    Text = (string.IsNullOrEmpty(prefix) && segundoNombre == null) ? nombre.GetValue(r).ToString() : $"{segundoNombre.GetValue(r).ToString()}-{nombre.GetValue(r).ToString()}"
                });
            }

            return list;
        }
        public string DescriptionAttr<T>(T source)
        {
            FieldInfo fi = source.GetType().GetField(source.ToString());

            DescriptionAttribute[] attributes = (DescriptionAttribute[])fi.GetCustomAttributes(
                typeof(DescriptionAttribute), false);

            if (attributes != null && attributes.Length > 0) return attributes[0].Description;
            else return source.ToString();
        }
        //public async Task<bool> ValidatedPermissionUrl(string url)
        //{
        //    var token = SessionHelper.GetSessionUser();
        //    var permissions = await httpClientConnection.GetPermissionByUsuario(token.UserID);

        //    var validated = false;

        //    foreach (var i in permissions)
        //    {
        //        if (i.Url?.Equals(url) ?? false)
        //        {
        //            validated = true;
        //        }
        //    }

        //    return validated;
        //}
        public bool IsValidEmail(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);

                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}