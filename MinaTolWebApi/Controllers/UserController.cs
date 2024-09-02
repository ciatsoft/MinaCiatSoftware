using Microsoft.AspNet.Identity;
using MinaTolEntidades;
using MinaTolEntidades.Security;
using MinaTolWebApi.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace MinaTolWebApi.Controllers
{
    [Authorize]
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        public DbWrapper dbWrapper { get; set; }
        public UserController()
        {
            dbWrapper = new DbWrapper();
        }

        [AllowAnonymous]
        [Route("ok"), HttpGet]
        public async Task<IHttpActionResult> GetOk()
        {
            return Ok();
        }

        [AllowAnonymous]
        [HttpGet, Route("{UserID:long}")]
        public ModelResponse GetUserById(long UserID)
        {
            var result = dbWrapper.GetUserById(UserID);
            return result;
        }
        [HttpGet, Route("List")]
        public ModelResponse GetAllUsers()
        {
            var result = dbWrapper.GetAllUsuario();
            return result;
        }
        [HttpPost, Route("")]
        public ModelResponse SaveOrUpdateUsuario(Usuario u)
        {
            var result = dbWrapper.SaveOrUpdateUsuario(u);
            return result;
        }
    }
}

//comentario de Emmanuel


//Comentario de Natanias