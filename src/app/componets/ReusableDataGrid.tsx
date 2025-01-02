import React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {localizedTextsMap} from '../utils/localizedTextMap'

interface ReusableDataGridProps {
  columns: GridColDef[];
  rows: any[];
}

const ReusableDataGrid: React.FC<ReusableDataGridProps> = ({ columns, rows}) => {
  return (
      <DataGrid
        rows={rows}
        columns={columns}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        getRowId={(row) => row.code || row.id} 
        localeText={localizedTextsMap}
      />
  );
};

export default ReusableDataGrid;
