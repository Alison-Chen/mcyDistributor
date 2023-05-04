import { saveAs } from "file-saver"
import { Workbook } from "exceljs"

export function saveWorkbook(workbook: Workbook, fileName: string) {
  void workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: "" })
    saveAs(blob, fileName)
  })
}
