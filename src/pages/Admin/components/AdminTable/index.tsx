import React from "react";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";

type AdminTableProps<T> = {
  columns: ColumnsType<T>;
  data: T[];
  rowKey?: string;
  loading?: boolean;
  pageSize?: number;
  scrollX?: number;
  onChange?: TableProps<T>["onChange"]; // 👈 Thêm để bắt sự kiện sort
};

function AdminTable<T extends object>({
  columns,
  data,
  rowKey = "id",
  loading = false,
  pageSize = 10,
  scrollX,
  onChange,
}: AdminTableProps<T>) {
  return (
    <Table<T>
      rowKey={rowKey}
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize }}
      scroll={scrollX ? { x: scrollX } : undefined}
      onChange={onChange} // 👈 Kích hoạt sort
    />
  );
}

export default AdminTable;
