using MinaTolEntidades;
using MinaTolEntidades.DtoCatalogos;
using MinaTolEntidades.DtoClientes;
using MinaTolEntidades.DtoSucursales;
using MinaTolEntidades.DtoTaller;
using MinaTolEntidades.Security;
using MinaToMVC.Helpers;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Hosting;
using System.Web.Mvc;
using static MinaToMVC.Controllers.Filters.FiltersHelper;

namespace MinaToMVC.Controllers
{

    public class TallerController : BaseController
    {
        #region View
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Autenticacion()
        {
            return View();
        }
        public async Task<ActionResult> Vehiculos(long id = 0)
        {
            Vehiculo v = null;

            if (id != 0)
            {
                var modelResponse = await httpClientConnection.GetVehiculoById(id);
                v = JsonConvert.DeserializeObject<Vehiculo>(modelResponse.Response.ToString());
            }

            var trabajadores = new List<DtoTrabajador>();
            var vehiculos = new List<TipoVehiculo>();
            var areas = new List<DtoAreaTrabajo>();

            var responseVehiculo = await httpClientConnection.GetAllTipoVehiculo();
            vehiculos = JsonConvert.DeserializeObject<List<TipoVehiculo>>(responseVehiculo.Response.ToString());
            var tipovehiculos = MappingPropertiToDropDownList(vehiculos, "Id", "Nombre");

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            var token = Helpers.SessionHelper.GetSessionUser();
            var responseareas = await httpClientConnection.GetAllAreaTrabajo();
            areas = JsonConvert.DeserializeObject<List<DtoAreaTrabajo>>(responseareas.Response.ToString());

            ViewBag.vehiculos = tipovehiculos;
            ViewBag.trabajadores = trabajadores;
            ViewBag.areas = areas;

            return View(v);
        }
        public async Task<ActionResult> Inventario_Taller(long id = 0)
        {
            Inventario inventario = new Inventario();

            if( id != 0)
            {
                var result = await httpClientConnection.GetInventarioById(id);
                inventario = JsonConvert.DeserializeObject<Inventario>(result.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            var categoriasInventarioResponse = await httpClientConnection.GetAllCategoriaInventario();
            var categoriaInventario = JsonConvert.DeserializeObject<List<CategoriaInventario>>(categoriasInventarioResponse.Response.ToString());
            var categoriaInventarioDdl = MappingPropertiToDropDownList<CategoriaInventario>(categoriaInventario, "Id", "Nombre");

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.CategoriaInventario = categoriaInventarioDdl;

            return View(inventario);
        }
        public async Task<ActionResult> CategoriaInventario(long id = 0)
        {
            CategoriaInventario categoriaInventario = new CategoriaInventario();

            if (id != 0)
            {
                var result = await httpClientConnection.GetCategoriaInventarioById(id);
                categoriaInventario = JsonConvert.DeserializeObject<CategoriaInventario>(result.Response.ToString());
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return View(categoriaInventario);
        }
        public ActionResult Demo()
        {
            return View();
        }
        public async Task<ActionResult> ReparacionVehiculos(long id = 0)
        {
            ReparacionVehiculos reparacionVehiculos = new ReparacionVehiculos();
            var trabajadores = new List<DtoTrabajador>();

            if (id != 0)
            {
                var result = await httpClientConnection.GetReparacionVehiculosById(id);
                reparacionVehiculos = JsonConvert.DeserializeObject<ReparacionVehiculos>(result.Response.ToString());
            }
            else
            {
                reparacionVehiculos.Fecha = DateTime.Now;
            }

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            }; 
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            var tipoVehiculos = System.Configuration.ConfigurationManager.AppSettings["TipoVehiculo"]?.ToString()
                .Split('|')
                .ToList() ?? new List<string>();

            var tipoServicio = System.Configuration.ConfigurationManager.AppSettings["TipoServicioTaller"]?.ToString()
                .Split('|')
                .ToList() ?? new List<string>();

            var responsetrabajadores = await httpClientConnection.GetAllEmpleados();
            trabajadores = JsonConvert.DeserializeObject<List<DtoTrabajador>>(responsetrabajadores.Response.ToString());

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.TiposVehiculos = tipoVehiculos;
            ViewBag.TipoServicio = tipoServicio;
            ViewBag.Trabajadores = trabajadores;
            ViewBag.RegistroId = id;
            ViewBag.EsNuevoRegistro = id == 0;

            return View(reparacionVehiculos);
        }
        public async Task<ActionResult> ResumenReparacionVehiculo(long id)
        {
            ReparacionVehiculos reparacionVehiculos = new ReparacionVehiculos();
            var result = await httpClientConnection.GetReparacionVehiculosById(id);
            reparacionVehiculos = JsonConvert.DeserializeObject<ReparacionVehiculos>(result.Response.ToString());

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            var tipoVehiculos = System.Configuration.ConfigurationManager.AppSettings["TipoVehiculo"]?.ToString()
                .Split('|')
                .ToList() ?? new List<string>();

            var tipoServicio = System.Configuration.ConfigurationManager.AppSettings["TipoServicioTaller"]?.ToString()
                .Split('|')
                .ToList() ?? new List<string>();

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.TiposVehiculos = tipoVehiculos;
            ViewBag.TipoServicio = tipoServicio;

            return View(reparacionVehiculos);
        }
        #endregion

        #region PartialViews
        public async Task<ActionResult> PartialComponenteVehiculo(long id)
        {
            ComponenteVehiculo componenteVehiculo = new ComponenteVehiculo();

            var inventarioResponse = await httpClientConnection.GetInventarioById(id);
            var inventario = JsonConvert.DeserializeObject<Inventario>(inventarioResponse.Response.ToString());

            var vehiculosResponse = await httpClientConnection.GetAllVehiculo();
            var vehiculos = JsonConvert.DeserializeObject<List<Vehiculo>>(vehiculosResponse.Response.ToString());

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };

            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            // Asignar valores al modelo principal
            componenteVehiculo.IdInventario = inventario.Id;
            componenteVehiculo.NombreInventario = inventario.Nombre;
            componenteVehiculo.CreatedBy = usuarioToken.UserName;
            componenteVehiculo.UpdatedBy = usuarioToken.UserName;
            componenteVehiculo.CreatedDt = DateTime.Now;
            componenteVehiculo.UpdatedDt = DateTime.Now;

            ViewBag.Inventario = inventario;
            ViewBag.Vehiculos = vehiculos;
            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;

            return PartialView(componenteVehiculo);
        }
        public async Task<ActionResult> PartialViewModalRetirarPiezas(long id, int tipoVehiculo, long idVehiculo)
        {            
            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            var categoriasInventarioResponse = await httpClientConnection.GetAllCategoriaInventario();
            var categoriaInventario = JsonConvert.DeserializeObject<List<CategoriaInventario>>(categoriasInventarioResponse.Response.ToString());
            var categoriaInventarioDdl = MappingPropertiToDropDownList<CategoriaInventario>(categoriaInventario, "Id", "Nombre");

            var ubicacionesAlmacenTaller = System.Configuration.ConfigurationManager
                    .AppSettings["UbicacionesAlmacenTaller"]?
                    .ToString()
                    .Split('|')
                    .Select(x =>
                    {
                        var partes = x.Split(':');

                        return new SelectListItem
                        {
                            Value = partes[0],
                            Text = partes.Length > 1 ? partes[1] : partes[0]
                        };
                    })
                    .ToList() ?? new List<SelectListItem>();

            ViewBag.UserToken = usuarioAutenticado.UserName;
            ViewBag.Usuarios = usuarios;
            ViewBag.IdRegistro = id;
            ViewBag.TipoVehiculo = tipoVehiculo;
            ViewBag.IdVehiculo = idVehiculo;
            ViewBag.CategoriaInventario = categoriaInventarioDdl;
            ViewBag.UbicacionesInventarioTaller = ubicacionesAlmacenTaller;

            return PartialView();
        }
        public async Task<ActionResult> PartialViewEditarRetirarPieza(long id, long idReparacion, int tipoVehiculo, long idVehiculo)
        {
            RetirarPiezaVehiculoReparacion retirarPiezaVehiculoReparacion = new RetirarPiezaVehiculoReparacion();
            var result = await httpClientConnection.GetRetirarPiezaVehiculoReparacionById(id);
            retirarPiezaVehiculoReparacion = JsonConvert.DeserializeObject<RetirarPiezaVehiculoReparacion>(result.Response.ToString());

            // Limpiar las rutas
            string rutaFoto = retirarPiezaVehiculoReparacion.RutaFoto?.Replace("\\", "/").Trim('/') ?? "";
            string gitFoto = retirarPiezaVehiculoReparacion.GitFoto?.Trim() ?? "";

            // Construir la URL manualmente sin usar Url.Action para evitar el encoding de &amp;
            string imageUrl = "";
            bool hasImage = false;

            if (!string.IsNullOrEmpty(rutaFoto) && !string.IsNullOrEmpty(gitFoto))
            {
                // Verificar si el archivo existe
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;
                string physicalPath = Path.Combine(projectRootPath, rutaFoto, gitFoto);

                if (System.IO.File.Exists(physicalPath))
                {
                    hasImage = true;
                    // Construir URL manualmente para evitar el encoding
                    imageUrl = $"/Taller/VerImagenPiezaRetirada?rutaArchivo={Uri.EscapeDataString(rutaFoto)}&nombreArchivo={Uri.EscapeDataString(gitFoto)}";
                }
                else
                {
                    // Intentar con la ruta alternativa
                    string alternativePath = Path.Combine(projectRootPath, "AttachmentTaller/PiezasRetiradas", gitFoto);
                    if (System.IO.File.Exists(alternativePath))
                    {
                        hasImage = true;
                        imageUrl = $"/Taller/VerImagenPiezaRetirada?rutaArchivo={Uri.EscapeDataString("AttachmentTaller/PiezasRetiradas")}&nombreArchivo={Uri.EscapeDataString(gitFoto)}";
                    }
                }
            }

            ViewBag.ImageUrl = imageUrl;
            ViewBag.HasImage = hasImage;
            ViewBag.RutaArchivo = rutaFoto;
            ViewBag.NombreArchivo = gitFoto;

            // Resto del código...
            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };
            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();
            var categoriasInventarioResponse = await httpClientConnection.GetAllCategoriaInventario();
            var categoriaInventario = JsonConvert.DeserializeObject<List<CategoriaInventario>>(categoriasInventarioResponse.Response.ToString());
            var categoriaInventarioDdl = MappingPropertiToDropDownList<CategoriaInventario>(categoriaInventario, "Id", "Nombre");

            var ubicacionesAlmacenTaller = System.Configuration.ConfigurationManager
                    .AppSettings["UbicacionesAlmacenTaller"]?
                    .ToString()
                    .Split('|')
                    .Select(x =>
                    {
                        var partes = x.Split(':');
                        return new SelectListItem
                        {
                            Value = partes[0],
                            Text = partes.Length > 1 ? partes[1] : partes[0]
                        };
                    })
                    .ToList() ?? new List<SelectListItem>();

            ViewBag.UserToken = usuarioAutenticado.UserName;
            ViewBag.Usuarios = usuarios;
            ViewBag.IdRegistro = id;
            ViewBag.IdReparacion = idReparacion;
            ViewBag.TipoVehiculo = tipoVehiculo;
            ViewBag.IdVehiculo = idVehiculo;
            ViewBag.CategoriaInventario = categoriaInventarioDdl;
            ViewBag.UbicacionesInventarioTaller = ubicacionesAlmacenTaller;

            return PartialView(retirarPiezaVehiculoReparacion);
        }
        public ActionResult VerImagenPiezaRetirada(string rutaArchivo, string nombreArchivo)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"=== VerImagenPiezaRetirada ===");
                System.Diagnostics.Debug.WriteLine($"rutaArchivo: {rutaArchivo}");
                System.Diagnostics.Debug.WriteLine($"nombreArchivo: {nombreArchivo}");

