using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.IO;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace MinaToMVC.Controllers
{
    [AllowAnonymous]
    public class ExcelController : Controller
    {
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
    }
}