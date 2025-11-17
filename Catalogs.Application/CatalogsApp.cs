using Catalogs.Domain;
using Catalogs.Proxy;
using Common.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
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

        public List<WorkAreaObj> GetAllAreaTrabajo(out OperationResult result)
        {
            result = new() { Successful = true, SystemMessages = new List<SystemMessage>() };
            List<WorkAreaObj> response = new List<WorkAreaObj>();
            try
            {
                DataTable responseDT = _catalogsProxy.GetAllAreaTrabajo();
                response = CatalogsMapp.MappCatalogs(responseDT) ?? new List<WorkAreaObj>();
            }
            catch (Exception ex)
            {
                result.Successful = false;
                if (result.SystemMessages == null) result.SystemMessages = new List<SystemMessage>();
                result.SystemMessages.Add(new SystemMessage() { Message = "Ocurrio un error al obtener las soruces y fondos del participante." });
            }

            return response;
        }
    }
}