                // Validar parámetros
                if (string.IsNullOrEmpty(rutaArchivo) || string.IsNullOrEmpty(nombreArchivo))
                {
                    return ImagenPorDefecto();
                }

                // Obtener la ruta raíz del proyecto
                string projectRootPath = HostingEnvironment.ApplicationPhysicalPath;

                // Concatenar: raíz + rutaArchivo + nombreArchivo
                string rutaCompleta = Path.Combine(projectRootPath, rutaArchivo, nombreArchivo);
                System.Diagnostics.Debug.WriteLine($"Ruta completa: {rutaCompleta}");

                // Verifica que el archivo exista
                if (!System.IO.File.Exists(rutaCompleta))
                {
                    System.Diagnostics.Debug.WriteLine("Archivo no encontrado en la ruta principal");

                    // Intentar buscar en la carpeta AttachmentTaller/PiezasRetiradas
                    string alternativePath = Path.Combine(projectRootPath, "AttachmentTaller/PiezasRetiradas", nombreArchivo);
                    System.Diagnostics.Debug.WriteLine($"Buscando en alternativa: {alternativePath}");

                    if (System.IO.File.Exists(alternativePath))
                    {
                        rutaCompleta = alternativePath;
                        System.Diagnostics.Debug.WriteLine("Archivo encontrado en ruta alternativa");
                    }
                    else
                    {
                        System.Diagnostics.Debug.WriteLine("Archivo no encontrado en ninguna ubicación");
                        return ImagenPorDefecto();
                    }
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine("Archivo encontrado en ruta principal");
                }

