using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using NPOI.XSSF.UserModel;
using System;
using System.Globalization;
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
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteInventario(string tablaHTML)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Inventario");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = true; // Horizontal para 9 columnas
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna para 9 columnas
                sheet.SetColumnWidth(0, 25 * 256);  // Nombre
                sheet.SetColumnWidth(1, 15 * 256);  // Categoría
                sheet.SetColumnWidth(2, 15 * 256);  // Marca
                sheet.SetColumnWidth(3, 20 * 256);  // Código Fabricante
                sheet.SetColumnWidth(4, 15 * 256);  // Estado Inventario
                sheet.SetColumnWidth(5, 15 * 256);  // Cantidad Existente
                sheet.SetColumnWidth(6, 15 * 256);  // Precio
                sheet.SetColumnWidth(7, 20 * 256);  // Ubicación Almacén
                sheet.SetColumnWidth(8, 20 * 256);  // Proveedor

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

                // Estilo para cantidad (número entero)
                ICellStyle cantidadStyle = workbook.CreateCellStyle();
                cantidadStyle.CloneStyleFrom(dataStyle);
                cantidadStyle.Alignment = HorizontalAlignment.Center;
                cantidadStyle.DataFormat = workbook.CreateDataFormat().GetFormat("#,##0");

                // Estilo para precio (moneda)
                ICellStyle precioStyle = workbook.CreateCellStyle();
                precioStyle.CloneStyleFrom(dataStyle);
                precioStyle.Alignment = HorizontalAlignment.Right;
                precioStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Estilo para estado inventario (con colores según condición)
                // CORRECCIÓN: Cambiar IndexedColors.Rose a IndexedColors.Red
                ICellStyle estadoAgotadoStyle = workbook.CreateCellStyle();
                IFont estadoAgotadoFont = workbook.CreateFont();
                estadoAgotadoFont.Color = IndexedColors.White.Index; // Cambiar texto a blanco para mejor contraste
                estadoAgotadoStyle.SetFont(estadoAgotadoFont);
                estadoAgotadoStyle.CloneStyleFrom(dataStyle);
                estadoAgotadoStyle.Alignment = HorizontalAlignment.Center;
                estadoAgotadoStyle.FillForegroundColor = IndexedColors.Red.Index; // CAMBIO AQUÍ: Rosa -> Rojo
                estadoAgotadoStyle.FillPattern = FillPattern.SolidForeground;

                ICellStyle estadoBajoStyle = workbook.CreateCellStyle();
                IFont estadoBajoFont = workbook.CreateFont();
                estadoBajoFont.Color = IndexedColors.DarkRed.Index;
                estadoBajoStyle.SetFont(estadoBajoFont);
                estadoBajoStyle.CloneStyleFrom(dataStyle);
                estadoBajoStyle.Alignment = HorizontalAlignment.Center;
                estadoBajoStyle.FillForegroundColor = IndexedColors.Orange.Index;
                estadoBajoStyle.FillPattern = FillPattern.SolidForeground;

                ICellStyle estadoNormalStyle = workbook.CreateCellStyle();
                IFont estadoNormalFont = workbook.CreateFont();
                estadoNormalFont.Color = IndexedColors.DarkGreen.Index;
                estadoNormalStyle.SetFont(estadoNormalFont);
                estadoNormalStyle.CloneStyleFrom(dataStyle);
                estadoNormalStyle.Alignment = HorizontalAlignment.Center;
                estadoNormalStyle.FillForegroundColor = IndexedColors.LightGreen.Index;
                estadoNormalStyle.FillPattern = FillPattern.SolidForeground;

                ICellStyle estadoSuficienteStyle = workbook.CreateCellStyle();
                IFont estadoSuficienteFont = workbook.CreateFont();
                estadoSuficienteFont.Color = IndexedColors.DarkBlue.Index;
                estadoSuficienteStyle.SetFont(estadoSuficienteFont);
                estadoSuficienteStyle.CloneStyleFrom(dataStyle);
                estadoSuficienteStyle.Alignment = HorizontalAlignment.Center;
                estadoSuficienteStyle.FillForegroundColor = IndexedColors.PaleBlue.Index;
                estadoSuficienteStyle.FillPattern = FillPattern.SolidForeground;

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

                // Total valor inventario
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.IsBold = true;
                totalFont.FontHeightInPoints = 12;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.DarkBlue.Index;
                totalStyle.FillPattern = FillPattern.SolidForeground;
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 8));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE INVENTARIO");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 8));

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 8));

                rowIndex += 2;

                // Encabezados
                string[] headers = {
            "NOMBRE",
            "CATEGORÍA",
            "MARCA",
            "CÓDIGO FABRICANTE",
            "ESTADO INVENTARIO",
            "CANTIDAD EXISTENTE",
            "PRECIO",
            "UBICACIÓN ALMACÉN",
            "PROVEEDOR"
        };

                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalProductos = 0;
                int totalAgotados = 0;
                int totalBajos = 0;
                int totalNormales = 0;
                int totalSuficientes = 0;
                decimal valorTotalInventario = 0;

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

                            if (cells.Count >= 9)
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalProductos++;

                                for (int i = 0; i < 9; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);

                                    // Aplicar estilos según la columna
                                    if (i == 0 || i == 1 || i == 2 || i == 3 || i == 7 || i == 8) // Texto
                                    {
                                        cell.SetCellValue(value);
                                        cell.CellStyle = dataStyle;
                                        cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                    }
                                    else if (i == 4) // Estado Inventario
                                    {
                                        cell.SetCellValue(value);

                                        // Aplicar estilo según el estado
                                        if (value.Contains("Agotado") || value.Contains("agotado"))
                                        {
                                            cell.CellStyle = estadoAgotadoStyle;
                                            totalAgotados++;
                                        }
                                        else if (value.Contains("Bajo") || value.Contains("bajo"))
                                        {
                                            cell.CellStyle = estadoBajoStyle;
                                            totalBajos++;
                                        }
                                        else if (value.Contains("Normal") || value.Contains("normal"))
                                        {
                                            cell.CellStyle = estadoNormalStyle;
                                            totalNormales++;
                                        }
                                        else if (value.Contains("Suficiente") || value.Contains("suficiente"))
                                        {
                                            cell.CellStyle = estadoSuficienteStyle;
                                            totalSuficientes++;
                                        }
                                        else
                                        {
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Center;
                                        }
                                    }
                                    else if (i == 5) // Cantidad Existente
                                    {
                                        if (int.TryParse(value, out int cantidad))
                                        {
                                            cell.SetCellValue(cantidad);
                                            cell.CellStyle = cantidadStyle;
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Center;
                                        }
                                    }
                                    else if (i == 6) // Precio
                                    {
                                        // Limpiar formato de moneda
                                        string cleanValue = value.Replace("$", "")
                                                                 .Replace(",", "")
                                                                 .Replace("MXN", "")
                                                                 .Trim();

                                        if (decimal.TryParse(cleanValue, out decimal precio))
                                        {
                                            cell.SetCellValue((double)precio);
                                            cell.CellStyle = precioStyle;

                                            // Calcular valor total del inventario (precio * cantidad)
                                            if (int.TryParse(Regex.Replace(cells[5].Groups[1].Value, @"<[^>]*>", ""), out int cant))
                                            {
                                                valorTotalInventario += precio * cant;
                                            }
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Right;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= RESUMEN ESTADÍSTICO (VERSIÓN FORMAL) =================
                rowIndex += 2;

                // Estilos formales para el resumen
                ICellStyle summaryHeaderStyle = workbook.CreateCellStyle();
                IFont summaryHeaderFont = workbook.CreateFont();
                summaryHeaderFont.FontHeightInPoints = 11;
                summaryHeaderFont.IsBold = true;
                summaryHeaderFont.Color = IndexedColors.White.Index;
                summaryHeaderStyle.SetFont(summaryHeaderFont);
                summaryHeaderStyle.FillForegroundColor = IndexedColors.DarkBlue.Index;
                summaryHeaderStyle.FillPattern = FillPattern.SolidForeground;
                summaryHeaderStyle.Alignment = HorizontalAlignment.Center;
                summaryHeaderStyle.BorderTop = BorderStyle.Medium;
                summaryHeaderStyle.BorderBottom = BorderStyle.Medium;
                summaryHeaderStyle.BorderLeft = BorderStyle.Medium;
                summaryHeaderStyle.BorderRight = BorderStyle.Medium;

                ICellStyle summarySubHeaderStyle = workbook.CreateCellStyle();
                IFont summarySubHeaderFont = workbook.CreateFont();
                summarySubHeaderFont.FontHeightInPoints = 10;
                summarySubHeaderFont.IsBold = true;
                summarySubHeaderFont.Color = IndexedColors.DarkBlue.Index;
                summarySubHeaderStyle.SetFont(summarySubHeaderFont);
                summarySubHeaderStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summarySubHeaderStyle.FillPattern = FillPattern.SolidForeground;
                summarySubHeaderStyle.Alignment = HorizontalAlignment.Left;
                summarySubHeaderStyle.BorderTop = BorderStyle.Thin;
                summarySubHeaderStyle.BorderBottom = BorderStyle.Thin;
                summarySubHeaderStyle.BorderLeft = BorderStyle.Thin;
                summarySubHeaderStyle.BorderRight = BorderStyle.Thin;

                ICellStyle summaryDataStyle = workbook.CreateCellStyle();
                IFont summaryDataFont = workbook.CreateFont();
                summaryDataFont.FontHeightInPoints = 10;
                summaryDataStyle.SetFont(summaryDataFont);
                summaryDataStyle.FillForegroundColor = IndexedColors.White.Index;
                summaryDataStyle.FillPattern = FillPattern.SolidForeground;
                summaryDataStyle.Alignment = HorizontalAlignment.Left;
                summaryDataStyle.BorderTop = BorderStyle.Thin;
                summaryDataStyle.BorderBottom = BorderStyle.Thin;
                summaryDataStyle.BorderLeft = BorderStyle.Thin;
                summaryDataStyle.BorderRight = BorderStyle.Thin;

                ICellStyle summaryTotalStyle = workbook.CreateCellStyle();
                IFont summaryTotalFont = workbook.CreateFont();
                summaryTotalFont.FontHeightInPoints = 10;
                summaryTotalFont.IsBold = true;
                summaryTotalStyle.SetFont(summaryTotalFont);
                summaryTotalStyle.FillForegroundColor = IndexedColors.LightCornflowerBlue.Index;
                summaryTotalStyle.FillPattern = FillPattern.SolidForeground;
                summaryTotalStyle.Alignment = HorizontalAlignment.Left;
                summaryTotalStyle.BorderTop = BorderStyle.Thin;
                summaryTotalStyle.BorderBottom = BorderStyle.Thin;
                summaryTotalStyle.BorderLeft = BorderStyle.Thin;
                summaryTotalStyle.BorderRight = BorderStyle.Thin;

                // Título del resumen
                IRow tituloResumenRow = sheet.CreateRow(rowIndex++);
                tituloResumenRow.CreateCell(0).SetCellValue("RESUMEN ESTADÍSTICO");
                tituloResumenRow.GetCell(0).CellStyle = summaryHeaderStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                // Información general del inventario
                IRow infoGeneralRow = sheet.CreateRow(rowIndex++);
                infoGeneralRow.CreateCell(0).SetCellValue("INFORMACIÓN GENERAL");
                infoGeneralRow.GetCell(0).CellStyle = summarySubHeaderStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                IRow totalProductosRow = sheet.CreateRow(rowIndex++);
                totalProductosRow.CreateCell(0).SetCellValue("Total de productos en inventario:");
                totalProductosRow.CreateCell(1).SetCellValue(totalProductos);
                totalProductosRow.GetCell(0).CellStyle = summaryDataStyle;
                totalProductosRow.GetCell(1).CellStyle = summaryDataStyle;
                totalProductosRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;

                // Distribución por estado
                IRow distribucionRow = sheet.CreateRow(rowIndex++);
                distribucionRow.CreateCell(0).SetCellValue("DISTRIBUCIÓN POR ESTADO");
                distribucionRow.GetCell(0).CellStyle = summarySubHeaderStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                // Agotados
                IRow estadoAgotadoRow = sheet.CreateRow(rowIndex++);
                estadoAgotadoRow.CreateCell(0).SetCellValue("Productos Agotados:");
                estadoAgotadoRow.CreateCell(1).SetCellValue(totalAgotados);
                if (totalProductos > 0)
                {
                    double porcentajeAgotado = Math.Round((double)totalAgotados / totalProductos * 100, 2);
                    estadoAgotadoRow.CreateCell(2).SetCellValue($"{porcentajeAgotado}%");
                }
                estadoAgotadoRow.GetCell(0).CellStyle = summaryDataStyle;
                estadoAgotadoRow.GetCell(1).CellStyle = summaryDataStyle;
                estadoAgotadoRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;
                if (estadoAgotadoRow.GetCell(2) != null)
                {
                    estadoAgotadoRow.GetCell(2).CellStyle = summaryDataStyle;
                    estadoAgotadoRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;
                }

                // Bajos
                IRow estadoBajoRow = sheet.CreateRow(rowIndex++);
                estadoBajoRow.CreateCell(0).SetCellValue("Productos con Existencia Baja:");
                estadoBajoRow.CreateCell(1).SetCellValue(totalBajos);
                if (totalProductos > 0)
                {
                    double porcentajeBajo = Math.Round((double)totalBajos / totalProductos * 100, 2);
                    estadoBajoRow.CreateCell(2).SetCellValue($"{porcentajeBajo}%");
                }
                estadoBajoRow.GetCell(0).CellStyle = summaryDataStyle;
                estadoBajoRow.GetCell(1).CellStyle = summaryDataStyle;
                estadoBajoRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;
                if (estadoBajoRow.GetCell(2) != null)
                {
                    estadoBajoRow.GetCell(2).CellStyle = summaryDataStyle;
                    estadoBajoRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;
                }

                // Normales
                IRow estadoNormalRow = sheet.CreateRow(rowIndex++);
                estadoNormalRow.CreateCell(0).SetCellValue("Productos con Existencia Normal:");
                estadoNormalRow.CreateCell(1).SetCellValue(totalNormales);
                if (totalProductos > 0)
                {
                    double porcentajeNormal = Math.Round((double)totalNormales / totalProductos * 100, 2);
                    estadoNormalRow.CreateCell(2).SetCellValue($"{porcentajeNormal}%");
                }
                estadoNormalRow.GetCell(0).CellStyle = summaryDataStyle;
                estadoNormalRow.GetCell(1).CellStyle = summaryDataStyle;
                estadoNormalRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;
                if (estadoNormalRow.GetCell(2) != null)
                {
                    estadoNormalRow.GetCell(2).CellStyle = summaryDataStyle;
                    estadoNormalRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;
                }

                // Suficientes
                IRow estadoSuficienteRow = sheet.CreateRow(rowIndex++);
                estadoSuficienteRow.CreateCell(0).SetCellValue("Productos con Existencia Suficiente:");
                estadoSuficienteRow.CreateCell(1).SetCellValue(totalSuficientes);
                if (totalProductos > 0)
                {
                    double porcentajeSuficiente = Math.Round((double)totalSuficientes / totalProductos * 100, 2);
                    estadoSuficienteRow.CreateCell(2).SetCellValue($"{porcentajeSuficiente}%");
                }
                estadoSuficienteRow.GetCell(0).CellStyle = summaryDataStyle;
                estadoSuficienteRow.GetCell(1).CellStyle = summaryDataStyle;
                estadoSuficienteRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;
                if (estadoSuficienteRow.GetCell(2) != null)
                {
                    estadoSuficienteRow.GetCell(2).CellStyle = summaryDataStyle;
                    estadoSuficienteRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;
                }

                // Total por estado (fila de resumen)
                IRow totalEstadosRow = sheet.CreateRow(rowIndex++);
                totalEstadosRow.CreateCell(0).SetCellValue("TOTAL:");
                totalEstadosRow.CreateCell(1).SetCellValue(totalProductos);
                totalEstadosRow.CreateCell(2).SetCellValue("100%");
                totalEstadosRow.GetCell(0).CellStyle = summaryTotalStyle;
                totalEstadosRow.GetCell(1).CellStyle = summaryTotalStyle;
                totalEstadosRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;
                totalEstadosRow.GetCell(2).CellStyle = summaryTotalStyle;
                totalEstadosRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;

                // Valor del inventario
                IRow valorInventarioRow = sheet.CreateRow(rowIndex++);
                valorInventarioRow.CreateCell(0).SetCellValue("VALORACIÓN DEL INVENTARIO");
                valorInventarioRow.GetCell(0).CellStyle = summarySubHeaderStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                IRow valorTotalRow = sheet.CreateRow(rowIndex++);
                valorTotalRow.CreateCell(0).SetCellValue("Valor Total del Inventario:");
                ICell valorTotalCell = valorTotalRow.CreateCell(1);
                valorTotalCell.SetCellValue((double)valorTotalInventario);
                valorTotalCell.CellStyle = totalStyle;
                valorTotalCell.CellStyle.Alignment = HorizontalAlignment.Right;
                valorTotalRow.GetCell(0).CellStyle = summaryDataStyle;

                // Promedio por producto (si hay productos)
                if (totalProductos > 0)
                {
                    decimal promedioPorProducto = valorTotalInventario / totalProductos;
                    IRow promedioRow = sheet.CreateRow(rowIndex++);
                    promedioRow.CreateCell(0).SetCellValue("Valor Promedio por Producto:");
                    ICell promedioCell = promedioRow.CreateCell(1);
                    promedioCell.SetCellValue((double)promedioPorProducto);
                    promedioCell.CellStyle = precioStyle;
                    promedioRow.GetCell(0).CellStyle = summaryDataStyle;
                }

                // ================= LEYENDA DE ESTADOS =================
                rowIndex += 2;

                IRow leyendaRow = sheet.CreateRow(rowIndex++);
                leyendaRow.CreateCell(0).SetCellValue("LEYENDA DE ESTADOS");
                leyendaRow.GetCell(0).CellStyle = summaryHeaderStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 8));

                // Leyenda en formato de tabla
                IRow leyendaHeaderRow = sheet.CreateRow(rowIndex++);
                leyendaHeaderRow.CreateCell(0).SetCellValue("ESTADO");
                leyendaHeaderRow.CreateCell(1).SetCellValue("DESCRIPCIÓN");
                leyendaHeaderRow.CreateCell(2).SetCellValue("CRITERIO");
                leyendaHeaderRow.GetCell(0).CellStyle = summarySubHeaderStyle;
                leyendaHeaderRow.GetCell(1).CellStyle = summarySubHeaderStyle;
                leyendaHeaderRow.GetCell(2).CellStyle = summarySubHeaderStyle;

                IRow leyenda1 = sheet.CreateRow(rowIndex++);
                leyenda1.CreateCell(0).SetCellValue("Agotado");
                leyenda1.CreateCell(1).SetCellValue("Sin existencia disponible");
                leyenda1.CreateCell(2).SetCellValue("Cantidad = 0");
                // CORRECCIÓN: Cambiado el fondo a rojo y texto a blanco
                leyenda1.GetCell(0).CellStyle = estadoAgotadoStyle;
                leyenda1.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;
                leyenda1.GetCell(1).CellStyle = summaryDataStyle;
                leyenda1.GetCell(2).CellStyle = summaryDataStyle;

                IRow leyenda2 = sheet.CreateRow(rowIndex++);
                leyenda2.CreateCell(0).SetCellValue("Bajo");
                leyenda2.CreateCell(1).SetCellValue("Existencia menor al mínimo recomendado");
                leyenda2.CreateCell(2).SetCellValue("Cantidad ≤ 5");
                leyenda2.GetCell(0).CellStyle = estadoBajoStyle;
                leyenda2.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;
                leyenda2.GetCell(1).CellStyle = summaryDataStyle;
                leyenda2.GetCell(2).CellStyle = summaryDataStyle;

                IRow leyenda3 = sheet.CreateRow(rowIndex++);
                leyenda3.CreateCell(0).SetCellValue("Normal");
                leyenda3.CreateCell(1).SetCellValue("Existencia dentro del rango operativo normal");
                leyenda3.CreateCell(2).SetCellValue("6 ≤ Cantidad ≤ 20");
                leyenda3.GetCell(0).CellStyle = estadoNormalStyle;
                leyenda3.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;
                leyenda3.GetCell(1).CellStyle = summaryDataStyle;
                leyenda3.GetCell(2).CellStyle = summaryDataStyle;

                IRow leyenda4 = sheet.CreateRow(rowIndex++);
                leyenda4.CreateCell(0).SetCellValue("Suficiente");
                leyenda4.CreateCell(1).SetCellValue("Existencia óptima para operaciones");
                leyenda4.CreateCell(2).SetCellValue("Cantidad > 20");
                leyenda4.GetCell(0).CellStyle = estadoSuficienteStyle;
                leyenda4.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;
                leyenda4.GetCell(1).CellStyle = summaryDataStyle;
                leyenda4.GetCell(2).CellStyle = summaryDataStyle;

                // ================= AJUSTES FINALES =================
                // Ajustar automáticamente el ancho de las columnas del resumen
                for (int i = 0; i <= 8; i++)
                {
                    sheet.AutoSizeColumn(i);
                }

                // Asegurar que las columnas tengan un ancho mínimo
                int[] minWidths = { 25, 15, 15, 20, 15, 15, 15, 20, 20 };
                for (int i = 0; i < minWidths.Length; i++)
                {
                    if (sheet.GetColumnWidth(i) < minWidths[i] * 256)
                    {
                        sheet.SetColumnWidth(i, minWidths[i] * 256);
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

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    $"Inventario_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
        #endregion

        #region VentaPublicoGeneral
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteUtilidades(string htmlContent, string fecha, string userName, string existeCorteId)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Utilidades Diarias");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = false;
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
                infoStyle.Alignment = HorizontalAlignment.Left;

                // Advertencia
                ICellStyle warningStyle = workbook.CreateCellStyle();
                IFont warningFont = workbook.CreateFont();
                warningFont.FontHeightInPoints = 11;
                warningFont.IsBold = true;
                warningFont.Color = IndexedColors.Red.Index;
                warningStyle.SetFont(warningFont);
                warningStyle.Alignment = HorizontalAlignment.Center;
                warningStyle.FillForegroundColor = IndexedColors.LightYellow.Index;
                warningStyle.FillPattern = FillPattern.SolidForeground;
                warningStyle.BorderTop = BorderStyle.Thin;
                warningStyle.BorderBottom = BorderStyle.Thin;
                warningStyle.BorderLeft = BorderStyle.Thin;
                warningStyle.BorderRight = BorderStyle.Thin;

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

                // Moneda
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Título sección
                ICellStyle sectionTitleStyle = workbook.CreateCellStyle();
                IFont sectionFont = workbook.CreateFont();
                sectionFont.FontHeightInPoints = 12;
                sectionFont.IsBold = true;
                sectionFont.Color = IndexedColors.DarkBlue.Index;
                sectionTitleStyle.SetFont(sectionFont);
                sectionTitleStyle.Alignment = HorizontalAlignment.Left;
                sectionTitleStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                sectionTitleStyle.FillPattern = FillPattern.SolidForeground;

                // Resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontHeightInPoints = 10;
                summaryFont.IsBold = true;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // Total resumen
                ICellStyle totalSummaryStyle = workbook.CreateCellStyle();
                IFont totalSummaryFont = workbook.CreateFont();
                totalSummaryFont.FontHeightInPoints = 11;
                totalSummaryFont.IsBold = true;
                totalSummaryFont.Color = IndexedColors.White.Index;
                totalSummaryStyle.SetFont(totalSummaryFont);
                totalSummaryStyle.FillForegroundColor = IndexedColors.DarkBlue.Index;
                totalSummaryStyle.FillPattern = FillPattern.SolidForeground;
                totalSummaryStyle.Alignment = HorizontalAlignment.Right;
                totalSummaryStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // ================= CONTENIDO =================

                // Empresa
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.CreateCell(0).SetCellValue("MINA SAN MIGUEL");
                companyRow.GetCell(0).CellStyle = companyStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 7));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE UTILIDADES DIARIAS");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 7));

                // Información del reporte
                IRow fechaRow = sheet.CreateRow(rowIndex++);
                fechaRow.CreateCell(0).SetCellValue($"Fecha de Reporte: {fecha}");
                fechaRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 7));

                IRow usuarioRow = sheet.CreateRow(rowIndex++);
                usuarioRow.CreateCell(0).SetCellValue($"Usuario: {userName}");
                usuarioRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(3, 3, 0, 7));

                IRow generacionRow = sheet.CreateRow(rowIndex++);
                generacionRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                generacionRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(4, 4, 0, 7));

                // Advertencia si ya existe Corte_Id
                if (!string.IsNullOrEmpty(existeCorteId) && existeCorteId.ToLower() == "true")
                {
                    rowIndex++;
                    IRow warningRow = sheet.CreateRow(rowIndex++);
                    warningRow.CreateCell(0).SetCellValue("Este reporte ya ha sido generado anteriormente.");
                    warningRow.GetCell(0).CellStyle = warningStyle;
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 7));
                }

                // ================= PROCESAR TABLAS DEL HTML =================
                if (!string.IsNullOrEmpty(htmlContent))
                {
                    try
                    {
                        // Extraer las tablas del HTML
                        var tableMatches = Regex.Matches(htmlContent, @"<table[^>]*>(.*?)</table>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        int tableCount = 0;
                        foreach (Match tableMatch in tableMatches)
                        {
                            tableCount++;

                            // Extraer título de la tabla (si existe)
                            string tableTitle = "";
                            var titleMatch = Regex.Match(tableMatch.Value, @"<h2[^>]*class=['""]tabla-titulo['""][^>]*>(.*?)</h2>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (titleMatch.Success)
                            {
                                tableTitle = Regex.Replace(titleMatch.Groups[1].Value, @"<[^>]*>", "");
                                tableTitle = System.Web.HttpUtility.HtmlDecode(tableTitle).Trim();
                            }
                            else
                            {
                                // Nombres por defecto para las tablas principales
                                string[] defaultTitles = {
                            "Ventas Realizadas",
                            "Resumen de Ventas Aprobadas",
                            "Dinero en Caja",
                            "Deducciones",
                            "Prepagos Realizados",
                            "Movimientos de Caja Chica"
                        };

                                if (tableCount - 1 < defaultTitles.Length)
                                {
                                    tableTitle = defaultTitles[tableCount - 1];
                                }
                                else
                                {
                                    tableTitle = $"Tabla {tableCount}";
                                }
                            }

                            // Saltar tablas vacías
                            var tbodyMatch = Regex.Match(tableMatch.Value, @"<tbody[^>]*>(.*?)</tbody>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (!tbodyMatch.Success) continue;

                            // Agregar título de la sección
                            rowIndex++;
                            IRow sectionTitleRow = sheet.CreateRow(rowIndex++);
                            sectionTitleRow.CreateCell(0).SetCellValue(tableTitle);
                            sectionTitleRow.GetCell(0).CellStyle = sectionTitleStyle;
                            sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 7));

                            // Procesar encabezados de la tabla
                            var theadMatch = Regex.Match(tableMatch.Value, @"<thead[^>]*>(.*?)</thead>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (theadMatch.Success)
                            {
                                var headers = Regex.Matches(theadMatch.Groups[1].Value, @"<th[^>]*>(.*?)</th>",
                                    RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                if (headers.Count > 0)
                                {
                                    IRow headerRow = sheet.CreateRow(rowIndex++);
                                    for (int i = 0; i < headers.Count && i < 8; i++) // Máximo 8 columnas
                                    {
                                        string headerText = Regex.Replace(headers[i].Groups[1].Value, @"<[^>]*>", "");
                                        headerText = System.Web.HttpUtility.HtmlDecode(headerText).Trim();

                                        ICell headerCell = headerRow.CreateCell(i);
                                        headerCell.SetCellValue(headerText);
                                        headerCell.CellStyle = headerStyle;
                                    }
                                }
                            }

                            // Procesar filas de datos
                            var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            foreach (Match row in rows)
                            {
                                var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                    RegexOptions.Singleline | RegexOptions.IgnoreCase);

                                if (cells.Count > 0)
                                {
                                    IRow dataRow = sheet.CreateRow(rowIndex++);

                                    for (int i = 0; i < cells.Count && i < 8; i++) // Máximo 8 columnas
                                    {
                                        string cellValue = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                        cellValue = System.Web.HttpUtility.HtmlDecode(cellValue).Trim();

                                        ICell cell = dataRow.CreateCell(i);

                                        // Verificar si es valor monetario (contiene $, MXN o es un número decimal)
                                        if (cellValue.Contains("$") || cellValue.Contains("MXN") ||
                                            (decimal.TryParse(cellValue.Replace("$", "").Replace(",", "").Replace("MXN", "").Trim(), out decimal decimalValue)))
                                        {
                                            // Limpiar formato de moneda
                                            string cleanValue = cellValue.Replace("$", "")
                                                                         .Replace(",", "")
                                                                         .Replace("MXN", "")
                                                                         .Trim();

                                            if (decimal.TryParse(cleanValue, out decimalValue))
                                            {
                                                cell.SetCellValue((double)decimalValue);
                                                cell.CellStyle = currencyStyle;
                                            }
                                            else
                                            {
                                                cell.SetCellValue(cellValue);
                                                cell.CellStyle = dataStyle;
                                            }
                                        }
                                        else if (int.TryParse(cellValue, out int intValue))
                                        {
                                            cell.SetCellValue(intValue);
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Right;
                                        }
                                        else
                                        {
                                            cell.SetCellValue(cellValue);
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                        }
                                    }
                                }
                            }

                            // Agregar espacio entre tablas
                            rowIndex++;
                        }

                        // ================= RESUMEN DE UTILIDADES =================
                        rowIndex++;

                        IRow resumenTitleRow = sheet.CreateRow(rowIndex++);
                        resumenTitleRow.CreateCell(0).SetCellValue("RESUMEN DE UTILIDADES");
                        resumenTitleRow.GetCell(0).CellStyle = sectionTitleStyle;
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 7));

                        // Extraer valores del HTML del resumen
                        decimal ingresos = 0, caja = 0, deducciones = 0, prepagos = 0, total = 0;

                        // Intentar extraer valores del HTML
                        var resumenMatch = Regex.Match(htmlContent, @"Resumen de Utilidades.*?<strong>Ingresos:</strong>\s*([^<]+).*?<strong>Caja:</strong>\s*([^<]+).*?<strong>Deducciones:</strong>\s*([^<]+).*?<strong>Prepagos:</strong>\s*([^<]+).*?<strong>Total Utilidad:</strong>\s*([^<]+)",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        if (resumenMatch.Success)
                        {
                            for (int i = 1; i <= 5; i++)
                            {
                                string value = resumenMatch.Groups[i].Value.Trim();
                                string cleanValue = value.Replace("$", "").Replace(",", "").Replace("MXN", "").Trim();

                                decimal val = 0;
                                decimal.TryParse(cleanValue, out val);

                                switch (i)
                                {
                                    case 1: ingresos = val; break;
                                    case 2: caja = val; break;
                                    case 3: deducciones = val; break;
                                    case 4: prepagos = val; break;
                                    case 5: total = val; break;
                                }
                            }
                        }

                        // Crear tabla de resumen
                        string[] resumenLabels = { "Ingresos:", "Caja:", "Deducciones:", "Prepagos:", "TOTAL UTILIDAD:" };
                        decimal[] resumenValores = { ingresos, caja, deducciones, prepagos, total };

                        for (int i = 0; i < resumenLabels.Length; i++)
                        {
                            IRow resumenRow = sheet.CreateRow(rowIndex++);

                            // Etiqueta
                            resumenRow.CreateCell(0).SetCellValue(resumenLabels[i]);

                            // Valor
                            ICell valorCell = resumenRow.CreateCell(1);
                            valorCell.SetCellValue((double)resumenValores[i]);

                            // Aplicar estilos
                            if (i < resumenLabels.Length - 1)
                            {
                                resumenRow.GetCell(0).CellStyle = summaryStyle;
                                valorCell.CellStyle = currencyStyle;
                            }
                            else // Última fila (TOTAL)
                            {
                                resumenRow.GetCell(0).CellStyle = totalSummaryStyle;
                                resumenRow.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Left;
                                valorCell.CellStyle = totalSummaryStyle;
                            }
                        }

                        // ================= ANÁLISIS ADICIONAL =================
                        rowIndex += 2;

                        IRow analisisTitleRow = sheet.CreateRow(rowIndex++);
                        analisisTitleRow.CreateCell(0).SetCellValue("ANÁLISIS FINANCIERO");
                        analisisTitleRow.GetCell(0).CellStyle = sectionTitleStyle;
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 7));

                        // Calcular porcentajes
                        decimal margenNeto = ingresos > 0 ? (total / ingresos) * 100 : 0;
                        decimal impactoDeducciones = ingresos > 0 ? (deducciones / ingresos) * 100 : 0;

                        IRow margenRow = sheet.CreateRow(rowIndex++);
                        margenRow.CreateCell(0).SetCellValue("Margen Neto:");
                        margenRow.CreateCell(1).SetCellValue($"{margenNeto:F2}%");
                        margenRow.GetCell(0).CellStyle = summaryStyle;
                        margenRow.GetCell(1).CellStyle = summaryStyle;
                        margenRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;

                        IRow impactoRow = sheet.CreateRow(rowIndex++);
                        impactoRow.CreateCell(0).SetCellValue("Impacto de Deducciones:");
                        impactoRow.CreateCell(1).SetCellValue($"{impactoDeducciones:F2}%");
                        impactoRow.GetCell(0).CellStyle = summaryStyle;
                        impactoRow.GetCell(1).CellStyle = summaryStyle;
                        impactoRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Right;

                        // Estado financiero
                        string estado = total >= 0 ? "POSITIVO" : "NEGATIVO";
                        ICellStyle estadoStyle = total >= 0 ?
                            CreateCellStyle(workbook, IndexedColors.DarkGreen, IndexedColors.LightGreen, true) :
                            CreateCellStyle(workbook, IndexedColors.Red, IndexedColors.Rose, true);

                        IRow estadoRow = sheet.CreateRow(rowIndex++);
                        estadoRow.CreateCell(0).SetCellValue("Estado Financiero:");
                        estadoRow.CreateCell(1).SetCellValue(estado);
                        estadoRow.GetCell(0).CellStyle = summaryStyle;
                        estadoRow.GetCell(1).CellStyle = estadoStyle;
                        estadoRow.GetCell(1).CellStyle.Alignment = HorizontalAlignment.Center;

                    }
                    catch (Exception ex)
                    {
                        // Si hay error al procesar HTML, agregar mensaje
                        rowIndex++;
                        IRow errorRow = sheet.CreateRow(rowIndex++);
                        errorRow.CreateCell(0).SetCellValue($"Error al procesar datos: {ex.Message}");
                        errorRow.GetCell(0).CellStyle = warningStyle;
                        sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 7));
                    }
                }

                // ================= AJUSTES FINALES =================
                // Ajustar automáticamente el ancho de las columnas
                for (int i = 0; i <= 7; i++)
                {
                    sheet.AutoSizeColumn(i);
                }

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                string fileName = $"Utilidades_{fecha.Replace("/", "_")}_{DateTime.Now:HHmmss}.xlsx";
                return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }

        // Método auxiliar para crear estilos dinámicos
        private ICellStyle CreateCellStyle(IWorkbook workbook, IndexedColors fontColor, IndexedColors bgColor, bool isBold = false)
        {
            ICellStyle style = workbook.CreateCellStyle();
            IFont font = workbook.CreateFont();
            font.FontHeightInPoints = 10;
            font.Color = fontColor.Index;
            font.IsBold = isBold;
            style.SetFont(font);
            style.FillForegroundColor = bgColor.Index;
            style.FillPattern = FillPattern.SolidForeground;
            style.BorderTop = BorderStyle.Thin;
            style.BorderBottom = BorderStyle.Thin;
            style.BorderLeft = BorderStyle.Thin;
            style.BorderRight = BorderStyle.Thin;
            return style;
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteVentaPorPlanta(string tablaHTML)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Ventas por Planta");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = false;
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna para 3 columnas
                sheet.SetColumnWidth(0, 15 * 256);  // Folio
                sheet.SetColumnWidth(1, 30 * 256);  // Planta
                sheet.SetColumnWidth(2, 25 * 256);  // Total Vendido

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

                // Folio (centrado)
                ICellStyle folioStyle = workbook.CreateCellStyle();
                folioStyle.CloneStyleFrom(dataStyle);
                folioStyle.Alignment = HorizontalAlignment.Center;

                // Planta (texto)
                ICellStyle plantaStyle = workbook.CreateCellStyle();
                plantaStyle.CloneStyleFrom(dataStyle);
                plantaStyle.Alignment = HorizontalAlignment.Left;

                // Total Vendido (moneda)
                ICellStyle totalStyle = workbook.CreateCellStyle();
                totalStyle.CloneStyleFrom(dataStyle);
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Total general
                ICellStyle totalGeneralStyle = workbook.CreateCellStyle();
                IFont totalGeneralFont = workbook.CreateFont();
                totalGeneralFont.IsBold = true;
                totalGeneralFont.FontHeightInPoints = 12;
                totalGeneralFont.Color = IndexedColors.White.Index;
                totalGeneralStyle.SetFont(totalGeneralFont);
                totalGeneralStyle.FillForegroundColor = IndexedColors.DarkBlue.Index;
                totalGeneralStyle.FillPattern = FillPattern.SolidForeground;
                totalGeneralStyle.Alignment = HorizontalAlignment.Right;
                totalGeneralStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

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
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 2));

                // Reporte
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.CreateCell(0).SetCellValue("REPORTE DE VENTAS POR PLANTA");
                reportRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 2));

                // Fecha generación
                IRow genRow = sheet.CreateRow(rowIndex++);
                genRow.CreateCell(0).SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(2, 2, 0, 2));

                rowIndex += 2;

                // Encabezados
                string[] headers = {
            "FOLIO",
            "PLANTA",
            "TOTAL VENDIDO EN M3"
        };

                IRow headerRow = sheet.CreateRow(rowIndex++);
                for (int i = 0; i < headers.Length; i++)
                {
                    headerRow.CreateCell(i).SetCellValue(headers[i]);
                    headerRow.GetCell(i).CellStyle = headerStyle;
                }

                // ================= DATOS =================
                int totalPlantas = 0;
                decimal totalGeneral = 0;

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

                            if (cells.Count >= 3)
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalPlantas++;

                                for (int i = 0; i < 3; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);

                                    // Aplicar estilos según la columna
                                    if (i == 0) // Folio
                                    {
                                        cell.SetCellValue(value);
                                        cell.CellStyle = folioStyle;
                                    }
                                    else if (i == 1) // Planta
                                    {
                                        cell.SetCellValue(value);
                                        cell.CellStyle = plantaStyle;
                                    }
                                    else if (i == 2) // Total Vendido
                                    {
                                        // Limpiar formato de moneda
                                        string cleanValue = value.Replace("$", "")
                                                                 .Replace(",", "")
                                                                 .Replace("MXN", "")
                                                                 .Trim();

                                        if (decimal.TryParse(cleanValue, out decimal totalVendido))
                                        {
                                            cell.SetCellValue((double)totalVendido);
                                            cell.CellStyle = totalStyle;

                                            // Acumular total general
                                            totalGeneral += totalVendido;
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Right;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= TOTAL GENERAL =================
                if (totalPlantas > 0)
                {
                    rowIndex++;

                    IRow totalGeneralRow = sheet.CreateRow(rowIndex++);

                    // Celda "TOTAL GENERAL:"
                    totalGeneralRow.CreateCell(0).SetCellValue("TOTAL GENERAL:");
                    totalGeneralRow.GetCell(0).CellStyle = totalGeneralStyle;
                    totalGeneralRow.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Right;

                    // Combinar celdas 0 y 1 para el texto
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 1));

                    // Celda con el valor total
                    ICell totalGeneralCell = totalGeneralRow.CreateCell(2);
                    totalGeneralCell.SetCellValue((double)totalGeneral);
                    totalGeneralCell.CellStyle = totalGeneralStyle;
                }

                // ================= RESUMEN ESTADÍSTICO =================
                rowIndex += 2;

                IRow resumenTitleRow = sheet.CreateRow(rowIndex++);
                resumenTitleRow.CreateCell(0).SetCellValue("RESUMEN DE VENTAS POR PLANTA");
                resumenTitleRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                // Total de plantas
                IRow totalPlantasRow = sheet.CreateRow(rowIndex++);
                totalPlantasRow.CreateCell(0).SetCellValue($"Total de plantas reportadas: {totalPlantas}");
                totalPlantasRow.GetCell(0).CellStyle = summaryStyle;
                // CORRECCIÓN: No combinar una sola celda
                // Solo crear la celda, no combinar con ella misma
                totalPlantasRow.CreateCell(1); // Crear celda adicional
                totalPlantasRow.CreateCell(2); // Crear celda adicional
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2)); // Combinar 3 columnas

                // Total general
                IRow totalGenRow = sheet.CreateRow(rowIndex++);
                totalGenRow.CreateCell(0).SetCellValue($"Total general de ventas:");
                totalGenRow.CreateCell(1).SetCellValue((double)totalGeneral);
                totalGenRow.GetCell(0).CellStyle = summaryStyle;
                totalGenRow.GetCell(1).CellStyle = totalStyle;
                // CORRECCIÓN: Crear todas las celdas primero
                totalGenRow.CreateCell(2); // Crear celda adicional
                                           // Combinar columnas 1 y 2 para el valor
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 1, 2));

                // Promedio por planta (si hay plantas)
                if (totalPlantas > 0)
                {
                    decimal promedioPorPlanta = totalGeneral / totalPlantas;

                    IRow promedioRow = sheet.CreateRow(rowIndex++);
                    promedioRow.CreateCell(0).SetCellValue($"Promedio de ventas por planta:");
                    promedioRow.CreateCell(1).SetCellValue((double)promedioPorPlanta);
                    promedioRow.GetCell(0).CellStyle = summaryStyle;
                    promedioRow.GetCell(1).CellStyle = totalStyle;
                    // CORRECCIÓN: Crear celda adicional
                    promedioRow.CreateCell(2); // Crear celda adicional
                                               // Combinar columnas 1 y 2 para el valor
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 1, 2));
                }

                // ================= DISTRIBUCIÓN POR PLANTA =================
                rowIndex += 2;

                IRow distribucionTitleRow = sheet.CreateRow(rowIndex++);
                distribucionTitleRow.CreateCell(0).SetCellValue("DISTRIBUCIÓN POR PLANTA");
                distribucionTitleRow.GetCell(0).CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 2));

                if (!string.IsNullOrEmpty(tablaHTML) && totalGeneral > 0)
                {
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        var rows = Regex.Matches(tbodyMatch.Groups[1].Value, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        int plantaIndex = 1;
                        foreach (Match row in rows)
                        {
                            var cells = Regex.Matches(row.Groups[1].Value, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (cells.Count >= 3)
                            {
                                string plantaNombre = Regex.Replace(cells[1].Groups[1].Value, @"<[^>]*>", "");
                                plantaNombre = System.Web.HttpUtility.HtmlDecode(plantaNombre).Trim();

                                string valorStr = Regex.Replace(cells[2].Groups[1].Value, @"<[^>]*>", "");
                                valorStr = System.Web.HttpUtility.HtmlDecode(valorStr).Trim();

                                string cleanValue = valorStr.Replace("$", "").Replace(",", "").Replace("MXN", "").Trim();

                                if (decimal.TryParse(cleanValue, out decimal valorPlanta))
                                {
                                    decimal porcentaje = (valorPlanta / totalGeneral) * 100;

                                    IRow distribucionRow = sheet.CreateRow(rowIndex++);

                                    // Número de planta
                                    distribucionRow.CreateCell(0).SetCellValue($"{plantaIndex}.");
                                    distribucionRow.GetCell(0).CellStyle = summaryStyle;
                                    distribucionRow.GetCell(0).CellStyle.Alignment = HorizontalAlignment.Center;

                                    // Nombre de planta
                                    distribucionRow.CreateCell(1).SetCellValue(plantaNombre);
                                    distribucionRow.GetCell(1).CellStyle = summaryStyle;

                                    // Porcentaje
                                    distribucionRow.CreateCell(2).SetCellValue($"{porcentaje:F2}%");
                                    distribucionRow.GetCell(2).CellStyle = summaryStyle;
                                    distribucionRow.GetCell(2).CellStyle.Alignment = HorizontalAlignment.Right;

                                    plantaIndex++;
                                }
                            }
                        }
                    }
                }

                // ================= AJUSTES FINALES =================
                // Ajustar automáticamente el ancho de las columnas
                for (int i = 0; i < 3; i++)
                {
                    sheet.AutoSizeColumn(i);
                }

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
                    $"VentasPorPlanta_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx"
                );
            }
            catch (Exception ex)
            {
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult GenerarReporteDeduccionesExcel(string tablaHTML)
        {
            try
            {
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Deducciones");

                // ================= CONFIGURACIÓN DE IMPRESIÓN =================
                sheet.PrintSetup.Landscape = false;
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);

                // Configurar anchos de columna
                sheet.SetColumnWidth(0, 10 * 256);   // ID
                sheet.SetColumnWidth(1, 20 * 256);   // Tipo Gasto
                sheet.SetColumnWidth(2, 40 * 256);   // Descripción
                sheet.SetColumnWidth(3, 20 * 256);   // Encargado
                sheet.SetColumnWidth(4, 15 * 256);   // Monto
                sheet.SetColumnWidth(5, 15 * 256);   // Fecha

                int rowIndex = 0;

                // ================= ESTILOS =================

                // Empresa/Encabezado
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontName = "Calibri";
                headerFont.FontHeightInPoints = 16;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.DarkBlue.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.Alignment = HorizontalAlignment.Center;

                // Título reporte
                ICellStyle titleStyle = workbook.CreateCellStyle();
                IFont titleFont = workbook.CreateFont();
                titleFont.FontName = "Calibri";
                titleFont.FontHeightInPoints = 12;
                titleFont.IsBold = true;
                titleFont.Color = IndexedColors.Black.Index;
                titleStyle.SetFont(titleFont);
                titleStyle.Alignment = HorizontalAlignment.Center;

                // Información
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.Black.Index;
                infoStyle.SetFont(infoFont);

                // ENCABEZADOS TABLA - CORREGIDO: FONDO NEGRO, LETRAS BLANCAS
                ICellStyle tableHeaderStyle = workbook.CreateCellStyle();
                IFont tableHeaderFont = workbook.CreateFont();
                tableHeaderFont.FontHeightInPoints = 10;
                tableHeaderFont.IsBold = true;
                tableHeaderFont.Color = IndexedColors.White.Index; // Letras blancas
                tableHeaderStyle.SetFont(tableHeaderFont);
                tableHeaderStyle.FillForegroundColor = IndexedColors.Black.Index; // Fondo negro
                tableHeaderStyle.FillPattern = FillPattern.SolidForeground;
                tableHeaderStyle.Alignment = HorizontalAlignment.Center;
                tableHeaderStyle.BorderTop = BorderStyle.Thin;
                tableHeaderStyle.BorderBottom = BorderStyle.Thin;
                tableHeaderStyle.BorderLeft = BorderStyle.Thin;
                tableHeaderStyle.BorderRight = BorderStyle.Thin;

                // Datos
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true;

                // ID (centrado)
                ICellStyle idStyle = workbook.CreateCellStyle();
                idStyle.CloneStyleFrom(dataStyle);
                idStyle.Alignment = HorizontalAlignment.Center;

                // Texto normal
                ICellStyle textStyle = workbook.CreateCellStyle();
                textStyle.CloneStyleFrom(dataStyle);
                textStyle.Alignment = HorizontalAlignment.Left;

                // Monto (moneda)
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Fecha
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;
                dateStyle.DataFormat = workbook.CreateDataFormat().GetFormat("dd/MM/yyyy");

                // Total general
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.IsBold = true;
                totalFont.FontHeightInPoints = 11;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.Green.Index;
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
                summaryFont.IsBold = true;
                summaryFont.Color = IndexedColors.Black.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.FillForegroundColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;

                // ================= CONTENIDO =================

                // Fila 0: Encabezado
                IRow headerRow = sheet.CreateRow(rowIndex++);
                headerRow.CreateCell(0).SetCellValue("REPORTE DE DEDUCCIONES");
                headerRow.GetCell(0).CellStyle = headerStyle;
                sheet.AddMergedRegion(new CellRangeAddress(0, 0, 0, 5));

                // Fila 1: Información del reporte
                IRow fechaRow = sheet.CreateRow(rowIndex++);
                fechaRow.CreateCell(0).SetCellValue($"Fecha de Generación: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                fechaRow.GetCell(0).CellStyle = infoStyle;
                sheet.AddMergedRegion(new CellRangeAddress(1, 1, 0, 5));

                rowIndex++; // Fila 2: Espacio

                // Fila 3: Encabezados de la tabla (ESTÁTICO - NEGRO CON LETRAS BLANCAS)
                IRow tableHeaderRow = sheet.CreateRow(rowIndex++);

                // Definir encabezados estáticos
                string[] headers = {
            "ID",
            "TIPO GASTO",
            "DESCRIPCIÓN",
            "ENCARGADO",
            "MONTO",
            "FECHA"
        };

                for (int i = 0; i < headers.Length; i++)
                {
                    ICell cell = tableHeaderRow.CreateCell(i);
                    cell.SetCellValue(headers[i]);
                    cell.CellStyle = tableHeaderStyle; // Aplicar estilo negro con letras blancas
                }

                // ================= DATOS =================
                int totalRegistros = 0;
                decimal totalGeneral = 0;

                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    // Extraer datos del HTML
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

                            if (cells.Count >= 6)
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                totalRegistros++;

                                for (int i = 0; i < 6; i++)
                                {
                                    string value = Regex.Replace(cells[i].Groups[1].Value, @"<[^>]*>", "");
                                    value = System.Web.HttpUtility.HtmlDecode(value).Trim();

                                    ICell cell = dataRow.CreateCell(i);

                                    // Aplicar estilos según la columna
                                    if (i == 0) // ID
                                    {
                                        cell.SetCellValue(value);
                                        cell.CellStyle = idStyle;
                                    }
                                    else if (i == 1 || i == 2 || i == 3) // Tipo Gasto, Descripción, Encargado
                                    {
                                        cell.SetCellValue(value);
                                        cell.CellStyle = textStyle;
                                    }
                                    else if (i == 4) // Monto
                                    {
                                        // Limpiar formato de moneda
                                        string cleanValue = value.Replace("$", "")
                                                                 .Replace(",", "")
                                                                 .Replace("MXN", "")
                                                                 .Trim();

                                        if (decimal.TryParse(cleanValue, out decimal monto))
                                        {
                                            cell.SetCellValue((double)monto);
                                            cell.CellStyle = currencyStyle;

                                            // Acumular total general
                                            totalGeneral += monto;
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                            cell.CellStyle = textStyle;
                                        }
                                    }
                                    else if (i == 5) // Fecha
                                    {
                                        // Intentar parsear la fecha
                                        if (DateTime.TryParseExact(value, "dd/MM/yyyy",
                                            CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fecha))
                                        {
                                            cell.SetCellValue(fecha);
                                            cell.CellStyle = dateStyle;
                                        }
                                        else
                                        {
                                            cell.SetCellValue(value);
                                            cell.CellStyle = textStyle;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // ================= TOTAL GENERAL =================
                if (totalRegistros > 0)
                {
                    rowIndex++;

                    IRow totalGeneralRow = sheet.CreateRow(rowIndex++);

                    // Combinar celdas para "TOTAL GENERAL:"
                    ICell totalTextCell = totalGeneralRow.CreateCell(0);
                    totalTextCell.SetCellValue("TOTAL GENERAL:");
                    totalTextCell.CellStyle = totalStyle;

                    // Combinar celdas 0-4
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                    // Celda con el valor total (columna 5)
                    ICell totalGeneralCell = totalGeneralRow.CreateCell(5);
                    totalGeneralCell.SetCellValue((double)totalGeneral);
                    totalGeneralCell.CellStyle = totalStyle;
                }

                // ================= RESUMEN ESTADÍSTICO =================
                rowIndex += 2;

                IRow resumenTitleRow = sheet.CreateRow(rowIndex++);
                resumenTitleRow.CreateCell(0).SetCellValue("RESUMEN ESTADÍSTICO");
                resumenTitleRow.GetCell(0).CellStyle = titleStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 5));

                // Total de registros
                IRow totalRegRow = sheet.CreateRow(rowIndex++);
                totalRegRow.CreateCell(0).SetCellValue($"Total de deducciones: {totalRegistros}");
                totalRegRow.GetCell(0).CellStyle = summaryStyle;
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 5));

                // Total general
                IRow totalGenRow = sheet.CreateRow(rowIndex++);
                totalGenRow.CreateCell(0).SetCellValue($"Total general:");
                totalGenRow.GetCell(0).CellStyle = summaryStyle;

                ICell totalValorCell = totalGenRow.CreateCell(1);
                totalValorCell.SetCellValue((double)totalGeneral);
                totalValorCell.CellStyle = currencyStyle;

                // Combinar celdas 1-5 para el valor
                sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 1, 5));

                // Promedio por deducción (si hay registros)
                if (totalRegistros > 0)
                {
                    decimal promedioPorDeduccion = totalGeneral / totalRegistros;

                    IRow promedioRow = sheet.CreateRow(rowIndex++);
                    promedioRow.CreateCell(0).SetCellValue($"Promedio por deducción:");
                    promedioRow.GetCell(0).CellStyle = summaryStyle;

                    ICell promedioValorCell = promedioRow.CreateCell(1);
                    promedioValorCell.SetCellValue((double)promedioPorDeduccion);
                    promedioValorCell.CellStyle = currencyStyle;

                    // Combinar celdas 1-5 para el valor
                    sheet.AddMergedRegion(new CellRangeAddress(rowIndex - 1, rowIndex - 1, 1, 5));
                }

                // ================= AJUSTES FINALES =================
                // Ajustar automáticamente el ancho de las columnas
                for (int i = 0; i < 6; i++)
                {
                    sheet.AutoSizeColumn(i);
                }

                // Congelar paneles (encabezados hasta la fila 3)
                //sheet.CreateFreezePane(0, 4, 0, 4);

                // ================= GUARDAR =================
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                // Nombre del archivo con fecha y hora
                string fileName = $"Reporte_Deducciones_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

                return File(
                    excelBytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    fileName
                );
            }
            catch (Exception ex)
            {
                // Log del error
                System.Diagnostics.Debug.WriteLine($"Error al generar Excel: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");

                return Json(new
                {
                    success = false,
                    message = $"Error al generar el archivo Excel: {ex.Message}"
                });
            }
        }
        #endregion
    }
}