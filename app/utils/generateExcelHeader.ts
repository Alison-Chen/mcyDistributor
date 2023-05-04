const DEFAULT_COLUMN_WIDTH = 20

// 根据 antd 的 column 生成 exceljs 的 column
export function generateHeaders(columns: any[]) {
  return columns?.map((col) => {
    const obj: ITableHeader = {
      // 显示的 name
      header: col.title,
      // 用于数据匹配的 key
      key: col.dataIndex,
      // 列宽
      width: col.width / 5 || DEFAULT_COLUMN_WIDTH,
    }
    return obj
  })
}
