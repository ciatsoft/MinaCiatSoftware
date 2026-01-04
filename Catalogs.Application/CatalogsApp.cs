using Catalogs.Domain;
using Catalogs.Proxy;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.NetworkInformation;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Catalogs.Application
{
    public class CatalogsApp : ICatalogsApp
    {
        private readonly ICatalogsProxy _catalogsProxy;

        // Constructor para inyección de dependencias
        public CatalogsApp(ICatalogsProxy catalogsProxy)
        {
            _catalogsProxy = catalogsProxy ?? throw new ArgumentNullException(nameof(catalogsProxy));
        }

        #region WorkArea
        public List<WorkAreaObj> GetAllWorkArea(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<WorkAreaObj> response = new List<WorkAreaObj>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllWorkArea();
                response = CatalogsMapp.MappAllWorkArea(responseDT) ?? new List<WorkAreaObj>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null) 
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public WorkAreaObj GetWorkAreaById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            WorkAreaObj response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _catalogsProxy.GetWorkAreaById(id);
                response = CatalogsMapp.MappAllWorkArea(responseDt).First();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public void SaveOrUpdateWorkArea(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (id < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(id)); }
                if (string.IsNullOrEmpty(name)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(name)); }
                if (name.Length > 50) { throw new ArgumentException("El argumento no puede ser mayo de 50 caracteres.", nameof(name)); }
                if (description?.Length > 250) { throw new ArgumentException("La argumento no puede ser mayo de 250 caracteres.", nameof(description)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


                _catalogsProxy.SaveOrUpdateWorkArea(id, name, description, estatus, createdBy, createdDt, updatedBy, updatedDt);
            } 
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el salvado/actualización de los datos." });
            }
        }

        public void DeleteWorkArea(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteWorkArea(id);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el eliminado de los datos." });
            }
        }
        #endregion

        #region LoansCatalog
        public List<LoansCatalog> GetAllLoansCatalog(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<LoansCatalog> response = new List<LoansCatalog>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllLoansCatalog();
                response = CatalogsMapp.MappAllLoansCatalog(responseDT) ?? new List<LoansCatalog>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public List<LoansCatalog> GetLoansCatalogByIdWorkerDates(long id, DateTime dateStart, DateTime dateEnd, out OperationResult result)
        {
            result = new() { Successful = true };
            List<LoansCatalog> response = new List<LoansCatalog>();

            try
            {
                // Validación del ID
                if (id <= 0)
                {
                    throw new ArgumentException("El ID del trabajador debe ser mayor a cero.", nameof(id));
                }

                // Validación CORREGIDA de fechas (DateTime no puede ser null)
                if (dateStart == DateTime.MinValue)
                {
                    throw new ArgumentException("La fecha de inicio no puede estar vacía.", nameof(dateStart));
                }

                if (dateEnd == DateTime.MinValue)
                {
                    throw new ArgumentException("La fecha final no puede estar vacía.", nameof(dateEnd));
                }

                // Validación adicional: lógica de fechas
                if (dateStart > dateEnd)
                {
                    throw new ArgumentException("La fecha de inicio no puede ser mayor que la fecha final.");
                }

                DataTable responseDT = _catalogsProxy.GetLoansCatalogByIdWorkerDates(id, dateStart, dateEnd);
                response = CatalogsMapp.MappAllLoansCatalog(responseDT) ?? new List<LoansCatalog>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }

            return response;
        }

        public void SaveOrUpdateLoansCatalog(long idLoansCatalog, long idWorker, string nameWorker, string name, string description, decimal monto, DateTime date, string userName, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (idLoansCatalog < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(idLoansCatalog)); }
                if (idWorker <= 0) { throw new ArgumentException("El argumento del trabajador no debe ser menor a 0.", nameof(idLoansCatalog)); }
                if (nameWorker?.Length > 50) { throw new ArgumentException("El argumento del nombre trabajador no puede ser vacio y mayo de 50 caracteres.", nameof(nameWorker)); }
                if (name?.Length > 50) { throw new ArgumentException("El argumento del nombre no puede ser vacio y mayo de 50 caracteres.", nameof(name)); }
                if (description?.Length > 250) { throw new ArgumentException("El argumento de la descripcion no puede ser vacia o mayo de 250 caracteres.", nameof(description)); }
                if (monto <= 0) { throw new ArgumentException("El argumento del monto no puede ser menor a 0..", nameof(monto)); }
                if (date == DateTime.MinValue) { throw new ArgumentException("El argumento de la fecha no puede ser vacio.", nameof(date)); }
                if (userName?.Length > 50) { throw new ArgumentException("El argumento del nombre de usuario no puede ser vacio y mayo de 50 caracteres.", nameof(userName)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }


                _catalogsProxy.SaveOrUpdateLoansCatalog(idLoansCatalog, idWorker, nameWorker, name, description, monto, date, userName, createdBy, createdDt, updatedBy, updatedDt, estatus);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }
        }
        public void DeleteLoansCatalog(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteLoansCatalog(id);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }
        }
        #endregion

        #region Roll
        public List<RollObj> GetAllRoll(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<RollObj> response = new List<RollObj>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllRoll();
                response = CatalogsMapp.MappAllRoll(responseDT) ?? new List<RollObj>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public RollObj GetRollById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            RollObj response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _catalogsProxy.GetRollById(id);
                response = CatalogsMapp.MappAllRoll(responseDt).First();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public void SaveOrUpdateRoll(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (id < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(id)); }
                if (string.IsNullOrEmpty(name)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(name)); }
                if (name.Length > 50) { throw new ArgumentException("El argumento no puede ser mayo de 50 caracteres.", nameof(name)); }
                if (string.IsNullOrEmpty(description)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(description)); }
                if (description?.Length > 250) { throw new ArgumentException("La argumento no puede ser mayo de 250 caracteres.", nameof(description)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


                _catalogsProxy.SaveOrUpdateRoll(id, name, description, estatus, createdBy, createdDt, updatedBy, updatedDt);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }
        }

        public void DeleteRoll(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteRoll(id);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el eliminado de los datos." });
            }
        }
        #endregion

        #region TypeExpense
        public List<TypeExpense> GetAllTypeExpense(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<TypeExpense> response = new List<TypeExpense>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllTypeExpense();
                response = CatalogsMapp.MappAllTypeExpense(responseDT) ?? new List<TypeExpense>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }
        public TypeExpense GetTypeExpenseById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            TypeExpense response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _catalogsProxy.GetTypeExpenseById(id);
                response = CatalogsMapp.MappAllTypeExpense(responseDt).First();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }
        public void SaveOrUpdateTypeExpense(long id, string name, string description, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (id < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(id)); }
                if (string.IsNullOrEmpty(name)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(name)); }
                if (name.Length > 50) { throw new ArgumentException("El argumento no puede ser mayo de 50 caracteres.", nameof(name)); }
                if (string.IsNullOrEmpty(description)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(description)); }
                if (description?.Length > 250) { throw new ArgumentException("La argumento no puede ser mayo de 250 caracteres.", nameof(description)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


                _catalogsProxy.SaveOrUpdateTypeExpense(id, name, description, estatus, createdBy, createdDt, updatedBy, updatedDt);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }
        }
        public void DeleteTypeExpense(int id, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteTypeExpense(id);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el eliminado de los datos." });
            }
        }
        #endregion

        #region RolPermission
        public List<RolPermission> GetAllRolPermission(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<RolPermission> response = new List<RolPermission>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllRolPermission();
                response = CatalogsMapp.MappAllRolPermission(responseDT) ?? new List<RolPermission>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public RolPermission GetRolPermissionById(long id, out OperationResult result)
        {
            result = new() { Successful = true };
            RolPermission response = null;

            try
            {
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDt = _catalogsProxy.GetRolPermissionById(id);
                response = CatalogsMapp.MappAllRolPermission(responseDt).First();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }

        public void SaveOrUpdateRolPermission(long id, long idRol, long permisoId, bool estatus, string createdBy, DateTime createdDt, string updatedBy, DateTime updatedDt, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                if (id < 0) { throw new ArgumentException("El argumento no debe ser menor a 0.", nameof(id)); }
                if (idRol <= 0) { throw new ArgumentException("El argumento no debe ser menor a 0 para un Rol.", nameof(idRol)); }
                if (permisoId <= 0) { throw new ArgumentException("El argumento no debe ser menor a 0 para un Permiso.", nameof(permisoId)); }
                if (estatus == false) { throw new ArgumentException("El argumento no debe ser inactivo.", nameof(estatus)); }
                if (string.IsNullOrEmpty(createdBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(createdBy)); }
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (string.IsNullOrEmpty(updatedBy)) { throw new ArgumentException("El autor del registro no puede ser nulo.", nameof(updatedBy)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == DateTime.MinValue) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


                _catalogsProxy.SaveOrUpdateRolPermission(id, idRol, permisoId, estatus, createdBy, createdDt, updatedBy, updatedDt);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = ex.Message });
            }
        }

        public void DeleteRolPermission(int id, int idRol, out OperationResult result)
        {
            result = new() { Successful = true };

            try
            {
                // Validaciones estrictas para eliminación
                if (id <= 0 || idRol <= 0)
                    throw new ArgumentException("El argumento debe ser un número positivo mayor a cero.", nameof(id));

                _catalogsProxy.DeleteRolPermission(id, idRol);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                {
                    result.SystemMessages = new List<SystemMessage>();
                }
                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el eliminado de los datos." });
            }
        }
        #endregion
    }
}