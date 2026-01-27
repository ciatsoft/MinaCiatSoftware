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
                // 1. Crear workbook
                IWorkbook workbook = new XSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Prefacturas");

                // ========== CONFIGURACIÓN DE IMPRESIÓN ==========
                // Configurar margenes
                sheet.PrintSetup.Landscape = false; // Vertical
                sheet.PrintSetup.PaperSize = (short)PaperSize.A4;
                sheet.SetMargin(MarginType.TopMargin, 0.5);      // 0.5 pulgadas
                sheet.SetMargin(MarginType.BottomMargin, 0.5);
                sheet.SetMargin(MarginType.LeftMargin, 0.4);
                sheet.SetMargin(MarginType.RightMargin, 0.4);
                sheet.SetMargin(MarginType.HeaderMargin, 0.3);
                sheet.SetMargin(MarginType.FooterMargin, 0.3);

                // Configurar para repetir filas de encabezado en cada página
                IPrintSetup printSetup = sheet.PrintSetup;
                printSetup.FitWidth = (short)1;
                printSetup.FitHeight = (short)0; // Ajustar a 1 página de alto

                // Configurar tamaño de columnas (en unidades de 1/256 de carácter)
                sheet.SetColumnWidth(0, 12 * 256);   // Folio: 12 caracteres
                sheet.SetColumnWidth(1, 18 * 256);   // Fecha: 18 caracteres
                sheet.SetColumnWidth(2, 25 * 256);   // Cliente: 25 caracteres
                sheet.SetColumnWidth(3, 20 * 256);   // Material: 20 caracteres
                sheet.SetColumnWidth(4, 15 * 256);   // Importe: 15 caracteres

                int rowIndex = 0;

                // ========== ESTILOS ==========
                // Estilo título empresa
                ICellStyle companyStyle = workbook.CreateCellStyle();
                IFont companyFont = workbook.CreateFont();
                companyFont.FontName = "Calibri";
                companyFont.FontHeightInPoints = 18;
                companyFont.IsBold = true;
                companyFont.Color = IndexedColors.LightBlue.Index;
                companyStyle.SetFont(companyFont);
                companyStyle.Alignment = HorizontalAlignment.Center;
                companyStyle.VerticalAlignment = VerticalAlignment.Center;

                // Estilo título reporte
                ICellStyle reportTitleStyle = workbook.CreateCellStyle();
                IFont reportTitleFont = workbook.CreateFont();
                reportTitleFont.FontName = "Calibri";
                reportTitleFont.FontHeightInPoints = 14;
                reportTitleFont.IsBold = true;
                reportTitleFont.Color = titulo.Contains("NO FACTURADOS") ?
                    IndexedColors.Red.Index : IndexedColors.DarkGreen.Index;
                reportTitleStyle.SetFont(reportTitleFont);
                reportTitleStyle.Alignment = HorizontalAlignment.Center;
                reportTitleStyle.VerticalAlignment = VerticalAlignment.Center;

                // Estilo información del reporte
                ICellStyle infoStyle = workbook.CreateCellStyle();
                IFont infoFont = workbook.CreateFont();
                infoFont.FontName = "Calibri";
                infoFont.FontHeightInPoints = 10;
                infoFont.Color = IndexedColors.DarkBlue.Index;
                infoStyle.SetFont(infoFont);
                infoStyle.Alignment = HorizontalAlignment.Center;
                infoStyle.VerticalAlignment = VerticalAlignment.Center;

                // Estilo encabezados de tabla
                ICellStyle headerStyle = workbook.CreateCellStyle();
                IFont headerFont = workbook.CreateFont();
                headerFont.FontName = "Calibri";
                headerFont.FontHeightInPoints = 10;
                headerFont.IsBold = true;
                headerFont.Color = IndexedColors.White.Index;
                headerStyle.SetFont(headerFont);
                headerStyle.FillForegroundColor = IndexedColors.LightBlue.Index;
                headerStyle.FillPattern = FillPattern.SolidForeground;
                headerStyle.Alignment = HorizontalAlignment.Center;
                headerStyle.VerticalAlignment = VerticalAlignment.Center;
                headerStyle.BorderTop = BorderStyle.Thin;
                headerStyle.BorderBottom = BorderStyle.Thin;
                headerStyle.BorderLeft = BorderStyle.Thin;
                headerStyle.BorderRight = BorderStyle.Thin;
                headerStyle.TopBorderColor = IndexedColors.Black.Index;
                headerStyle.BottomBorderColor = IndexedColors.Black.Index;
                headerStyle.LeftBorderColor = IndexedColors.Black.Index;
                headerStyle.RightBorderColor = IndexedColors.Black.Index;

                // Estilo para datos normales
                ICellStyle dataStyle = workbook.CreateCellStyle();
                dataStyle.BorderTop = BorderStyle.Thin;
                dataStyle.BorderBottom = BorderStyle.Thin;
                dataStyle.BorderLeft = BorderStyle.Thin;
                dataStyle.BorderRight = BorderStyle.Thin;
                dataStyle.TopBorderColor = IndexedColors.Grey40Percent.Index;
                dataStyle.BottomBorderColor = IndexedColors.Grey40Percent.Index;
                dataStyle.LeftBorderColor = IndexedColors.Grey40Percent.Index;
                dataStyle.RightBorderColor = IndexedColors.Grey40Percent.Index;
                dataStyle.VerticalAlignment = VerticalAlignment.Center;
                dataStyle.WrapText = true; // Ajustar texto

                // Estilo para datos de fecha (centrado)
                ICellStyle dateStyle = workbook.CreateCellStyle();
                dateStyle.CloneStyleFrom(dataStyle);
                dateStyle.Alignment = HorizontalAlignment.Center;

                // Estilo para importe (derecha, formato moneda)
                ICellStyle currencyStyle = workbook.CreateCellStyle();
                currencyStyle.CloneStyleFrom(dataStyle);
                currencyStyle.Alignment = HorizontalAlignment.Right;
                currencyStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Estilo para total
                ICellStyle totalStyle = workbook.CreateCellStyle();
                IFont totalFont = workbook.CreateFont();
                totalFont.FontName = "Calibri";
                totalFont.FontHeightInPoints = 11;
                totalFont.IsBold = true;
                totalFont.Color = IndexedColors.White.Index;
                totalStyle.SetFont(totalFont);
                totalStyle.FillForegroundColor = IndexedColors.DarkGreen.Index;
                totalStyle.FillPattern = FillPattern.SolidForeground;
                totalStyle.BorderTop = BorderStyle.Medium;
                totalStyle.BorderBottom = BorderStyle.Medium;
                totalStyle.TopBorderColor = IndexedColors.Black.Index;
                totalStyle.BottomBorderColor = IndexedColors.Black.Index;
                totalStyle.Alignment = HorizontalAlignment.Right;
                totalStyle.DataFormat = workbook.CreateDataFormat().GetFormat("$#,##0.00");

                // Estilo para resumen
                ICellStyle summaryStyle = workbook.CreateCellStyle();
                IFont summaryFont = workbook.CreateFont();
                summaryFont.FontName = "Calibri";
                summaryFont.FontHeightInPoints = 10;
                summaryFont.Color = IndexedColors.DarkBlue.Index;
                summaryStyle.SetFont(summaryFont);
                summaryStyle.BorderTop = BorderStyle.Thin;
                summaryStyle.BorderBottom = BorderStyle.Thin;
                summaryStyle.BorderLeft = BorderStyle.Thin;
                summaryStyle.BorderRight = BorderStyle.Thin;
                summaryStyle.TopBorderColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.BottomBorderColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.LeftBorderColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.RightBorderColor = IndexedColors.Grey25Percent.Index;
                summaryStyle.FillForegroundColor = IndexedColors.PaleBlue.Index;
                summaryStyle.FillPattern = FillPattern.SolidForeground;

                // ========== CONTENIDO DEL REPORTE ==========
                // 1. TÍTULO EMPRESA
                IRow companyRow = sheet.CreateRow(rowIndex++);
                companyRow.HeightInPoints = 25;
                ICell companyCell = companyRow.CreateCell(0);
                companyCell.SetCellValue("MINA SAN MIGUEL");
                companyCell.CellStyle = companyStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(0, 0, 0, 4));

                // 2. TÍTULO REPORTE
                IRow reportRow = sheet.CreateRow(rowIndex++);
                reportRow.HeightInPoints = 20;
                ICell reportCell = reportRow.CreateCell(0);
                reportCell.SetCellValue($"REPORTE DE PREFACTURAS - {titulo}");
                reportCell.CellStyle = reportTitleStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(1, 1, 0, 4));

                // 3. INFORMACIÓN DEL PERÍODO
                IRow periodRow = sheet.CreateRow(rowIndex++);
                periodRow.HeightInPoints = 18;
                ICell periodCell = periodRow.CreateCell(0);
                periodCell.SetCellValue($"PERÍODO: {fechaInicio} al {fechaFin}");
                periodCell.CellStyle = infoStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(2, 2, 0, 4));

                // 4. FECHA DE GENERACIÓN
                IRow genDateRow = sheet.CreateRow(rowIndex++);
                genDateRow.HeightInPoints = 18;
                ICell genDateCell = genDateRow.CreateCell(0);
                genDateCell.SetCellValue($"Generado: {DateTime.Now:dd/MM/yyyy HH:mm:ss}");
                genDateCell.CellStyle = infoStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(3, 3, 0, 4));

                // Espacio
                rowIndex += 2;

                // 5. ENCABEZADOS DE TABLA
                IRow headerRow = sheet.CreateRow(rowIndex++);
                headerRow.HeightInPoints = 20;

                string[] headers = { "FOLIO", "FECHA DE TRANSPORTE", "CLIENTE", "MATERIAL", "IMPORTE" };

                for (int i = 0; i < headers.Length; i++)
                {
                    ICell cell = headerRow.CreateCell(i);
                    cell.SetCellValue(headers[i]);
                    cell.CellStyle = headerStyle;
                }

                // 6. PROCESAR DATOS DE LA TABLA HTML (CORREGIDO)
                int totalRegistros = 0;
                if (!string.IsNullOrEmpty(tablaHTML))
                {
                    // Extraer solo el contenido del tbody
                    var tbodyMatch = Regex.Match(tablaHTML, @"<tbody[^>]*>(.*?)</tbody>",
                        RegexOptions.Singleline | RegexOptions.IgnoreCase);

                    if (tbodyMatch.Success)
                    {
                        string tbodyContent = tbodyMatch.Groups[1].Value;

                        // Extraer todas las filas <tr>
                        var rowMatches = Regex.Matches(tbodyContent, @"<tr[^>]*>(.*?)</tr>",
                            RegexOptions.Singleline | RegexOptions.IgnoreCase);

                        foreach (Match rowMatch in rowMatches)
                        {
                            string rowContent = rowMatch.Groups[1].Value;

                            // Extraer todas las celdas <td>
                            var cellMatches = Regex.Matches(rowContent, @"<td[^>]*>(.*?)</td>",
                                RegexOptions.Singleline | RegexOptions.IgnoreCase);

                            if (cellMatches.Count >= 5) // Asegurar que tenemos 5 columnas
                            {
                                IRow dataRow = sheet.CreateRow(rowIndex++);
                                dataRow.HeightInPoints = 18;
                                totalRegistros++;

                                // Procesar cada celda en el ORDEN CORRECTO
                                for (int i = 0; i < 5; i++)
                                {
                                    string cellValue = cellMatches[i].Groups[1].Value;

                                    // Limpiar HTML y decodificar
                                    cellValue = Regex.Replace(cellValue, @"<[^>]*>", string.Empty);
                                    cellValue = System.Web.HttpUtility.HtmlDecode(cellValue);
                                    cellValue = cellValue.Trim();

                                    ICell cell = dataRow.CreateCell(i);
                                    cell.SetCellValue(cellValue);

                                    // Aplicar estilos según columna
                                    switch (i)
                                    {
                                        case 0: // Folio
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Center;
                                            break;
                                        case 1: // Fecha
                                            cell.CellStyle = dateStyle;
                                            break;
                                        case 2: // Cliente
                                        case 3: // Material
                                            cell.CellStyle = dataStyle;
                                            cell.CellStyle.Alignment = HorizontalAlignment.Left;
                                            break;
                                        case 4: // Importe
                                            // Intentar parsear como número para formato moneda
                                            if (decimal.TryParse(cellValue, out decimal importe))
                                            {
                                                cell.SetCellValue((double)importe);
                                                cell.CellStyle = currencyStyle;
                                            }
                                            else
                                            {
                                                cell.CellStyle = currencyStyle;
                                            }
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }

                // 7. FILA DE TOTAL
                rowIndex++;
                IRow totalRowSheet = sheet.CreateRow(rowIndex++);
                totalRowSheet.HeightInPoints = 22;

                // Celda vacía para las primeras 3 columnas
                for (int i = 0; i < 3; i++)
                {
                    totalRowSheet.CreateCell(i).SetCellValue("");
                }

                // Celda "TOTAL:"
                ICell totalLabelCell = totalRowSheet.CreateCell(3);
                totalLabelCell.SetCellValue("TOTAL:");
                totalLabelCell.CellStyle = totalStyle;

                // Celda con valor total
                ICell totalValueCell = totalRowSheet.CreateCell(4);
                if (decimal.TryParse(total, out decimal totalDecimal))
                {
                    totalValueCell.SetCellValue((double)totalDecimal);
                }
                else
                {
                    totalValueCell.SetCellValue(total);
                }
                totalValueCell.CellStyle = totalStyle;

                // 8. RESUMEN ESTADÍSTICO
                rowIndex += 2;

                // Título del resumen
                IRow summaryTitleRow = sheet.CreateRow(rowIndex++);
                summaryTitleRow.HeightInPoints = 20;
                ICell summaryTitleCell = summaryTitleRow.CreateCell(0);
                summaryTitleCell.SetCellValue("RESUMEN DEL REPORTE");
                summaryTitleCell.CellStyle = summaryStyle;
                sheet.AddMergedRegion(new NPOI.SS.Util.CellRangeAddress(rowIndex - 1, rowIndex - 1, 0, 4));

                // Puntos del resumen
                IRow summaryRow1 = sheet.CreateRow(rowIndex++);
                summaryRow1.HeightInPoints = 18;
                summaryRow1.CreateCell(0).SetCellValue($"• Total de registros: {totalRegistros}");
                summaryRow1.CreateCell(2).SetCellValue($"• Período: {fechaInicio} - {fechaFin}");

                IRow summaryRow2 = sheet.CreateRow(rowIndex++);
                summaryRow2.HeightInPoints = 18;
                summaryRow2.CreateCell(0).SetCellValue($"• Estado: {titulo}");
                summaryRow2.CreateCell(2).SetCellValue($"• Fecha de generación: {DateTime.Now:dd/MM/yyyy}");

                // Aplicar estilo de resumen a todas las celdas
                for (int r = summaryTitleRow.RowNum; r <= summaryRow2.RowNum; r++)
                {
                    IRow row = sheet.GetRow(r);
                    if (row != null)
                    {
                        for (int c = 0; c < 5; c++)
                        {
                            ICell cell = row.GetCell(c);
                            if (cell != null)
                            {
                                cell.CellStyle = summaryStyle;
                            }
                        }
                    }
                }

                // 9. CONFIGURAR ÁREA DE IMPRESIÓN
                IPrintSetup printSetup2 = sheet.PrintSetup;
                printSetup2.PaperSize = (short)PaperSize.A4;

                // Establecer área de impresión (desde fila 0 hasta la última)
                workbook.SetPrintArea(0, 0, 4, 0, rowIndex - 1);

                // Configurar encabezados y pies de página
                IHeader header = sheet.Header;
                header.Center = "MINA SAN MIGUEL - Reporte de Prefacturas";

                IFooter footer = sheet.Footer;
                footer.Center = $"Página {HeaderFooter.Page} de {HeaderFooter.NumPages}";
                footer.Right = $"Generado: {DateTime.Now:dd/MM/yyyy}";

                // ========== GUARDAR ARCHIVO ==========
                byte[] excelBytes;
                using (MemoryStream ms = new MemoryStream())
                {
                    workbook.Write(ms);
                    excelBytes = ms.ToArray();
                }

                workbook.Close();

                string nombreArchivo = $"Prefacturas_{titulo.Replace(" ", "_")}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
                return File(excelBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", nombreArchivo);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"ERROR Excel: {ex.Message}\n{ex.StackTrace}");
                return Content($"Error al generar Excel: {ex.Message}");
            }
        }
    }
}