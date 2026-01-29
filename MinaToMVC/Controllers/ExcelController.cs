using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    [AllowAnonymous]
    public class ExcelController : Controller
    {
        #region ExcelPrefacturas
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarExcelPreFacturas1(string tablaHTML, string titulo, string fechaInicio, string fechaFin, string total)
        {
            return GenerarExcel(tablaHTML, titulo ?? "FACTURADOS", fechaInicio, fechaFin, total);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarExcelPreFacturas2(string tablaHTML, string titulo, string fechaInicio, string fechaFin, string total)
        {
            return GenerarExcel(tablaHTML, titulo ?? "NO FACTURADOS", fechaInicio, fechaFin, total);
        }

        private ActionResult GenerarExcel(string tablaHTML, string titulo, string fechaInicio, string fechaFin, string total)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Prefacturas");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = false;
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                sheet.SetColumnWidth(0, 12 * 256);
                sheet.SetColumnWidth(1, 18 * 256);
                sheet.SetColumnWidth(2, 25 * 256);
                sheet.SetColumnWidth(3, 20 * 256);
                sheet.SetColumnWidth(4, 15 * 256);

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.Black.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportFont = workbook.CreateFont();
                reportFont.FontName = "Calibri";
                reportFont.FontHeightInPoints = 14;
                reportFont.IsBold = true;
                reportFont.Color = IndexedColors.Black.Index;
                reportTitleStyle.SetFont(reportFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;

                // Encabezados tabla
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.Grey80Percent.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // Fecha
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;

                // Moneda
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Total
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.IsBold = true;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.Grey50Percent.Index;
                totalStyle.FillPattern = FillPattern.SolidForeground;
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontHeightInPoints = 10;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 4));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue($"REPORTE DE PREFACTURAS - {titulo}");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(1, 1, 0, 4));

                // Periodo
                IRow periodRow = sheet.CreateRow(rowIndex++);
                periodRow.CreateCell(0).SetCellValue($"PERÍODO: {fechaInicio} al {fechaFin}");
                periodRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(2, 2, 0, 4));

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(3, 3, 0, 4));

                rowIndex += 2;

                // Encabezados
                string[] headers = { "FOLIO", "FECHA", "CLIENTE", "MATERIAL", "IMPORTE" };
                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalRegistros = 0;

                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        foreach (Match row in rows)
                        {
                            var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (cells.Count >= 5)
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalRegistros++;

                                for (int i = 0; i < 5; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);
                                    cell.SetCellValue(value);

                                    if (i == 1) cell.CellStyle = dateStyle;
                                    else if (i == 4 && decimal.TryParse(value, out decimal num))
                                    {
                                        cell.SetCellValue((double)num);
                                        cell.CellStyle = currencyStyle;
                                    }
                                    else cell.CellStyle = dataStyle;
                                }
                            }
                        }
                    }
                }

                // ================= TOTAL =================
                rowIndex++;
                IRow totalRow = sheet.CreateRow(rowIndex++);
                totalRow.CreateCell(3).SetCellValue("TOTAL:");
                totalRow.GetCell(3).CellStyle = totalStyle;

                ICell totalCell = totalRow.CreateCell(4);
                totalCell.SetCellValue(decimal.TryParse(total, out decimal t) ? (double)t : 0);
                totalCell.CellStyle = totalStyle;

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"Prefacturas_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        #endregion

        #region Viajes Locales
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteVentasGenerales(string tablaHTML, string fechaInicio = "", string fechaFin = "")
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Ventas Generales");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = true; // Cambiado a horizontal para más columnas
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna (ajustados para 9 columnas)
                sheet.SetColumnWidth(0, 10 * 256);  // Folio
                sheet.SetColumnWidth(1, 15 * 256);  // Fecha
                sheet.SetColumnWidth(2, 20 * 256);  // Cliente
                sheet.SetColumnWidth(3, 18 * 256);  // Transportista
                sheet.SetColumnWidth(4, 12 * 256);  // Vehículo
                sheet.SetColumnWidth(5, 15 * 256);  // Origen
                sheet.SetColumnWidth(6, 15 * 256);  // Material
                sheet.SetColumnWidth(7, 12 * 256);  // Metraje
                sheet.SetColumnWidth(8, 15 * 256);  // Importe

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.Black.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportFont = workbook.CreateFont();
                reportFont.FontName = "Calibri";
                reportFont.FontHeightInPoints = 14;
                reportFont.IsBold = true;
                reportFont.Color = IndexedColors.Black.Index;
                reportTitleStyle.SetFont(reportFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;

                // Encabezados tabla
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.Grey80Percent.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // Fecha
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;

                // Números (Metraje)
                ICellStyle numberStyle = workbook.CreateCellStyle();
                numberStyle.CloneStyleFrom(dataStyle);
                numberStyle.Alignment = HorizontalAlignment.Right;
                numberStyle.DataFormat = workbook.CreateDataFormat().GetFormat("#,##0.00");

                // Moneda
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Total
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.IsBold = true;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.Grey50Percent.Index;
                totalStyle.FillPattern = FillPattern.SolidForeground;
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.BorderTop = BorderStyle.Thin;
                totalStyle.BorderBottom = BorderStyle.Thin;
                totalStyle.BorderLeft = BorderStyle.Thin;
                totalStyle.BorderRight = BorderStyle.Thin;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontHeightInPoints = 10;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 8));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE VENTAS GENERALES");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 8));

                // Periodo (si se proporciona)
                if (!string.IsNullOrEmpty(fechaInicio) && !string.IsNullOrEmpty(fechaFin))
                {
                    IRow periodRow = sheet.CreateRow(rowIndex++);
                    periodRow.CreateCell(0).SetCellValue($"PERÍODO: {fechaInicio} al {fechaFin}");
                    periodRow.GetCell(0).CellStyle = infoStyle;
                    sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 8));
                }

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                rowIndex += 2;

                // Encabezados
                string[] headers = {
                "FOLIO",
                "FECHA TRANSPORTE",
                "CLIENTE",
                "TRANSPORTISTA",
                "VEHÍCULO",
                "ORIGEN",
                "MATERIAL",
                "METRAJE",
                "IMPORTE"
            };

                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalRegistros = 0;
                decimal sumatoriaTotal = 0;

                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    // Buscar el cuerpo de la tabla
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        foreach (Match row in rows)
                        {
                            var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            // Solo procesar si tiene 9 columnas y no es la fila de total
                            if (cells.Count >= 9)
                            {
                                string primeraCelda = Regex.Replace(cells[0].Groups[1].Value, @"<[^>]*>", "").Trim();

                                // Saltar fila de total (que dice "TOTAL:")
                                if (primeraCelda.Equals("TOTAL:", StringComparison.OrdinalIgnoreCase))
                                    continue;

                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalRegistros++;

                                for (int i = 0; i < 9; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);
                                    cell.SetCellValue(value);

                                    // Aplicar estilos según la columna
                                    if (i == 1) // Fecha
                                    {
                                        cell.CellStyle = dateStyle;
                                    }
                                    else if (i == 7) // Metraje
                                    {
                                        if (decimal.TryParse(value, out decimal num))
                                        {
                                            cell.SetCellValue((double)num);
                                            cell.CellStyle = numberStyle;
                                        }
                                        else
                                        {
                                            cell.CellStyle = dataStyle;
                                        }
                                    }
                                    else if (i == 8) // Importe
                                    {
                                        // Limpiar formato de moneda para parsear
                                        string cleanValue = value.Replace("$", "")
                                                                 .Replace(",", "")
                                                                 .Replace("MXN", "")
                                                                 .Trim();

                                        if (decimal.TryParse(cleanValue, out decimal importe))
                                        {
                                            cell.SetCellValue((double)importe);
                                            sumatoriaTotal += importe;
                                            cell.CellStyle = currencyStyle;
                                        }
                                        else if (decimal.TryParse(value, out importe))
                                        {
                                            cell.SetCellValue((double)importe);
                                            sumatoriaTotal += importe;
                                            cell.CellStyle = currencyStyle;
                                        }
                                        else
                                        {
                                            cell.CellStyle = dataStyle;
                                        }
                                    }
                                    else // Texto normal
                                    {
                                        cell.CellStyle = dataStyle;
                                        cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= TOTAL =================
                rowIndex++;
                IRow totalRow = sheet.CreateRow(rowIndex++);

                // Celda con texto "TOTAL:"
                totalRow.CreateCell(7).SetCellValue("TOTAL:");
                totalRow.GetCell(7).CellStyle = totalStyle;

                // Celda con valor total
                ICell totalCell = totalRow.CreateCell(8);
                totalCell.SetCellValue((double)sumatoriaTotal);
                totalCell.CellStyle = totalStyle;

                // ================= RESUMEN =================
                rowIndex += 2;

                IRow summaryRow1 = sheet.CreateRow(rowIndex++);
                summaryRow1.CreateCell(0).SetCellValue($"Total de registros: {totalRegistros}");
                summaryRow1.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                IRow summaryRow2 = sheet.CreateRow(rowIndex++);
                summaryRow2.CreateCell(0).SetCellValue($"Importe total: {sumatoriaTotal.ToString("C", new System.Globalization.CultureInfo("es-MX"))}");
                summaryRow2.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"VentasGenerales_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteVentasGeneralesFiltradas(string tablaHTML, string fechaInicio = "", string fechaFin = "", string filtroAplicado = "")
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Ventas Filtradas");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = true;
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna
                sheet.SetColumnWidth(0, 10 * 256);  // Folio
                sheet.SetColumnWidth(1, 15 * 256);  // Fecha
                sheet.SetColumnWidth(2, 20 * 256);  // Cliente
                sheet.SetColumnWidth(3, 18 * 256);  // Transportista
                sheet.SetColumnWidth(4, 12 * 256);  // Vehículo
                sheet.SetColumnWidth(5, 15 * 256);  // Origen
                sheet.SetColumnWidth(6, 15 * 256);  // Material
                sheet.SetColumnWidth(7, 12 * 256);  // Metraje
                sheet.SetColumnWidth(8, 15 * 256);  // Importe

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.Black.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportFont = workbook.CreateFont();
                reportFont.FontName = "Calibri";
                reportFont.FontHeightInPoints = 14;
                reportFont.IsBold = true;
                reportFont.Color = IndexedColors.Black.Index;
                reportTitleStyle.SetFont(reportFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;

                // Filtro aplicado
                ICellStyle filterStyle = workbook.CreateCellStyle();
                IFont filterFont = workbook.CreateFont();
                filterFont.FontHeightInPoints = 10;
                filterFont.IsBold = true;
                filterFont.Color = IndexedColors.DarkBlue.Index;
                filterStyle.SetFont(filterFont);
                filterStyle.Alignment = HorizontalAlignment.Center;
                filterStyle.FillForegroundColor = IndexedColors.LightYellow.Index;
                filterStyle.FillPattern = FillPattern.SolidForeground;

                // Encabezados tabla
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.Grey80Percent.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // Fecha
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;

                // Números (Metraje)
                ICellStyle numberStyle = workbook.CreateCellStyle();
                numberStyle.CloneStyleFrom(dataStyle);
                numberStyle.Alignment = HorizontalAlignment.Right;
                numberStyle.DataFormat = workbook.CreateDataFormat().GetFormat("#,##0.00");

                // Moneda
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Total
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.IsBold = true;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.Grey50Percent.Index;
                totalStyle.FillPattern = FillPattern.SolidForeground;
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.BorderTop = BorderStyle.Thin;
                totalStyle.BorderBottom = BorderStyle.Thin;
                totalStyle.BorderLeft = BorderStyle.Thin;
                totalStyle.BorderRight = BorderStyle.Thin;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontHeightInPoints = 10;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 8));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE VENTAS GENERALES (FILTRADAS)");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 8));

                // Filtro aplicado
                if (!string.IsNullOrEmpty(filtroAplicado))
                {
                    IRow filterRow = sheet.CreateRow(rowIndex++);
                    filterRow.CreateCell(0).SetCellValue($"FILTRO APLICADO: {filtroAplicado}");
                    filterRow.GetCell(0).CellStyle = filterStyle;
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));
                }

                // Periodo
                if (!string.IsNullOrEmpty(fechaInicio) && !string.IsNullOrEmpty(fechaFin))
                {
                    IRow periodRow = sheet.CreateRow(rowIndex++);
                    periodRow.CreateCell(0).SetCellValue($"PERÍODO: {fechaInicio} al {fechaFin}");
                    periodRow.GetCell(0).CellStyle = infoStyle;
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));
                }

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                rowIndex += 2;

                // Encabezados
                string[] headers = {
            "FOLIO",
            "FECHA TRANSPORTE",
            "CLIENTE",
            "TRANSPORTISTA",
            "VEHÍCULO",
            "ORIGEN",
            "MATERIAL",
            "METRAJE",
            "IMPORTE"
        };

                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalRegistros = 0;
                decimal sumatoriaTotal = 0;

                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    // Buscar el cuerpo de la tabla
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        foreach (Match row in rows)
                        {
                            var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            // Solo procesar si tiene 9 columnas y no es la fila de total
                            if (cells.Count >= 9)
                            {
                                string primeraCelda = Regex.Replace(cells[0].Groups[1].Value, @"<[^>]*>", "").Trim();

                                // Saltar fila de total (que dice "TOTAL:")
                                if (primeraCelda.Equals("TOTAL:", StringComparison.OrdinalIgnoreCase))
                                    continue;

                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalRegistros++;

                                for (int i = 0; i < 9; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);
                                    cell.SetCellValue(value);

                                    // Aplicar estilos según la columna
                                    if (i == 1) // Fecha
                                    {
                                        cell.CellStyle = dateStyle;
                                    }
                                    else if (i == 7) // Metraje
                                    {
                                        if (decimal.TryParse(value, out decimal num))
                                        {
                                            cell.SetCellValue((double)num);
                                            cell.CellStyle = numberStyle;
                                        }
                                        else
                                        {
                                            cell.CellStyle = dataStyle;
                                        }
                                    }
                                    else if (i == 8) // Importe
                                    {
                                        // Limpiar formato de moneda para parsear
                                        string cleanValue = value.Replace("$", "")
                                                                 .Replace(",", "")
                                                                 .Replace("MXN", "")
                                                                 .Trim();

                                        if (decimal.TryParse(cleanValue, out decimal importe))
                                        {
                                            cell.SetCellValue((double)importe);
                                            sumatoriaTotal += importe;
                                            cell.CellStyle = currencyStyle;
                                        }
                                        else if (decimal.TryParse(value, out importe))
                                        {
                                            cell.SetCellValue((double)importe);
                                            sumatoriaTotal += importe;
                                            cell.CellStyle = currencyStyle;
                                        }
                                        else
                                        {
                                            cell.CellStyle = dataStyle;
                                        }
                                    }
                                    else // Texto normal
                                    {
                                        cell.CellStyle = dataStyle;
                                        cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= TOTAL =================
                rowIndex++;
                IRow totalRow = sheet.CreateRow(rowIndex++);

                // Celda con texto "TOTAL:"
                totalRow.CreateCell(7).SetCellValue("TOTAL:");
                totalRow.GetCell(7).CellStyle = totalStyle;

                // Celda con valor total
                ICell totalCell = totalRow.CreateCell(8);
                totalCell.SetCellValue((double)sumatoriaTotal);
                totalCell.CellStyle = totalStyle;

                // ================= RESUMEN =================
                rowIndex += 2;

                IRow summaryRow1 = sheet.CreateRow(rowIndex++);
                summaryRow1.CreateCell(0).SetCellValue($"Total de registros filtrados: {totalRegistros}");
                summaryRow1.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                IRow summaryRow2 = sheet.CreateRow(rowIndex++);
                summaryRow2.CreateCell(0).SetCellValue($"Importe total filtrado: {sumatoriaTotal.ToString("C", new System.Globalization.CultureInfo("es-MX"))}");
                summaryRow2.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"VentasFiltradas_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        #endregion

        #region Empleados
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteEmpleados(string tablaHTML)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Empleados");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = false;
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna para 5 columnas
                sheet.SetColumnWidth(0, 30 * 256);  // Nombre Completo
                sheet.SetColumnWidth(1, 15 * 256);  // NSS
                sheet.SetColumnWidth(2, 20 * 256);  // Departamento
                sheet.SetColumnWidth(3, 15 * 256);  // Teléfono
                sheet.SetColumnWidth(4, 18 * 256);  // Fecha Contratación

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.Black.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportFont = workbook.CreateFont();
                reportFont.FontName = "Calibri";
                reportFont.FontHeightInPoints = 14;
                reportFont.IsBold = true;
                reportFont.Color = IndexedColors.Black.Index;
                reportTitleStyle.SetFont(reportFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;

                // Encabezados tabla
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.Grey80Percent.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // Fecha
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;
                dateStyle.DataFormat = workbook.CreateDataFormat().GetFormat("dd/MM/yyyy");

                // Teléfono
                ICellStyle phoneStyle = workbook.CreateCellStyle();
                phoneStyle.CloneStyleFrom(dataStyle);
                phoneStyle.Alignment = HorizontalAlignment.Center;

                // NSS (formato especial)
                ICellStyle nssStyle = workbook.CreateCellStyle();
                nssStyle.CloneStyleFrom(dataStyle);
                nssStyle.Alignment = HorizontalAlignment.Center;

                // Resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontHeightInPoints = 10;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 4));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE EMPLEADOS");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 4));

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 4));

                rowIndex += 2;

                // Encabezados
                string[] headers = {
            "NOMBRE COMPLETO",
            "NSS",
            "DEPARTAMENTO",
            "TELÉFONO",
            "FECHA CONTRATACIÓN"
        };

                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalEmpleados = 0;

                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    // Buscar el cuerpo de la tabla
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        foreach (Match row in rows)
                        {
                            var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (cells.Count >= 5)
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalEmpleados++;

                                for (int i = 0; i < 5; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);
                                    cell.SetCellValue(value);

                                    // Aplicar estilos según la columna
                                    if (i == 0) // Nombre completo
                                    {
                                        cell.CellStyle = dataStyle;
                                        cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                    }
                                    else if (i == 1) // NSS
                                    {
                                        cell.CellStyle = nssStyle;

                                        // Formatear NSS si es un número largo
                                        if (value.Length == 11 && long.TryParse(value, out long nssNum))
                                        {
                                            cell.SetCellValue($"{nssNum:###-##-#####}");
                                        }
                                    }
                                    else if (i == 2) // Departamento
                                    {
                                        cell.CellStyle = dataStyle;
                                        cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                    }
                                    else if (i == 3) // Teléfono
                                    {
                                        cell.CellStyle = phoneStyle;

                                        // Formatear teléfono si es un número
                                        if (value.Length == 10 && long.TryParse(value, out long phoneNum))
                                        {
                                            cell.SetCellValue($"{phoneNum:(###) ###-####}");
                                        }
                                    }
                                    else if (i == 4) // Fecha Contratación
                                    {
                                        cell.CellStyle = dateStyle;

                                        // Intentar parsear como fecha
                                        if (DateTime.TryParse(value, out DateTime fecha))
                                        {
                                            cell.SetCellValue(fecha);
                                        }
                                        else if (value.Contains('/'))
                                        {
                                            // Intentar parsear formato dd/MM/yyyy
                                            var partes = value.Split('/');
                                            if (partes.Length == 3 &&
                                                int.TryParse(partes[0], out int dia) &&
                                                int.TryParse(partes[1], out int mes) &&
                                                int.TryParse(partes[2], out int anio))
                                            {
                                                try
                                                {
                                                    cell.SetCellValue(new DateTime(anio, mes, dia));
                                                }
                                                catch
                                                {
                                                    cell.SetCellValue(value);
                                                }
                                            }
                                            else
                                            {
                                                cell.SetCellValue(value);
                                            }
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= RESUMEN =================
                rowIndex += 2;

                IRow summaryRow = sheet.CreateRow(rowIndex++);
                summaryRow.CreateCell(0).SetCellValue($"Total de empleados: {totalEmpleados}");
                summaryRow.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                // ================= DATOS ADICIONALES =================
                rowIndex++;

                // Agregar información de la empresa
                IRow infoRow1 = sheet.CreateRow(rowIndex++);
                infoRow1.CreateCell(0).SetCellValue("MINA SAN MIGUEL S.A. DE C.V.");
                infoRow1.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"Empleados_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteConsolidado(string tablaHTML, string totalGeneralSalarios, string totalGeneralConceptos, string fechaInicio, string fechaFin)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Reporte Consolidado");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = true; // Horizontal para más columnas
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.Black.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportFont = workbook.CreateFont();
                reportFont.FontName = "Calibri";
                reportFont.FontHeightInPoints = 14;
                reportFont.IsBold = true;
                reportFont.Color = IndexedColors.Black.Index;
                reportTitleStyle.SetFont(reportFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;

                // Encabezados tabla principal
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.Grey80Percent.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;

                // Encabezados tabla resumen
                ICellStyle summaryHeaderStyle = workbook.CreateCellStyle();
                IFont summaryHeaderFont = workbook.CreateFont();
                summaryHeaderFont.FontHeightInPoints = 10;
                summaryHeaderFont.IsBold = true;
                summaryHeaderFont.Color = IndexedColors.White.Index;
                summaryHeaderStyle.SetFont(summaryHeaderFont);
                summaryHeaderStyle.FillForegroundColor = IndexedColors.DarkBlue.Index;
                summaryHeaderStyle.FillPattern = FillPattern.SolidForeground;
                summaryHeaderStyle.Alignment = HorizontalAlignment.Center;
                summaryHeaderStyle.BorderTop = BorderStyle.Thin;
                summaryHeaderStyle.BorderBottom = BorderStyle.Thin;
                summaryHeaderStyle.BorderLeft = BorderStyle.Thin;
                summaryHeaderStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // Moneda
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Total empleado
                ICellStyle totalEmpleadoStyle = workbook.CreateCellStyle();
                IFont totalEmpleadoFont = workbook.CreateFont();
                totalEmpleadoFont.IsBold = true;
                totalEmpleadoFont.Color = IndexedColors.DarkRed.Index;
                totalEmpleadoStyle.SetFont(totalEmpleadoFont);
                totalEmpleadoStyle.CloneStyleFrom(currencyStyle);
                totalEmpleadoStyle.FillForegroundColor = IndexedColors.LightYellow.Index;
                totalEmpleadoStyle.FillPattern = FillPattern.SolidForeground;

                // Total general
                ICellStyle totalGeneralStyle = workbook.CreateCellStyle();
                IFont totalGeneralFont = workbook.CreateFont();
                totalGeneralFont.IsBold = true;
                totalGeneralFont.FontHeightInPoints = 12;
                totalGeneralFont.Color = IndexedColors.White.Index;
                totalGeneralStyle.SetFont(totalGeneralFont);
                totalGeneralStyle.FillForegroundColor = IndexedColors.Green.Index;
                totalGeneralStyle.FillPattern = FillPattern.SolidForeground;
                totalGeneralStyle.Alignment = HorizontalAlignment.Right;
                totalGeneralStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Resumen concepto
                ICellStyle resumenConceptoStyle = workbook.CreateCellStyle();
                resumenConceptoStyle.CloneStyleFrom(dataStyle);
                resumenConceptoStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                resumenConceptoStyle.FillPattern = FillPattern.SolidForeground;

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 10));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE CONSOLIDADO DE NÓMINAS Y CONCEPTOS");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 10));

                // Periodo
                if (!string.IsNullOrEmpty(fechaInicio) && !string.IsNullOrEmpty(fechaFin))
                {
                    IRow periodRow = sheet.CreateRow(rowIndex++);
                    periodRow.CreateCell(0).SetCellValue($"PERÍODO: {fechaInicio} al {fechaFin}");
                    periodRow.GetCell(0).CellStyle = infoStyle;
                    sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 10));
                }

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 10));

                rowIndex += 2;

                // ================= PROCESAR TABLA HTML =================
                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    try
                    {
                        // Extraer la primera tabla (empleados)
                        var primeraTablaMatch = Regex.Match(tablaHTML, @"<table[^>]*>(.*?)</table>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        if (primeraTablaMatch.Success)
                        {
                            // Procesar encabezados de la primera tabla
                            var theadMatch = Regex.Match(primeraTablaMatch.Value, @"<thead[^>]*>(.*?)</thead>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (theadMatch.Success)
                            {
                                var headers = Regex.Matches(theadMatch.Groups[1].Value, @"<th[^>]*>(.*?)</th>",
                                    RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                // Crear fila de encabezados
                                IRow headerRow = sheet.CreateRow(rowIndex++);
                                for (int i = 0; i < headers.Count; i++)
                                {
                                    string headerText = Regex.Replace(headers[i].Groups[1].Value, @"<[^>]*>", "");
                                    headerText = System.Web.HttpUtility.HtmlDecode(headerText).Trim();

                                    ICell headerCell = headerRow.CreateCell(i);
                                    headerCell.SetCellValue(headerText);
                                    headerCell.CellStyle = headerStyle;
                                }

                                // Procesar filas de datos
                                var tbodyMatch = Regex.Match(primeraTablaMatch.Value, @"<tbody[^>]*>(.*?)</tbody>",
                                    RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                if (tbodyMatch.Success)
                                {
                                    var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                    foreach (Match row in rows)
                                    {
                                        var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                        if (cells.Count > 0)
                                        {
                                            IRow dataRow = sheet.CreateRow(rowIndex++);

                                            for (int i = 0; i < cells.Count && i < headers.Count; i++)
                                            {
                                                string cellValue = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                                cellValue = System.Web.HttpUtility.HtmlDecode(cellValue).Trim();

                                                ICell cell = dataRow.CreateCell(i);

                                                // Verificar si es valor monetario
                                                if (i > 0 && cellValue != "-") // No es la primera columna (empleado)
                                                {
                                                    // Limpiar formato de moneda
                                                    string cleanValue = cellValue.Replace("$", "")
                                                                                 .Replace(",", "")
                                                                                 .Replace("MXN", "")
                                                                                 .Trim();

                                                    if (decimal.TryParse(cleanValue, out decimal decimalValue))
                                                    {
                                                        cell.SetCellValue((double)decimalValue);
                                                        cell.CellStyle = currencyStyle;

                                                        // Si es la última columna (Total General), aplicar estilo especial
                                                        if (i == headers.Count - 1)
                                                        {
                                                            cell.CellStyle = totalEmpleadoStyle;
                                                        }
                                                    }
                                                    else
                                                    {
                                                        cell.SetCellValue(cellValue);
                                                        cell.CellStyle = dataStyle;
                                                    }
                                                }
                                                else
                                                {
                                                    cell.SetCellValue(cellValue);
                                                    cell.CellStyle = dataStyle;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // ================= TABLA DE CONCEPTOS AGRUPADOS =================
                        rowIndex += 2;

                        // Extraer la segunda tabla (resumen de conceptos)
                        var segundaTablaMatch = Regex.Match(tablaHTML, @"Resumen de Conceptos Agrupados.*?<table[^>]*>(.*?)</table>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        if (segundaTablaMatch.Success)
                        {
                            IRow tituloResumenRow = sheet.CreateRow(rowIndex++);
                            tituloResumenRow.CreateCell(0).SetCellValue("RESUMEN DE CONCEPTOS AGRUPADOS");
                            tituloResumenRow.GetCell(0).CellStyle = reportTitleStyle;
                            sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                            // Encabezados tabla resumen
                            IRow resumenHeaderRow = sheet.CreateRow(rowIndex++);
                            resumenHeaderRow.CreateCell(0).SetCellValue("CONCEPTO");
                            resumenHeaderRow.CreateCell(1).SetCellValue("TOTAL GENERAL");

                            resumenHeaderRow.GetCell(0).CellStyle = summaryHeaderStyle;
                            resumenHeaderRow.GetCell(1).CellStyle = summaryHeaderStyle;

                            // Procesar filas de la tabla de resumen
                            var resumenRows = Regex.Matches(segundaTablaMatch.Value, @"<tr[^>]*>(.*?)</tr>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            decimal totalConceptosAgrupados = 0;

                            foreach (Match row in resumenRows)
                            {
                                var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                    RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                if (cells.Count >= 2)
                                {
                                    IRow resumenDataRow = sheet.CreateRow(rowIndex++);

                                    for (int i = 0; i < 2; i++)
                                    {
                                        string cellValue = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                        cellValue = System.Web.HttpUtility.HtmlDecode(cellValue).Trim();

                                        ICell cell = resumenDataRow.CreateCell(i);

                                        if (i == 1) // Columna de total
                                        {
                                            // Limpiar formato de moneda
                                            string cleanValue = cellValue.Replace("$", "")
                                                                         .Replace(",", "")
                                                                         .Replace("MXN", "")
                                                                         .Trim();

                                            if (decimal.TryParse(cleanValue, out decimal decimalValue))
                                            {
                                                cell.SetCellValue((double)decimalValue);
                                                cell.CellStyle = currencyStyle;

                                                // Acumular total
                                                if (!cellValue.Contains("TOTAL CONCEPTOS AGRUPADOS"))
                                                {
                                                    totalConceptosAgrupados += decimalValue;
                                                }
                                                else
                                                {
                                                    // Es la fila de total
                                                    cell.CellStyle = totalEmpleadoStyle;
                                                }
                                            }
                                            else
                                            {
                                                cell.SetCellValue(cellValue);
                                                cell.CellStyle = resumenConceptoStyle;
                                            }
                                        }
                                        else
                                        {
                                            cell.SetCellValue(cellValue);
                                            cell.CellStyle = resumenConceptoStyle;
                                        }
                                    }
                                }
                            }
                        }

                        // ================= TOTALES GENERALES =================
                        rowIndex += 2;

                        IRow tituloTotalesRow = sheet.CreateRow(rowIndex++);
                        tituloTotalesRow.CreateCell(0).SetCellValue("TOTALES GENERALES");
                        tituloTotalesRow.GetCell(0).CellStyle = reportTitleStyle;
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                        // Total General Salarios
                        IRow totalSalariosRow = sheet.CreateRow(rowIndex++);
                        totalSalariosRow.CreateCell(0).SetCellValue("Total General Salarios:");
                        totalSalariosRow.CreateCell(1).SetCellValue(decimal.TryParse(totalGeneralSalarios, out decimal salarios) ? (double)salarios : 0);
                        totalSalariosRow.GetCell(0).CellStyle = resumenConceptoStyle;
                        totalSalariosRow.GetCell(1).CellStyle = currencyStyle;

                        // Total General Conceptos
                        IRow totalConceptosRow = sheet.CreateRow(rowIndex++);
                        totalConceptosRow.CreateCell(0).SetCellValue("Total General Conceptos:");
                        totalConceptosRow.CreateCell(1).SetCellValue(decimal.TryParse(totalGeneralConceptos, out decimal conceptos) ? (double)conceptos : 0);
                        totalConceptosRow.GetCell(0).CellStyle = resumenConceptoStyle;
                        totalConceptosRow.GetCell(1).CellStyle = currencyStyle;

                        // Línea separadora
                        IRow separadorRow = sheet.CreateRow(rowIndex++);
                        separadorRow.CreateCell(0).SetCellValue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
                        separadorRow.GetCell(0).CellStyle = infoStyle;
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                        // Total General
                        decimal totalSal = decimal.TryParse(totalGeneralSalarios, out decimal ts) ? ts : 0;
                        decimal totalCon = decimal.TryParse(totalGeneralConceptos, out decimal tc) ? tc : 0;
                        decimal totalGeneral = totalSal + totalCon;

                        IRow totalGeneralRow = sheet.CreateRow(rowIndex++);
                        totalGeneralRow.CreateCell(0).SetCellValue("TOTAL GENERAL:");
                        totalGeneralRow.CreateCell(1).SetCellValue((double)totalGeneral);
                        totalGeneralRow.GetCell(0).CellStyle = totalGeneralStyle;
                        totalGeneralRow.GetCell(1).CellStyle = totalGeneralStyle;

                        // Ajustar anchos de columnas dinámicamente
                        for (int i = 0; i <= 10; i++)
                        {
                            sheet.AutoSizeColumn(i);
                        }

                    }
                    catch (Exception ex)
                    {
                        // Si hay error al procesar HTML, crear una tabla simple con los totales
                        IRow errorRow = sheet.CreateRow(rowIndex++);
                        errorRow.CreateCell(0).SetCellValue("Error al procesar datos detallados. Mostrando solo totales:");
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                        // Mostrar totales directamente
                        IRow totalRow = sheet.CreateRow(rowIndex++);
                        totalRow.CreateCell(0).SetCellValue("Total General:");
                        totalRow.CreateCell(1).SetCellValue("$ " +
                            (decimal.TryParse(totalGeneralSalarios, out decimal sal) &&
                             decimal.TryParse(totalGeneralConceptos, out decimal con) ?
                             (sal + con).ToString("N2") : "0.00"));
                        totalRow.GetCell(1).CellStyle = totalGeneralStyle;
                    }
                }

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                string fileName = $"ReporteConsolidado_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        #endregion

        #region Taller

        #endregion
    }
}