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

        #region Location
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllLocation")]
        public LocationListResponse GetAllLocation()
        {
            var response = new LocationListResponse();
            List<Location> list = _catalogApp.GetAllLocation(out OperationResult result);
            response.Location = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetLocationById")]
        public LocationResponse GetLocationById(long id)
        {
            var response = new LocationResponse();
            List<Location> list = _catalogApp.GetLocationById(id, out OperationResult result);
            response.Location = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un prestamo
        /// </summary>
        /// <returns></returns>
        [HttpPost("SaveOrUpdateLocation")]
        public SaveOrUpdateLocationResponse SaveOrUpdateLocation([FromBody] Location obj)
        {
            _catalogApp.SaveOrUpdateLocation(obj.Id, obj.NameLocation, obj.DescriptionLocation, obj.IsInternal, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateLocationResponse()
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
        [HttpDelete("DeleteLocation")]
        public DeleteLocationResponse DeleteLocation(int id)
        {
            _catalogApp.DeleteLocation(id, out OperationResult result);

            var response = new DeleteLocationResponse()
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

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetRollById")]
        public RollResponse GetRollById(long id)
        {
            var response = new RollResponse();
            RollObj list = _catalogApp.GetRollById(id, out OperationResult result);
            response.Roll = list;
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
        [HttpPost("SaveOrUpdateRoll")]
        public SaveOrUpdateRollResponse SaveOrUpdateRoll([FromBody] RollObj obj)
        {
            _catalogApp.SaveOrUpdateRoll(obj.Id, obj.Name, obj.Description, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateRollResponse()
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
        [HttpDelete("DeleteRoll")]
        public DeleteRollResponse DeleteRoll(int id)
        {
            _catalogApp.DeleteRoll(id, out OperationResult result);

            var response = new DeleteRollResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

        #region TypeExpense
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllTypeExpense")]
        public TypeExpenseListResponse GetAllTypeExpense()
        {
            var response = new TypeExpenseListResponse();
            List<TypeExpense> list = _catalogApp.GetAllTypeExpense(out OperationResult result);
            response.TypeExpense = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetTypeExpenseById")]
        public TypeExpenseResponse GetTypeExpenseById(long id)
        {
            var response = new TypeExpenseResponse();
            TypeExpense list = _catalogApp.GetTypeExpenseById(id, out OperationResult result);
            response.TypeExpense = list;
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
        [HttpPost("SaveOrUpdateTypeExpense")]
        public SaveOrUpdateTypeExpenseResponse SaveOrUpdateTypeExpense([FromBody] TypeExpense obj)
        {
            _catalogApp.SaveOrUpdateTypeExpense(obj.Id, obj.Name, obj.Description, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateTypeExpenseResponse()
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
        [HttpDelete("DeleteTypeExpense")]
        public DeleteTypeExpenseResponse TypeExpense(int id)
        {
            _catalogApp.DeleteTypeExpense(id, out OperationResult result);

            var response = new DeleteTypeExpenseResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

        #region RolPermission
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllRolPermission")]
        public RolPermissionListResponse GetAllRolPermission()
        {
            var response = new RolPermissionListResponse();
            List<RolPermission> list = _catalogApp.GetAllRolPermission(out OperationResult result);
            response.RolPermissions = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetRolPermissionById")]
        public RolPermissionResponse GetRolPermissionById(long id)
        {
            var response = new RolPermissionResponse();
            RolPermission list = _catalogApp.GetRolPermissionById(id, out OperationResult result);
            response.RolPermission = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un area de trabajo
        /// </summary>
        /// <param name="id"></param>
        /// <param name="idrol"></param>
        /// <param name="permisoid"></param>
        /// <param name="estatus"></param>
        /// <param name="createdBy"></param>
        /// <param name="createdDt"></param>
        /// <param name="updatedBy"></param>
        /// <param name="updatedDt"></param>
        /// <returns></returns>
        [HttpPost("SaveOrUpdateRolPermission")]
        public SaveOrUpdateRolPermissionResponse SaveOrUpdateRolPermission([FromBody] RolPermission obj)
        {
            _catalogApp.SaveOrUpdateRolPermission(obj.Id, obj.IdRol, obj.PermisoId, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdateRolPermissionResponse()
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
        [HttpDelete("DeleteRolPermission")]
        public DeleteRolPermissionResponse DeleteRolPermission(int id, int idRol)
        {
            _catalogApp.DeleteRolPermission(id, idRol, out OperationResult result);

            var response = new DeleteRolPermissionResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

        #region PaymentMethod
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllPaymentMethod")]
        public PaymentMethodListResponse GetAllPaymentMethod()
        {
            var response = new PaymentMethodListResponse();
            List<PaymentMethod> list = _catalogApp.GetAllPaymentMethod(out OperationResult result);
            response.PaymentMethod = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetPaymentMethodById")]
        public PaymentMethodResponse GetPaymentMethodById(long id)
        {
            var response = new PaymentMethodResponse();
            List<PaymentMethod> list = _catalogApp.GetPaymentMethodById(id, out OperationResult result);
            response.PaymentMethod = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un prestamo
        /// </summary>
        /// <returns></returns>
        [HttpPost("SaveOrUpdatePaymentMethod")]
        public SaveOrUpdatePaymentMethodResponse SaveOrUpdatePaymentMethod([FromBody] PaymentMethod obj)
        {
            _catalogApp.SaveOrUpdatePaymentMethod(obj.Id, obj.Name, obj.Description, obj.Estatus, obj.CreatedBy, obj.CreatedDt, obj.UpdatedBy, obj.UpdatedDt, out OperationResult result);

            var response = new SaveOrUpdatePaymentMethodResponse()
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
        [HttpDelete("DeletePaymentMethod")]
        public DeletePaymentMethodResponse DeletePaymentMethod(int id)
        {
            _catalogApp.DeletePaymentMethod(id, out OperationResult result);

            var response = new DeletePaymentMethodResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion

        #region Permissions
        /// <summary>
        /// Método que regresa un listado de areas de trabajo
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetAllPermissions")]
        public PermissionsListResponse GetAllPermissions()
        {
            var response = new PermissionsListResponse();
            List<Permissions> list = _catalogApp.GetAllPermissions(out OperationResult result);
            response.Permissions = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que regresa un area de trabajo por Id
        /// </summary>
        /// <param name="id">Identificador del area de trabajo</param>
        /// <returns></returns>
        [HttpPost("GetPermissionsById")]
        public PermissionsResponse GetPermissionsById(long id)
        {
            var response = new PermissionsResponse();
            Permissions list = _catalogApp.GetPermissionsById(id, out OperationResult result);
            response.Permissions = list;
            response.Result = result;

            return response;
        }

        /// <summary>
        /// Método que guarda o actualiza un permiso
        /// </summary>
        [HttpPost("SaveOrUpdatePermissions")]
        public SaveOrUpdatePermissionsResponse SaveOrUpdatePermissions([FromBody] Permissions obj)
        {
            long parentPermissionId = obj.ParentPermissionId ?? 0;

            _catalogApp.SaveOrUpdatePermissions(
                obj.Id,
                obj.URLWindow,
                obj.Name,
                obj.Description,
                obj.TypeMenu,
                parentPermissionId,
                obj.Order,
                obj.Estatus,
                obj.CreatedBy,
                obj.CreatedDt,
                obj.UpdatedBy,
                obj.UpdatedDt,
                out OperationResult result
            );

            return new SaveOrUpdatePermissionsResponse
            {
                Result = result
            };
        }

        /// <summary>
        /// Método que elimina logicamente el area de trabajo
        /// </summary>
        /// <param name="id"></param>
        /// <param name="name"></param>
        /// <param name="desciption"></param>
        /// <returns></returns>
        [HttpDelete("DeletePermissions")]
        public DeletePermissionsResponse DeletePermissions(int id)
        {
            _catalogApp.DeletePermissions(id, out OperationResult result);

            var response = new DeletePermissionsResponse()
            {
                Result = result
            };

            return response;
        }
        #endregion
    }
}