                // Obtiene el tipo MIME del archivo
                string contentType = GetContentType(nombreArchivo);

                // Leer el archivo como bytes y devolverlo
                byte[] fileBytes = System.IO.File.ReadAllBytes(rutaCompleta);
                System.Diagnostics.Debug.WriteLine($"Tamaño del archivo: {fileBytes.Length} bytes");

                return File(fileBytes, contentType);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error: {ex.Message}");
                return ImagenPorDefecto();
            }
        }
        private ActionResult ImagenPorDefecto()
        {
            // Ruta de una imagen por defecto si existe
            string defaultImagePath = Server.MapPath("~/Content/images/no-image-available.jpg");
            if (System.IO.File.Exists(defaultImagePath))
            {
                return File(defaultImagePath, "image/jpeg");
            }

            // Si no existe, crear una imagen simple en memoria
            using (var bitmap = new System.Drawing.Bitmap(200, 200))
            using (var graphics = System.Drawing.Graphics.FromImage(bitmap))
            {
                graphics.Clear(System.Drawing.Color.LightGray);
                using (var font = new System.Drawing.Font("Arial", 10))
                using (var brush = new System.Drawing.SolidBrush(System.Drawing.Color.Black))
                {
                    graphics.DrawString("Sin imagen", font, brush, new System.Drawing.PointF(60, 90));
                }

                using (var ms = new System.IO.MemoryStream())
                {
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                    byte[] imageBytes = ms.ToArray();
                    return File(imageBytes, "image/jpeg");
                }
            }
        }
        private string GetContentType(string fileName)
        {
            string extension = System.IO.Path.GetExtension(fileName).ToLower();
            switch (extension)
            {
                case ".jpg":
                case ".jpeg":
                    return "image/jpeg";
                case ".png":
                    return "image/png";
                case ".gif":
                    return "image/gif";
                case ".bmp":
                    return "image/bmp";
                default:
                    return "application/octet-stream";
            }
        }
        public async Task<ActionResult> PartialViewModalAsignarPiezas(long id, int tipoVehiculo, long idVehiculo)
        {
            ComponenteVehiculo componenteVehiculo = new ComponenteVehiculo();

            var inventarioResponse = await httpClientConnection.GetAllInventario();
            var inventario = JsonConvert.DeserializeObject<List<Inventario>>(inventarioResponse.Response.ToString());

            var tipoInventario = System.Configuration.ConfigurationManager
                    .AppSettings["TipoInventario"]?
                    .ToString()
                    .Split('|')
                    .Select(x =>
                    {
                        var partes = x.Split(':');
                        return new SelectListItem
                        {
                            Value = partes[0],
                            Text = partes.Length > 1 ? partes[1] : partes[0]
                        };
                    })
                    .ToList() ?? new List<SelectListItem>();

            var categoriasInventarioResponse = await httpClientConnection.GetAllCategoriaInventario();
            var categoriaInventario = JsonConvert.DeserializeObject<List<CategoriaInventario>>(categoriasInventarioResponse.Response.ToString());
            var categoriaInventarioDdl = MappingPropertiToDropDownList<CategoriaInventario>(categoriaInventario, "Id", "Nombre");

            var usuarioToken = SessionHelper.GetSessionUser();
            var usuario = new List<Usuario>()
            {
                new Usuario()
                {
                    Id = usuarioToken.UserID,
                    Nombre = usuarioToken.UserName
                }
            };

            var usuarios = MappingPropertiToDropDownList<Usuario>(usuario, "Id", "Nombre");
            var usuarioAutenticado = Helpers.SessionHelper.GetSessionUser();

            // Asignar valores al modelo principal
            componenteVehiculo.CreatedBy = usuarioToken.UserName;
            componenteVehiculo.UpdatedBy = usuarioToken.UserName;
            componenteVehiculo.CreatedDt = DateTime.Now;
            componenteVehiculo.UpdatedDt = DateTime.Now;

            ViewBag.UserToken = usuarioAutenticado;
            ViewBag.Usuarios = usuarios;
            ViewBag.Inventario = inventario;
            ViewBag.TipoInventario = tipoInventario;
            ViewBag.CategoriaInventario = categoriaInventarioDdl;

            ViewBag.IdReparacion = id;
            ViewBag.TipoVehiculo = tipoVehiculo;
            ViewBag.IdVehiculo = idVehiculo;

            return PartialView(componenteVehiculo);

        }
        #endregion

        #region Data Acces

        #region Inventario

        public async Task<ActionResult> SaveOrUpdateInventario(Inventario inventario)
        {
            var r = await httpClientConnection.SaveOrUpdateInventario(inventario);
            return Redirect("Inventario_Taller");
        }
        public async Task<string> GetAllInventario()
        {
            var result = await httpClientConnection.GetAllInventario();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteInventarioById(long id)
        {
            var r = await httpClientConnection.DeleteInventarioById(id);
            return Redirect("Inventario_Taller");
        }
        #endregion

        #region CategoriaInventario

        public async Task<ActionResult> SaveOrUpdateCategoriaInventario(CategoriaInventario ci)
        {
            var r = await httpClientConnection.SaveOrUpdateCategoriaInventario(ci);
            return Redirect("CategoriaInventario");
        }
        public async Task<string> GetAllCategoriaInventario()
        {
            var result = await httpClientConnection.GetAllCategoriaInventario();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteCategoriaInventarioById(long id)
        {
            var r = await httpClientConnection.DeleteCategoriaInventarioById(id);
            return Redirect("CategoriaInventario");
        }


        #endregion

        #region ComponenteVehiculo
        public async Task<string> SaveOrUpdateComponenteVehiculo(ComponenteVehiculo ci)
        {
            var r = await httpClientConnection.SaveOrUpdateComponenteVehiculo(ci);
            return Newtonsoft.Json.JsonConvert.SerializeObject(r);
        }
        public async Task<string> GetAllComponenteVehiculo()
        {
            var result = await httpClientConnection.GetAllComponenteVehiculo();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteComponenteVehiculoById(long id)
        {
            var r = await httpClientConnection.DeleteComponenteVehiculoById(id);
            return Redirect("Inventario_Taller");
        }
        public async Task<string> GetAllPiezasAsignadasReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion)
        {
            var r = await httpClientConnection.GetAllPiezasAsignadasReparacionByIdVehiculo(tipoVehiculo, idVehiculo, idReparacion);
            return Newtonsoft.Json.JsonConvert.SerializeObject(r);
        }
        #endregion

        #region ReparacionVehiculos
        public async Task<string> GetAllVehiculo()
        {
            var result = await httpClientConnection.GetAllVehiculo();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<string> GetAllRegistersVehiculos()
        {
            var result = await httpClientConnection.GetAllRegistersVehiculos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateReparacionVehiculos(ReparacionVehiculos ci)
        {
            var r = await httpClientConnection.SaveOrUpdateReparacionVehiculos(ci);
            return Redirect("ReparacionVehiculos");
        }
        public async Task<string> GetAllReparacionVehiculos()
        {
            var result = await httpClientConnection.GetAllReparacionVehiculos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> DeleteReparacionVehiculosById(long Id, long IdVehiculo, int TipoVehiculo)
        {
            var r = await httpClientConnection.DeleteReparacionVehiculosById(Id, IdVehiculo, TipoVehiculo);
            return Redirect("ReparacionVehiculos");
        }
        public async Task<string> GetAllRegistersReparacionVehiculos()
        {
            var result = await httpClientConnection.GetAllRegistersReparacionVehiculos();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> LiberarVehiculo(long Id, long IdVehiculo, int TipoVehiculo)
        {
            var r = await httpClientConnection.LiberarVehiculo(Id, IdVehiculo, TipoVehiculo);
            return Redirect("ReparacionVehiculos");
        }
        #endregion

        #region RetirarPiezaVehiculoReparacion
        public async Task<string> GetAllRetirarPiezaVehiculoReparacion()
        {
            var result = await httpClientConnection.GetAllRetirarPiezaVehiculoReparacion();
            return Newtonsoft.Json.JsonConvert.SerializeObject(result);
        }
        public async Task<ActionResult> SaveOrUpdateRetirarPiezaVehiculoReparacion()
        {
            var usuarioToken = SessionHelper.GetSessionUser();
            try
            {
                long id = 0;
                long.TryParse(Request.Form["Id"], out id);

                long.TryParse(Request.Form["IdReparacion"], out long idReparacion);
                long.TryParse(Request.Form["IdCategoriaInventario"], out long idCategoriaInventario);
                long.TryParse(Request.Form["IdVehiculo"], out long idVehiculo);

                int.TryParse(Request.Form["TipoVehiculo"], out int tipoVehiculo);

                string nombre = Request.Form["Nombre"] ?? string.Empty;
                string marca = Request.Form["Marca"] ?? string.Empty;

                int.TryParse(Request.Form["Cantidad"], out int cantidad);
                int.TryParse(Request.Form["UbicacionAlmacen"], out int ubicacionAlmacen);

                DateTime fecha = DateTime.Now;

                if (!string.IsNullOrEmpty(Request.Form["Fecha"]))
                {
                    DateTime.TryParseExact(
                        Request.Form["Fecha"],
                        "yyyy-MM-dd HH:mm:ss",
                        System.Globalization.CultureInfo.InvariantCulture,
                        System.Globalization.DateTimeStyles.None,
                        out fecha
                    );
                }

                var valoresReutilizable = Request.Form.GetValues("Reutilizable");
                bool reutilizable = valoresReutilizable != null && valoresReutilizable.Contains("true");

                bool estatus = Request.Form["estatusModal"] == "1" ||
                               Request.Form["estatusModal"] == "true";

                string createdBy = usuarioToken.UserName;
                string updatedBy = usuarioToken.UserName;

                DateTime createdDt = DateTime.Now;
                if (!string.IsNullOrEmpty(Request.Form["createdDtModal"]) &&
                    DateTime.TryParse(Request.Form["createdDtModal"], out DateTime tempCreated))
                {
                    createdDt = tempCreated;
                }

                DateTime updatedDt = DateTime.Now;
                if (!string.IsNullOrEmpty(Request.Form["updatedDtModal"]) &&
                    DateTime.TryParse(Request.Form["updatedDtModal"], out DateTime tempUpdated))
                {
                    updatedDt = tempUpdated;
                }

                var archivo = Request.Files["Fotografia"];

                string baseFolder = "AttachmentTaller/PiezasRetiradas";
                string rootPath = HostingEnvironment.ApplicationPhysicalPath;
                string fullFolderPath = Path.Combine(rootPath, baseFolder);

                if (!Directory.Exists(fullFolderPath))
                    Directory.CreateDirectory(fullFolderPath);

                string gitArchivo = string.Empty;
                string rutaArchivo = string.Empty;

                RetirarPiezaVehiculoReparacion existente = null;

                if (id > 0)
                {
                    var resp = await httpClientConnection.GetRetirarPiezaVehiculoReparacionById(id);

                    if (resp.IsSuccess && resp.Response != null)
                    {
                        existente = JsonConvert.DeserializeObject<RetirarPiezaVehiculoReparacion>(resp.Response.ToString());
                    }
                }

                if (archivo != null && archivo.ContentLength > 0)
                {
                    if (id > 0 && existente != null && !string.IsNullOrEmpty(existente.GitFoto))
                    {
                        gitArchivo = existente.GitFoto;
                        rutaArchivo = existente.RutaFoto;

                        string fullPath = Path.Combine(rootPath, rutaArchivo, gitArchivo);
                        archivo.SaveAs(fullPath);
                    }
                    else
                    {
                        int consecutivo = ObtenerSiguienteNumeroConsecutivo(fullFolderPath);
                        string ext = Path.GetExtension(archivo.FileName);

                        gitArchivo = $"PiezaRetirada_{consecutivo}{ext}";
                        rutaArchivo = baseFolder;

                        string fullPath = Path.Combine(fullFolderPath, gitArchivo);
                        archivo.SaveAs(fullPath);
                    }
                }
                else if (existente != null)
                {
                    gitArchivo = existente.GitFoto;
                    rutaArchivo = existente.RutaFoto;
                }

                var pieza = new RetirarPiezaVehiculoReparacion
                {
                    Id = id,
                    IdReparacion = idReparacion,
                    IdCategoriaInventario = idCategoriaInventario,
                    IdVehiculo = idVehiculo,
                    TipoVehiculo = tipoVehiculo,
                    Reutilizable = reutilizable,
                    Nombre = nombre,
                    Marca = marca,
                    Cantidad = cantidad,
                    UbicacionAlmacen = ubicacionAlmacen,
                    Fecha = fecha,
                    RutaFoto = rutaArchivo,
                    GitFoto = gitArchivo,
                    Estatus = true,

                    CreatedBy = (id > 0 && existente != null) ? existente.CreatedBy : createdBy,
                    CreatedDt = (id > 0 && existente != null) ? existente.CreatedDt : createdDt,
                    UpdatedBy = updatedBy,
                    UpdatedDt = DateTime.Now
                };

                var result = await httpClientConnection.SaveOrUpdateRetirarPiezaVehiculoReparacion(pieza);

                return Redirect("ResumenReparacionVehiculo/" + idReparacion);
            }
            catch (Exception ex)
            {
                return Redirect("ReparacionVehiculos");
            }
        }
        private int ObtenerSiguienteNumeroConsecutivo(string path)
        {
            if (!Directory.Exists(path))
            {
                return 1;
            }

            var files = Directory.GetFiles(path);
            int maxNumero = 0;

            foreach (var file in files)
            {
                string fileName = Path.GetFileNameWithoutExtension(file);
                // Buscar archivos con formato "PiezaRetirada_XXX"
                if (fileName.StartsWith("PiezaRetirada_"))
                {
                    string numeroStr = fileName.Substring("PiezaRetirada_".Length);
                    if (int.TryParse(numeroStr, out int numero))
                    {
                        if (numero > maxNumero)
                        {
                            maxNumero = numero;
                        }
                    }
                }
            }

            return maxNumero + 1;
        }
        public async Task<string> GetRetirarPiezaVehiculoReparacionById(long Id)
        {
            var r = await httpClientConnection.GetRetirarPiezaVehiculoReparacionById(Id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(r);
        }
        public async Task<string> DeleteRetirarPiezaVehiculoReparacionById(long Id)
        {
            var r = await httpClientConnection.DeleteRetirarPiezaVehiculoReparacionById(Id);
            return Newtonsoft.Json.JsonConvert.SerializeObject(r);
        }
        public async Task<string> GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(int tipoVehiculo, long idVehiculo, long idReparacion )
        {
            var r = await httpClientConnection.GetAllRetirarPiezaVehiculoReparacionByIdVehiculo(tipoVehiculo, idVehiculo, idReparacion);
            return Newtonsoft.Json.JsonConvert.SerializeObject(r);
        }
        public async Task<string> GetAllInventarioByCategoriaTipo(long categoriaInventario, int tipoInventario)
        {
            if (tipoInventario == 1)
            {
                var r = await httpClientConnection.GetAllInventarioReutilizableByCategoria(categoriaInventario);
                return Newtonsoft.Json.JsonConvert.SerializeObject(r);
            }
            else if (tipoInventario == 2)
            {
                var r = await httpClientConnection.GetAllInventarioByCategoria(categoriaInventario);
                return Newtonsoft.Json.JsonConvert.SerializeObject(r);
            }

            return Newtonsoft.Json.JsonConvert.SerializeObject(new List<object>());
        }
        #endregion


        [HttpPost]
        public async Task<string> FirstAutentication(string user, string pass)
        {
            pass = Cryptography.Encrypt(pass);

            Token token = await httpClientConnection.GetToken(user, pass);

            if (token != null)
            {
                var responseAutenticated = await httpClientConnection.ValidateUserName(user, token.access_token);
                var userAutenticated = JsonConvert.DeserializeObject<Usuario>(responseAutenticated.Response.ToString());
                token.ExpirationDate = DateTime.Now.AddSeconds(token.expires_in);
                var tokenCookie = new TokenCookie()
                {
                    Token = token,
                    UserID = userAutenticated.Id,
                    UserName = user
                };

                SessionHelper.CreateSession(JsonConvert.SerializeObject(tokenCookie));
            }

            return JsonConvert.SerializeObject(mr);
        }

        [Autenticated]
        public string LogOut()
        {
            SessionHelper.CloseSession();
            if (Request.Cookies["ConfigMenu"] != null)
            {
                var c = new HttpCookie("ConfigMenu")
                {
                    Expires = DateTime.Now.AddDays(-1)
                };
                Response.Cookies.Add(c);
            }
            return JsonConvert.SerializeObject(mr);
        }
        #endregion
    }
}