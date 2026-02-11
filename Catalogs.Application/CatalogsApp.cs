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
                if (createdBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(createdBy)); }
                if (createdDt == null) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }
                if (updatedBy?.Length > 80) { throw new ArgumentException("El argumento no debe ser mayor a 80 caracteres ni vacio.", nameof(updatedBy)); }
                if (updatedDt == null) { throw new ArgumentException("El argumento no puede ser vacio.", nameof(createdDt)); }


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
                if (id <= 0) { throw new ArgumentException("El argumento debe ser mayor a cero.", nameof(id)); }

                DataTable responseDT = _catalogsProxy.GetLoansCatalogByIdWorkerDates(id, dateStart, dateEnd);
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
        #endregion
    }
}