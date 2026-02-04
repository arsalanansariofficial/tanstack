import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

export type Person = {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
};

export default function App() {
  const table = useReactTable({
    columns: [
      {
        header: 'First Name',
        accessorKey: 'firstName',
        cell: info => info.getValue(),
      },
      {
        header: 'Last Name',
        accessorKey: 'lastName',
        cell: info => info.getValue(),
      },
      { header: 'Age', accessorKey: 'age', cell: info => info.getValue() },
      {
        header: 'Visits',
        accessorKey: 'visits',
        cell: info => info.getValue(),
      },
      {
        header: 'Progress',
        accessorKey: 'progress',
        cell: info => info.getValue(),
      },
    ],
    data: [
      {
        firstName: 'Gwen',
        lastName: 'Tennyson',
        age: 25,
        visits: 1,
        progress: 25,
      },
      {
        firstName: 'Kevin',
        lastName: 'Eleven',
        age: 27,
        visits: 2,
        progress: 30,
      },
      {
        firstName: 'Ben',
        lastName: 'Tennyson',
        age: 27,
        visits: 2,
        progress: 30,
      },
    ],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <main className="min-h-screen content-center justify-items-center">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="p-1 border">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getAllCells().map(cell => (
                <td key={cell.id} className="p-1 border text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
