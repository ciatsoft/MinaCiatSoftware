using MinaTolEntidades.DtoVentaPublicoGeneral;
using NReco.PdfGenerator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    public class PdfController : Controller
    {
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteInventario(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Inventario</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                        .estado-sin-piezas {{ color: #000000; font-weight: bold; }}
                        .estado-pocas {{ color: #dc3545; font-weight: bold; }}
                        .estado-moderado {{ color: #ffc107; font-weight: bold; }}
                        .estado-suficiente {{ color: #28a745; font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Inventario</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_Inventario_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteVentasGenerales(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Ventas Generales</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                        .estado-sin-piezas {{ color: #000000; font-weight: bold; }}
                        .estado-pocas {{ color: #dc3545; font-weight: bold; }}
                        .estado-moderado {{ color: #ffc107; font-weight: bold; }}
                        .estado-suficiente {{ color: #28a745; font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Ventas Generales</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_Ventas_Generales_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarPDFPreFacturas1(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Pre-Facturas</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                        .estado-sin-piezas {{ color: #000000; font-weight: bold; }}
                        .estado-pocas {{ color: #dc3545; font-weight: bold; }}
                        .estado-moderado {{ color: #ffc107; font-weight: bold; }}
                        .estado-suficiente {{ color: #28a745; font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Pre-Facturas Aceptadas</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_PreFactura_SiAceptadas_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarPDFPreFacturas2(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Pre-Facturas</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                        .estado-sin-piezas {{ color: #000000; font-weight: bold; }}
                        .estado-pocas {{ color: #dc3545; font-weight: bold; }}
                        .estado-moderado {{ color: #ffc107; font-weight: bold; }}
                        .estado-suficiente {{ color: #28a745; font-weight: bold; }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Pre-Facturas No Aceptadas</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_PreFactura_NoAceptadas_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteEmpleados(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Empleados</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Empleados</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_Empleados_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteVentaPorPlanta(string tablaHTML)
        {
            byte[] pdfBytes = null;

            try
            {
                // Obtener la fecha actual formateada
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

                // Crear HTML completo con estilos optimizados para PDF
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte de Venta Por Planta</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 15px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 20px;
                            border-bottom: 2px solid #2c3e50;
                            padding-bottom: 10px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 5px 0;
                            font-size: 20px;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #ddd; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f9f9f9; 
                        }}
                        tr {{ 
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 30px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #eee;
                            padding-top: 10px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte de Venta por Planta</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                    </div>
                    
                    {tablaHTML}
                    
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Página {DateTime.Now:yyyyMMdd_HHmmss}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales para mejor rendimiento
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_VentaPorPlanta_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteUtilidades(string htmlContent, string fecha, string userName, bool existeCorteId)
        {
            try
            {
                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                var pdfBytes = htmlToPdf.GeneratePdf(htmlContent);

                // Nombre del archivo
                var fileName = $"Reporte_Utilidades_{fecha?.Replace("/", "-")}_{userName}.pdf";

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");

                // En caso de error, devolver un mensaje JSON para que JavaScript lo maneje
                return Json(new
                {
                    success = false,
                    message = "Error al generar el reporte PDF. Por favor, intente nuevamente."
                });
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReciboDeduccion(string htmlContent, string fileName)
        {
            try
            {
                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Default;
                htmlToPdf.Size = PageSize.Letter;

                // Configurar márgenes para coincidir con el diseño
                htmlToPdf.Margins = new PageMargins
                {
                    Top = 0,
                    Bottom = 0,
                    Left = 0,
                    Right = 0
                };

                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                var pdfBytes = htmlToPdf.GeneratePdf(htmlContent);

                // Devolver el PDF
                return File(pdfBytes, "application/pdf", fileName);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar recibo: {ex.Message}");
                return new HttpStatusCodeResult(500, "Error al generar el recibo");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult GenerarValesPrepago(List<Prepago> vales, string fileName)
        {
            try
            {
                // Validar que recibimos datos
                if (vales == null || vales.Count == 0)
                {
                    return Json(new { success = false, message = "No se recibieron vales para generar" });
                }

                // Generar el HTML en el backend
                string htmlContent = GenerarHTMLVales(vales);

                // Convertir HTML a PDF usando NReco
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Portrait;
                htmlToPdf.Size = PageSize.A4;
                htmlToPdf.Margins = new PageMargins { Top = 10, Bottom = 10, Left = 10, Right = 10 };

                // Generar PDF
                var pdfBytes = htmlToPdf.GeneratePdf(htmlContent);

                // Convertir a base64 para enviar al frontend
                string pdfBase64 = Convert.ToBase64String(pdfBytes);

                return Json(new
                {
                    success = true,
                    pdfBase64 = pdfBase64,
                    fileName = fileName
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar vales de prepago: {ex.Message}");
                return Json(new { success = false, message = "Error al generar PDF: " + ex.Message });
            }
        }

        private string GenerarHTMLVales(List<Prepago> vales)
        {
            const string primaryColor = "#2c3e50";
            const string secondaryColor = "#3498db";
            const string accentColor = "#e74c3c";
            const string leyendaFecha = "Calimaya, Estado de México a: ______________";

            var html = new StringBuilder();
            html.AppendLine("<!DOCTYPE html>");
            html.AppendLine("<html>");
            html.AppendLine("<head>");
            html.AppendLine("    <meta charset=\"UTF-8\">");
            html.AppendLine("    <title>Vales de Prepago</title>");
            html.AppendLine("    <style>");
            html.AppendLine("        @@page { margin: 3mm; size: A4 portrait; }");
            html.AppendLine("        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; font-size: 9pt; background-color: white; }");
            html.AppendLine("        .page-container { width: 100%; height: 284mm; }");
            html.AppendLine("        .vale-table { width: 100%; height: 100%; border-collapse: collapse; }");
            html.AppendLine("        .vale-cell { width: 50%; height: 50%; padding: 2mm; vertical-align: top; }");
            html.AppendLine("        .vale { width: 98mm; height: 138mm; background: white; border: 1.5px solid " + primaryColor + "; border-radius: 5px; padding: 3mm; box-sizing: border-box; position: relative; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }");
            html.AppendLine("        .header { background: linear-gradient(135deg, " + primaryColor + ", #34495e); color: white; padding: 2mm; border-radius: 4px 4px 0 0; margin: -3mm -3mm 2mm -3mm; text-align: center; position: relative; }");
            html.AppendLine("        .header h1 { font-size: 9pt; font-weight: bold; margin: 0; line-height: 1.2; }");
            html.AppendLine("        .vale-number { background: " + accentColor + "; color: white; padding: 1mm 2mm; border-radius: 3px; font-size: 8pt; font-weight: bold; position: absolute; top: -2mm; right: 3mm; }");
            html.AppendLine("        .content { padding: 2mm; height: 95mm; }");
            html.AppendLine("        .row { display: flex; margin-bottom: 2mm; align-items: center; }");
            html.AppendLine("        .label { width: 25mm; font-weight: bold; color: " + primaryColor + "; font-size: 8pt; flex-shrink: 0; }");
            html.AppendLine("        .value { width: 63mm; font-size: 8pt; color: #2c3e50; font-weight: normal; }");
            html.AppendLine("        .amount-row { background-color: #f8f9fa; padding: 2mm; border-radius: 4px; margin: 3mm -2mm; border-left: 3px solid " + secondaryColor + "; }");
            html.AppendLine("        .amount-label { font-weight: bold; color: " + accentColor + "; font-size: 9pt; width: 25mm; }");
            html.AppendLine("        .amount-value { font-weight: bold; color: " + primaryColor + "; font-size: 9pt; }");
            html.AppendLine("        .signature-area { position: absolute; bottom: 15mm; width: calc(100% - 6mm); text-align: center; border-top: 1px solid #ccc; padding-top: 1mm; margin-top: 2mm; }");
            html.AppendLine("        .signature-text { font-size: 7pt; color: #7f8c8d; font-style: italic; font-weight: bold; }");
            html.AppendLine("        .date-legend { position: absolute; bottom: 5mm; width: 100%; text-align: center; font-size: 7pt; color: #7f8c8d; font-style: italic; }");
            html.AppendLine("        .company-info { text-align: center; margin-bottom: 1mm; font-size: 7pt; color: #7f8c8d; font-weight: bold; }");
            html.AppendLine("        .folio-badge { background: " + secondaryColor + "; color: white; padding: 1mm 2mm; border-radius: 3px; font-size: 9pt; font-weight: bold; display: block; text-align: center; margin-bottom: 2mm; }");
            html.AppendLine("        .page-break { page-break-after: always; }");
            html.AppendLine("        .important { font-weight: bold; color: " + accentColor + "; }");
            html.AppendLine("        .material-info { background-color: #e8f4f8; padding: 2mm; border-radius: 3px; margin: 2mm 0; }");
            html.AppendLine("    </style>");
            html.AppendLine("</head>");
            html.AppendLine("<body>");

            for (int i = 0; i < vales.Count; i += 4)
            {
                if (i > 0)
                {
                    html.AppendLine("    <div class=\"page-break\"></div>");
                }

                html.AppendLine("    <div class=\"page-container\">");
                html.AppendLine("        <table class=\"vale-table\">");

                // Primera fila (2 vales)
                html.AppendLine("            <tr>");
                for (int j = 0; j < 2; j++)
                {
                    int index = i + j;
                    html.AppendLine("                <td class=\"vale-cell\">");
                    if (index < vales.Count)
                    {
                        html.Append(GenerateValeHtml(vales[index], primaryColor, secondaryColor, accentColor, leyendaFecha));
                    }
                    html.AppendLine("                </td>");
                }
                html.AppendLine("            </tr>");

                // Segunda fila (2 vales)
                html.AppendLine("            <tr>");
                for (int j = 2; j < 4; j++)
                {
                    int index = i + j;
                    html.AppendLine("                <td class=\"vale-cell\">");
                    if (index < vales.Count)
                    {
                        html.Append(GenerateValeHtml(vales[index], primaryColor, secondaryColor, accentColor, leyendaFecha));
                    }
                    html.AppendLine("                </td>");
                }
                html.AppendLine("            </tr>");

                html.AppendLine("        </table>");
                html.AppendLine("    </div>");
            }

            html.AppendLine("</body>");
            html.AppendLine("</html>");

            return html.ToString();
        }

        private string GenerateValeHtml(Prepago vale, string primaryColor, string secondaryColor, string accentColor, string leyendaFecha)
        {
            var html = new StringBuilder();

            html.AppendLine("                    <div class=\"vale\">");
            html.AppendLine("                        <div class=\"header\">");
            html.AppendLine($"                            <div class=\"vale-number\">VALE {vale.NoVale}/{vale.CantidadVales}</div>");
            html.AppendLine("                            ");
            html.AppendLine("                        </div>");
            html.AppendLine("                        <div class=\"company-info\">");
            html.AppendLine("                            PLANTA PROCESADORA DE MATERIALES PÉTREOS MINA SAN MIGUEL");
            html.AppendLine("                        </div>");
            html.AppendLine($"                        <div class=\"folio-badge\">FOLIO: {vale.Folio}</div>");
            html.AppendLine("                        <div class=\"content\">");

            // Información principal
            html.AppendLine($"                            <div class=\"row\"><div class=\"label\">FECHA:</div><div class=\"value\">{(vale.Fecha)}</div></div>");
            html.AppendLine($"                            <div class=\"row\"><div class=\"label\">CLIENTE:</div><div class=\"value important\">{vale.NombreCliente}</div></div>");

            // Información del material con fondo destacado
            html.AppendLine("                            <div class=\"material-info\">");
            html.AppendLine($"                                <div class=\"row\"><div class=\"label\">MATERIAL:</div><div class=\"value important\">{vale.NombreMaterial}</div></div>");
            html.AppendLine($"                                <div class=\"row\"><div class=\"label\">CANTIDAD:</div><div class=\"value important\">{vale.CantidadM3} m³</div></div>");
            html.AppendLine("                            </div>");

            // Información de precios
            html.AppendLine("                            <div class=\"amount-row\">");
            html.AppendLine($"                                <div class=\"row\"><div class=\"amount-label\">PRECIO UNITARIO:</div><div class=\"amount-value\">${vale.PrecioUnidad:F2}</div></div>");
            html.AppendLine($"                                <div class=\"row\"><div class=\"amount-label\">IMPORTE TOTAL:</div><div class=\"amount-value\">${vale.ImporteVenta:F2}</div></div>");
            html.AppendLine("                            </div>");

            html.AppendLine($"                            <div class=\"row\"><div class=\"label\">USUARIO:</div><div class=\"value\">{vale.UserName}</div></div>");
            html.AppendLine("                        </div>");

            // Área de firma más grande
            html.AppendLine("                        <div class=\"signature-area\">");
            html.AppendLine("                            <div class=\"signature-text\">FIRMA Y SELLO DE AUTORIZACIÓN</div>");
            html.AppendLine("                        </div>");
            html.AppendLine($"                        <div class=\"date-legend\">{leyendaFecha}</div>");
            html.AppendLine("                    </div>");

            return html.ToString();
        }

        [HttpPost]
        public ActionResult GenerarTicket(TicketModel model)
        {
            var htmlContent = $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; font-size: 10px; text-align: center; }}
                        h1 {{ font-size: 14px; margin: 0; }}
                        h2 {{ font-size: 12px; margin: 5px 0; }}
                        table {{ width: 100%; margin-top: 5px; border-collapse: collapse; }}
                        td {{ text-align: left; padding: 2px; }}
                        .label {{ font-weight: bold; }}
                        hr {{ border: 0; border-top: 1px dashed #000; margin: 5px 0; }}
                        .footer {{ margin-top: 10px; font-style: italic; }}
                    </style>
                </head>
                <body>
                    <h1>Ticket de Venta</h1>
                    <h2>{model.TituloSecundario}</h2>
                    <p>Fecha: {model.Fecha}</p>
                    <hr/>
                    <table>
                        <tr><td class='label'>Folio:</td><td>{model.Folio}</td></tr>
                        <tr><td class='label'>Planta:</td><td>{model.NombrePlanta}</td></tr>
                        <tr><td class='label'>Material:</td><td>{model.NombreMaterial}</td></tr>
                        <tr><td class='label'>Cantidad:</td><td>{model.Cantidad}</td></tr>
                        <tr><td class='label'>Precio/Unidad:</td><td>${model.PrecioUnidad}</td></tr>
                        <tr><td class='label'>Total:</td><td><b>${model.TotalPago}</b></td></tr>
                        <tr><td class='label'>Forma de Pago:</td><td>{model.FormaPago}</td></tr>
                        <tr><td class='label'>Transporte:</td><td>{model.Transporte}</td></tr>
                        <tr><td class='label'>Placa:</td><td>{model.Placa}</td></tr>
                        <tr><td class='label'>Vendedor:</td><td>{model.Vendedor}</td></tr>
                        <tr><td class='label'>RFID:</td><td>{model.RFID}</td></tr>
                        <tr><td class='label'>Cliente:</td><td>{model.NombreCliente}</td></tr>
                    </table>
                    <hr/>
                    <p class='footer'>¡Gracias por su compra!</p>
                </body>
                </html>";

            var pdfGenerator = new HtmlToPdfConverter
            {
                Size = PageSize.A4,
                CustomWkHtmlArgs = "--page-width 80mm --page-height 150mm --no-pdf-compression"
            };

            var pdfBytes = pdfGenerator.GeneratePdf(htmlContent);
            var pdfBase64 = Convert.ToBase64String(pdfBytes);

            return Json(new { pdf = pdfBase64 });
        }

        // NOMINA EMPLEADO
        [HttpPost]
        public ActionResult GenerarPDF(string htmlContent)
        {
            try
            {
                var htmlToPdf = new HtmlToPdfConverter();

                // Configuración del PDF
                htmlToPdf.Orientation = PageOrientation.Portrait;
                htmlToPdf.Size = PageSize.A4;
                htmlToPdf.Margins = new PageMargins { Top = 10, Bottom = 10, Left = 10, Right = 10 };

                // Generar PDF
                var pdfBytes = htmlToPdf.GeneratePdf(htmlContent);

                return File(pdfBytes, "application/pdf", "recibo_nomina.pdf");
            }
            catch (Exception ex)
            {
                return Json(new { IsSuccess = false, ErrorMessage = ex.Message });
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteConsolidado(string tablaHTML, decimal totalGeneralSalarios, decimal totalGeneralConceptos, string fechaInicio, string fechaFin)
        {
            byte[] pdfBytes = null;

            try
            {
                string fechaGeneracion = DateTime.Now.ToString("dd/MM/yyyy HH:mm");
        
                string htmlCompleto = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='UTF-8'>
                    <title>Reporte Consolidado de Nóminas y Conceptos</title>
                    <style>
                        body {{ 
                            font-family: Arial, sans-serif; 
                            margin: 20px; 
                            font-size: 12px;
                            color: #333;
                        }}
                        .header {{ 
                            text-align: center; 
                            margin-bottom: 25px;
                            border-bottom: 3px solid #2c3e50;
                            padding-bottom: 15px;
                        }}
                        h1 {{ 
                            color: #2c3e50; 
                            margin: 0 0 8px 0;
                            font-size: 24px;
                        }}
                        h2 {{
                            color: #34495e;
                            font-size: 18px;
                            margin: 25px 0 12px 0;
                            padding: 10px;
                            background-color: #ecf0f1;
                            border-left: 5px solid #3498db;
                        }}
                        h3 {{
                            color: #2c3e50;
                            font-size: 16px;
                            margin: 20px 0 10px 0;
                        }}
                        .fecha {{
                            font-size: 14px;
                            color: #7f8c8d;
                            font-weight: bold;
                        }}
                        .periodo {{
                            font-size: 13px;
                            color: #34495e;
                            margin: 5px 0;
                        }}
                        table {{ 
                            width: 100%; 
                            border-collapse: collapse; 
                            margin-top: 15px;
                            font-size: 10px;
                            page-break-inside: auto;
                        }}
                        th, td {{ 
                            padding: 8px; 
                            text-align: left; 
                            border: 1px solid #bdc3c7; 
                            word-wrap: break-word;
                        }}
                        th {{ 
                            background-color: #34495e; 
                            color: white;
                            font-weight: bold;
                            text-align: center;
                            font-size: 11px;
                        }}
                        tr:nth-child(even) {{ 
                            background-color: #f8f9fa; 
                        }}
                        .total-row {{
                            background-color: #2c3e50 !important;
                            color: white;
                            font-weight: bold;
                        }}
                        .footer {{ 
                            text-align: center; 
                            margin-top: 40px; 
                            font-size: 10px; 
                            color: #7f8c8d;
                            border-top: 1px solid #bdc3c7;
                            padding-top: 15px;
                        }}
                        .conceptos-section {{
                            margin-top: 30px;
                            page-break-before: always;
                        }}
                        .totales-section {{
                            margin-top: 30px;
                            padding: 20px;
                            background-color: #f8f9fa;
                            border: 2px solid #dee2e6;
                            border-radius: 8px;
                        }}
                    </style>
                </head>
                <body>
                    <div class='header'>
                        <h1>Reporte Consolidado de Nóminas y Conceptos</h1>
                        <p class='fecha'><strong>Fecha de generación:</strong> {fechaGeneracion}</p>
                        <p class='periodo'><strong>Período reportado:</strong> Del {fechaInicio} al {fechaFin}</p>
                    </div>
            
                    <h2>Detalle Consolidado por Empleado</h2>
                    {tablaHTML}
            
                    <div class='footer'>
                        <p>Reporte generado por Sistema de Mina San Miguel</p>
                        <p>Documento generado el {DateTime.Now:dd/MM/yyyy HH:mm}</p>
                    </div>
                </body>
                </html>";

                // Configurar el convertidor HTML a PDF
                var htmlToPdf = new HtmlToPdfConverter();
                htmlToPdf.Orientation = PageOrientation.Landscape;
                htmlToPdf.Size = PageSize.Letter;
                htmlToPdf.Margins = new PageMargins { Top = 15, Bottom = 15, Left = 10, Right = 10 };

                // Configuraciones adicionales
                htmlToPdf.LowQuality = false;
                htmlToPdf.Quiet = true;

                // Generar el PDF
                pdfBytes = htmlToPdf.GeneratePdf(htmlCompleto);

                // Devolver el PDF para descarga
                return File(pdfBytes, "application/pdf", $"Reporte_Consolidado_{DateTime.Now:yyyyMMdd_HHmmss}.pdf");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error al generar PDF: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                return Content("Error al generar el reporte PDF. Por favor, intente nuevamente.");
            }
        }
    }
}