import { useEffect, useId, useMemo, useState } from 'react';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  type Row,
  getFilteredRowModel,
} from '@tanstack/react-table';

import {
  useSensor,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  KeyboardSensor,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { useDebounce } from 'use-debounce';

export function DraggableRow<T extends { id: number }>(props: { row: Row<T> }) {
  const { row } = props;
  const {
    isDragging,
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
  } = useSortable({
    id: row.original.id,
  });

  return (
    <tr
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      data-dragging={isDragging}
      data-state={row.getIsSelected() && 'selected'}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 border-b last:border-b-0"
    >
      {row.getVisibleCells().map(cell => (
        <td key={cell.id} className="text-center">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
}

export default function App() {
  const sortableId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const [data, setData] = useState([
    {
      id: 1,
      firstName: 'Gwen',
      lastName: 'Tennyson',
      age: 25,
      visits: 1,
      progress: 25,
      priority: 1,
    },
    {
      id: 2,
      firstName: 'Kevin',
      lastName: 'Eleven',
      age: 27,
      visits: 2,
      progress: 30,
      priority: 2,
    },
    {
      id: 3,
      firstName: 'Ben',
      lastName: 'Tennyson',
      age: 27,
      visits: 2,
      progress: 30,
      priority: 3,
    },
  ]);

  const [name, setName] = useState('');
  const [debouncedName] = useDebounce(name, 300);

  useEffect(() => {
    table.getColumn('name')?.setFilterValue(debouncedName);
  }, [debouncedName]);

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data.map(({ id }) => id),
    [data],
  );

  const table = useReactTable({
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnVisibility: { name: false } },
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
      {
        id: 'name',
        accessorFn: row => `${row.firstName} ${row.lastName}`,
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
      {
        header: 'Priority',
        accessorKey: 'priority',
        cell: info => info.getValue(),
      },
    ],
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const from = data.find(d => d.id === active.id);
    const to = data.find(d => d.id === over?.id);

    if (!active || !over || !from || !to || active.id === over.id) return;

    if (to.priority < from.priority) {
      return setData(data => {
        const sorted = data
          .sort((a, b) => a.priority - b.priority)
          .map(d => {
            if (
              d.priority !== from.priority &&
              d.priority >= to.priority &&
              d.priority !== data.length
            ) {
              return { ...d, priority: d.priority + 1 };
            }

            return d;
          })
          .map(d => {
            if (d.id === from.id) {
              return { ...d, priority: to.priority };
            }

            return d;
          })
          .sort((a, b) => a.priority - b.priority);

        console.log(sorted);
        return sorted;
      });
    }

    return setData(data => {
      const sorted = data
        .sort((a, b) => a.priority - b.priority)
        .map(d => {
          if (
            d.priority !== from.priority &&
            d.priority <= to.priority &&
            d.priority > 1
          ) {
            return { ...d, priority: d.priority - 1 };
          }

          return d;
        })
        .map(d => {
          if (d.id === from.id) {
            return { ...d, priority: to.priority };
          }

          return d;
        })
        .sort((a, b) => a.priority - b.priority);

      console.log(sorted);
      return sorted;
    });
  }

  return (
    <main className="min-h-screen content-center justify-items-center space-y-2">
      <section className="w-2/3 grid">
        <input
          type="text"
          placeholder="Name"
          className="border px-2 py-1 rounded"
          onChange={e => {
            setName(e.target.value);
          }}
        />
      </section>
      <DndContext
        id={sortableId}
        sensors={sensors}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
      >
        <section className="w-2/3 border rounded grid">
          <table>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map(header => (
                    <th key={header.id} className="p-1">
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
              <SortableContext
                items={dataIds}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.map(row => (
                  <DraggableRow key={row.id} row={row} />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </section>
      </DndContext>
    </main>
  );
}
