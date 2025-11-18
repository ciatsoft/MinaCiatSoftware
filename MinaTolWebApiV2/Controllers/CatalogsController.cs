using Catalogs.Application;
using Catalogs.Domain;
using Catalogs.Messages;
using Common.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MinaTolWebApiV2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CatalogsController : ControllerBase
    {
        private readonly ICatalogsApp _catalogApp;
        public CatalogsController(ICatalogsApp catalogApp) // Inject ICatalogApp via constructor
        {
            _catalogApp = catalogApp;
        }

        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpPost("GetAllWorkAreaObj")]
        public WorkAreaObjListResponse GetAllWorkAreaObj()
        {
            var response = new WorkAreaObjListResponse();
            List<WorkAreaObj> list = _catalogApp.GetAllAreaTrabajo(out OperationResult result);
            response.WorksAreas = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetAreaTrabajoById")]
        public WorkAreaObjResponse GetAreaTrabajoById(long id)
        {
            var response = new WorkAreaObjResponse();
            WorkAreaObj list = _catalogApp.GetAreaTrabajoById(id, out OperationResult result);
            response.WorksAreas = list;
            response.Result = result;

            return response;
        }
    }
}
