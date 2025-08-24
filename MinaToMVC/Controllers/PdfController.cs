using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using NReco.PdfGenerator;

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
    }
}