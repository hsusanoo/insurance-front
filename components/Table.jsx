import Router from 'next/router'
import React from 'react'
import { usePagination, useTable } from 'react-table'

const Table = ({ columns, data, rowClickEnabled, rowClickBasePath }) => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }
    },
    usePagination
  )

  return (
    <>
      <table {...getTableProps()} className={'min-w-full divide-y divide-gray-200'}>
        <thead className={'bg-gray-50'}>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}
                  className={'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'}>
                {column.render('Header')}</th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()} className={'bg-white divide-y divide-gray-200'}>
        {page.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} className={`hover:bg-blue-50 ${rowClickEnabled && 'cursor-pointer'}`}
                {...(rowClickEnabled ? {
                  onClick: () => {
                    console.log({ row, rowClickBasePath })
                    Router.push(`${rowClickBasePath}/${row.original.id}`)
                  }
                } : {})}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()} className="px-6 py-4 whitespace-nowrap">{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
      <div className={'p-3 flex justify-between'}>
        <div className={'mr-10'}>
          <button
            className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'}
            onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>
          {' '}
          <button
            className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'}
            onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>
          {' '}
          <button
            className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'}
            onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>
          {' '}
          <button
            className={'bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline'}
            onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>
          {' '}
          <span>
          Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        </div>
        <div className={'flex flex-nowrap'}>
        <div className={'flex flex-nowrap mr-8'}>
          <label className={'mr-2'} htmlFor="pagenum">Go to page:</label>
          <input
            className={'appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-1 px-2 leading-tight focus:outline-none focus:bg-white'}
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </div>{' '}
          <div className="relative">
            <select
              className={'block w-28 appearance-none bg-gray-200 border border-gray-200 text-gray-700 py-1 px-2 pr-2 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500'}
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Table
