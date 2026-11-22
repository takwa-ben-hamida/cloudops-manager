
import React from 'react';

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  getRowKey: (row: T) => React.Key;
  emptyMessage?: string;
}

export default function Table<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = 'Aucune donnée disponible.',
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b bg-gray-50 text-sm text-gray-700">
            {columns.map((column, index) => (
              <th key={index} className="p-3">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b text-gray-900"
              >
                {columns.map((column, index) => (
                  <td key={index} className="p-3">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
