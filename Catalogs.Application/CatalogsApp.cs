using Catalogs.Domain;
using Catalogs.Proxy;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

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

        public void SaveOrUpdateWorkArea(int id, string name, string desciption, out OperationResult result)
        {
            result = new() { Successful = true };
            try
            {
                if (string.IsNullOrEmpty(name)) { throw new ArgumentException("El argumento no puede ser nulo o vacio.", nameof(name)); }
                if (name.Length > 50) { throw new ArgumentException("La argumento no puede ser mayo de 50 caracteres.", nameof(name)); }
                if (desciption?.Length > 250) { throw new ArgumentException("La argumento no puede ser mayo de 250 caracteres.", nameof(desciption)); }

                _catalogsProxy.SaveOrUpdateWorkArea(id, desciption, name);
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null)
                    result.SystemMessages = new List<SystemMessage>();

                result.SystemMessages.Add(new SystemMessage() { Message = "No es posible realizar el salvado/actualización de los datos." });
            }
        }
    }
}