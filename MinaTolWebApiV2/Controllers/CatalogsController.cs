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

        #region WorkArea
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllWorkAreaObj")]
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
        /// <param name="estatus"></param>
        /// <param name="createdBy"></param>
        /// <param name="createdDt"></param>
        /// <param name="updatedBy"></param>
        /// <param name="updatedDt"></param>
        /// <returns></returns>
        [HttpPost("SaveOrUpdateWorkArea")]
        public SaveOrUpdateWorkAreaResponse SaveOrUpdateWorkArea([FromBody] WorkAreaObj obj)
        {
            _catalogApp.SaveOrUpdateWorkArea(obj.Id, obj.Name, obj.Description, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateWorkAreaResponse() { 
            Result  = result
            };
            
            return response;
        }

        /// <summary>
        /// Método que elimina logicamente el area de trabajo
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="desciption"></param>
        /// <returns></returns>
        [HttpDelete("DeleteWorkArea")]
        public DeleteWorkAreaResponse DeleteWorkArea(int id)
        {
            _catalogApp.DeleteWorkArea(id, out OperationResult result);

            var response = new DeleteWorkAreaResponse() { 
            Result  = result
            };
            
            return response;
        }
        #endregion 

        #region Loans Catalog
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllLoansCatalog")]
        public LoansCatalogListResponse GetAllLoansCatalog()
        {
            var response = new LoansCatalogListResponse();
            List<LoansCatalog> list = _catalogApp.GetAllLoansCatalog(out OperationResult result);
            response.LoansCatalog = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetLoansCatalogByIdWorkerDates")]
        public LoansCatalogResponse GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd)
        {
            var response = new LoansCatalogResponse();
            List<LoansCatalog> list = _catalogApp.GetLoansCatalogByIdWorkerDates(id, dateStart, dateEnd, out OperationResult result);
            response.LoansCatalog = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un prestamo
        /// </summary>
        /// <returns></returns>
        [HttpPost("SaveOrUpdateLoansCatalog")]
        public SaveOrUpdateLoansCatalogResponse SaveOrUpdateLoansCatalog([FromBody] LoansCatalog obj)
        {
            _catalogApp.SaveOrUpdateLoansCatalog(obj.Id, obj.IdWorker, obj.NameWorker, obj.Name, obj.Description, obj.Monto, obj.Date, obj.UserName, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateLoansCatalogResponse()
            {
                Result = result
            };

            return response;
        }

        /// <summary>
        /// Método que elimina logicamente el prestamo
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("DeleteLoansCatalog")]
        public DeleteLoansCatalogResponse DeleteLoansCatalog(int id)
        {
            _catalogApp.DeleteLoansCatalog(id, out OperationResult result);

            var response = new DeleteLoansCatalogResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

        #region Roll
        /// <summary>
        /// Método que regresa un listado de roles
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllRoll")]
        public RollListResponse GetAllRoll()
        {
            var response = new RollListResponse();
            List<RollObj> list = _catalogApp.GetAllRoll(out OperationResult result);
            response.Roll = list;
            response.Result = result;

            return response;
        }
        #endregion
    }
}
