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
            List<WorkAreaObj> list = _catalogApp.GetAllWorkArea(out OperationResult result);
            response.WorksAreas = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetWorkAreaById")]
        public WorkAreaObjResponse GetWorkAreaById(long id)
        {
            var response = new WorkAreaObjResponse();
            WorkAreaObj list = _catalogApp.GetWorkAreaById(id, out OperationResult result);
            response.WorksAreas = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un area de trabajo
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="desciption"></param>
        /// <returns></returns>
        [HttpPost("SaveOrUpdateWorkArea")]
        public SaveOrUpdateWorkAreaResponse SaveOrUpdateWorkArea(int id, string name, string desciption)
        {
            _catalogApp.SaveOrUpdateWorkArea(id, name, desciption, out OperationResult result);

            var response = new SaveOrUpdateWorkAreaResponse() { 
            Result  = result
            };
            
            return response;
        }
    }
}
