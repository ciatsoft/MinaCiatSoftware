using Branches.Application;
using Branches.Domain;
using Branches.Messages;
using Catalogs.Domain;
using Catalogs.Messages;
using Common.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MinaTolWebApiV2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BranchesController : ControllerBase
    {
        private readonly IBranchesApp _branchesApp;
        public BranchesController(IBranchesApp branchesApp)
        {
            _branchesApp = branchesApp;
        }

        #region UnitMeasurement
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllUnitMeasurement")]
        public UnitMeasurementListResponse GetAllUnitMeasurement()
        {
            var response = new UnitMeasurementListResponse();
            List<UnitMeasurement> list = _branchesApp.GetAllUnitMeasurement(out OperationResult result);
            response.UnitMeasurement = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetUnitMeasurementById")]
        public UnitMeasurementResponse GetUnitMeasurementById(long id)
        {
            var response = new UnitMeasurementResponse();
            UnitMeasurement list = _branchesApp.GetUnitMeasurementById(id, out OperationResult result);
            response.UnitMeasurement = list;
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
        [HttpPost("SaveOrUpdateUnitMeasurement")]
        public SaveOrUpdateUnitMeasurementResponse SaveOrUpdateUnitMeasurement([FromBody] UnitMeasurement obj)
        {
            _branchesApp.SaveOrUpdateUnitMeasurement(obj.Id, obj.Name, obj.Description, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateUnitMeasurementResponse()
            {
                Result = result
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
        [HttpDelete("DeleteUnitMeasurement")]
        public DeleteUnitMeasurementResponse DeleteUnitMeasurement(int id)
        {
            _branchesApp.DeleteUnitMeasurement(id, out OperationResult result);

            var response = new DeleteUnitMeasurementResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

    }
}
