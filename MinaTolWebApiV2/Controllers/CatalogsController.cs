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

        [HttpPost("GetAllWorkAreaObj")]
        public CatalogsResponse GetAllWorkAreaObj()
        {
            var response = new CatalogsResponse();
            List<WorkAreaObj> list = _catalogApp.GetAllAreaTrabajo(out OperationResult result);
            response.WorksAreas = list;
            response.Result = result;

            return response;
        }
    }
}
