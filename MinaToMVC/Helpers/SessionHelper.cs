using MinaTolEntidades.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace MinaToMVC.Helpers
{
    public class SessionHelper
    {
        public static bool EixstSession()
        {
            var token = GetSessionUser();
            //if (token != null && token.Token != null && token.Token.ExpirationDate <= DateTime.Now)
            if (token == null)
            {
                return false;
            }
            else
            {
                if (token.Token == null)
                    return false;
                else
                {
                    if (token.Token.ExpirationDate >= DateTime.Now)
                        return true;
                    else
                        return false;
                }

            }


        }

        public static void CloseSession()
        {
            FormsAuthentication.SignOut();
        }

        public static TokenCookie GetSessionUser()
        {
            TokenCookie u = null;

            if (HttpContext.Current.User != null && HttpContext.Current.User.Identity is FormsIdentity)
            {
                FormsAuthenticationTicket ticket = ((FormsIdentity)HttpContext.Current.User.Identity).Ticket;

                if (ticket != null)
                {
                    u = JsonConvert.DeserializeObject<TokenCookie>(ticket.UserData);
                }
            }

            return u;
        }

        public static void CreateSession(string id)
        {
            var tokenCookie = JsonConvert.DeserializeObject<TokenCookie>(id);
            bool persist = true;
            var cookie = FormsAuthentication.GetAuthCookie("token", persist);

            cookie.Name = FormsAuthentication.FormsCookieName;
            cookie.Expires = tokenCookie.Token.ExpirationDate;

            var ticket = FormsAuthentication.Decrypt(cookie.Value);
            var newTicket = new FormsAuthenticationTicket(ticket.Version, ticket.Name, ticket.IssueDate, cookie.Expires, ticket.IsPersistent, id);

            cookie.Value = FormsAuthentication.Encrypt(newTicket);
            HttpContext.Current.Response.Cookies.Add(cookie);
        }
        public static DateTime GetDateCenterMexico()
        {
            DateTime timeUtc = DateTime.UtcNow;

            TimeZoneInfo cstZone = TimeZoneInfo.FindSystemTimeZoneById("Central Standard Time");
            DateTime cstTime = TimeZoneInfo.ConvertTimeFromUtc(timeUtc, cstZone);

            return cstTime;
        }
    }
}