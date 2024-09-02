using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Web;

namespace MinaToMVC.Helpers
{
    public static class EmailHelper
    {
        public static void EnvioEmaiil(IEnumerable<string> para, string asunto, string mensaje, bool ssl = false, string attachment = "")
        {
            try
            {
                var de = ConfigurationManager.AppSettings["userEmail"].ToString();
                var pass = ConfigurationManager.AppSettings["passEmail"].ToString();
                var smtpURL = ConfigurationManager.AppSettings["smtpClient"].ToString();
                var puerto = Convert.ToInt32(ConfigurationManager.AppSettings["port"].ToString());

                MailMessage mail = new MailMessage();
                mail.From = new MailAddress(de, "LeaderPeople Corporativo");

                foreach (var p in para)
                {
                    mail.To.Add(p);
                }

                mail.IsBodyHtml = true;
                mail.Subject = asunto;
                mail.Body = mensaje;

                // em caso de anexos
                if (!string.IsNullOrEmpty(attachment))
                    mail.Attachments.Add(new Attachment(attachment));

                using (var smtp = new SmtpClient(smtpURL))
                {
                    smtp.EnableSsl = true; // GMail requer SSL
                    smtp.Port = puerto;       // porta para SSL
                    smtp.DeliveryMethod = SmtpDeliveryMethod.Network; // modo de envio
                    smtp.UseDefaultCredentials = false; // vamos utilizar credencias especificas

                    // seu usuário e senha para autenticação
                    smtp.Credentials = new NetworkCredential(de, pass);

                    // envia o e-mail
                    if (para.Count() != 0)
                        smtp.Send(mail);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static string Plantilla(string message, string img = "http://leaderpeopletst.desipr.com.mx/Assets/img/email/title.jpg")
        {
            return $"<html><body><center><img src='{img}' width='23%'/>" +
                    $"<p style='font-size: 20px;color:#003366;font-style: normal;'>{message}" +
                    "</p><br/><footer style='background-color:#66CCFF;height:30px;padding:15px;'><div style=''>" +
                    "<i style='font-size: 18px; font-style: normal;'>&#x1f4f1; (800) 220 2015</i>&nbsp;&nbsp;&nbsp;" +
                    "<i style='font-size: 18px; font-style: normal;'>&#x1f4e9;contacto@lpcorp.com.mx</i>&nbsp;&nbsp;&nbsp;" +
                    "<a style='font-size: 18px; font-style: normal; text-decoration:none' href = 'http://lpcorp.com.mx/aviso_privacidad.php'>" +
                    "&#169;&#65039; 2020. Aviso de Privacidad</a></div></footer></center></body></html> ";
        }
    }
}