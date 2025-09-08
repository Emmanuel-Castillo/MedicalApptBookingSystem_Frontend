import React from 'react'

type PaginatorProps = {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>
    pageSize: number;
    totalCount: number;
}
function Paginator({page, setPage, pageSize, totalCount}: PaginatorProps) {
  return (
    <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <button
            className="btn btn-outline-primary"
            disabled={page * pageSize >= totalCount}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
  )
}

export default Paginator