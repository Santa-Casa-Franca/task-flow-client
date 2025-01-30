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
        disableRowSelectionOnClick
        getRowId={(row) => row.code + row.entryDate || row.id} 
        localeText={localizedTextsMap}
      />
  );
};

export default ReusableDataGrid;
