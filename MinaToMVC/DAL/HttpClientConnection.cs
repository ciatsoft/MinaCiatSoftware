using MinaTolEntidades.Security;
using MinaTolEntidades;
using MinaToMVC.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace MinaToMVC.DAL
{
    public partial class HttpClientConnection : HttpClientBase
    {
        private TokenCookie token;
        public HttpClientConnection()
        {
            token = SessionHelper.GetSessionUser();
        }
        public BaseObject MappingColumSecurity(BaseObject o)
        {
            if (o.Id == 0 || o.Id == -1)
            {
                o.CreatedBy = SessionHelper.GetSessionUser().UserName;
                o.CreatedDt = SessionHelper.GetDateCenterMexico();
            }
            else
            {
                o.UpdatedBy = SessionHelper.GetSessionUser().UserName;
                o.UpdatedDt = SessionHelper.GetDateCenterMexico();
            }

            return o;
        }
        public async Task<Token> GetToken(string user, string pass)
        {
            return await TokenAsync<Token>("token",
                new[]
                    {
                        new KeyValuePair<string, string>("grant_type","password"),
                        new KeyValuePair<string, string>("UserName",user),
                        new KeyValuePair<string, string>("Password",pass)
                    }, "application/x-www-url-formencoded");
        }
    }
}