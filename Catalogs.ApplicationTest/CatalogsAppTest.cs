using Catalogs.Application;
using Catalogs.Domain;
using Catalogs.Proxy;
using Common.Domain;
using Moq;
using System.Data;

namespace Catalogs.ApplicationTest
{
    [TestClass]
    public sealed class CatalogsAppTest
    {
        private readonly Mock<ICatalogsProxy> _catalogsProxy;
        private readonly CatalogsApp _catalogsApp;

        public CatalogsAppTest()
        {
            _catalogsProxy = new Mock<ICatalogsProxy>();
            _catalogsApp = new CatalogsApp(_catalogsProxy.Object);
        }

        [TestMethod, TestCategory("WorkArea")]
        public void GetAllWorkArea()
        {
            var dt = new DataTable();
            dt.Columns.Add("Id", typeof(long));
            dt.Columns.Add("Nombre", typeof(string));
            dt.Columns.Add("Descripcion", typeof(string));
            dt.Rows.Add(1, "Area de pruebas 1", "Area de pruebas 1");
            dt.Rows.Add(2, "Area de pruebas 2", "Area de pruebas 2");

            _catalogsProxy.Setup(x => x.GetAllWorkArea()).Returns(dt);

            OperationResult result;
            var response = _catalogsApp.GetAllWorkArea(out result);

            Assert.IsNotNull(response);
            Assert.IsTrue(result.Successful);
        }

        [TestMethod, TestCategory("WorkArea")]
        [DataRow(1)]
        public void GetWorkAreaById(long id)
        {
            var dt = new DataTable();
            dt.Columns.Add("Id", typeof(long));
            dt.Columns.Add("Nombre", typeof(string));
            dt.Columns.Add("Descripcion", typeof(string));
            dt.Rows.Add(1, "Area de pruebas 1", "Area de pruebas 1");

            _catalogsProxy.Setup(x => x.GetWorkAreaById(id)).Returns(dt);

            OperationResult result;
            var response = _catalogsApp.GetWorkAreaById(id, out result);

            Assert.IsNotNull(response);
            Assert.IsTrue(result.Successful);
        }
    }
}
