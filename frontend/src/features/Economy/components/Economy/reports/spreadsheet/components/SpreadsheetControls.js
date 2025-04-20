import React from 'react';
import { Button, Tooltip, Space } from 'antd';
import { 
  SaveOutlined, 
  PrinterOutlined, 
  FileExcelOutlined,
  ReloadOutlined,
  LoadingOutlined
} from '@ant-design/icons';

/**
 * Controls component for the financial spreadsheet
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onPrint - Print handler
 * @param {Function} props.onExport - Export handler
 * @param {Function} props.onReload - Reload handler
 * @param {boolean} props.saving - Flag indicating save in progress
 * @param {boolean} props.exporting - Flag indicating export in progress
 * @param {boolean} props.printing - Flag indicating print in progress
 * @param {boolean} props.loading - Flag indicating data loading in progress
 * @returns {JSX.Element} SpreadsheetControls component
 */
const SpreadsheetControls = ({
  onSave,
  onPrint,
  onExport,
  onReload,
  saving = false,
  exporting = false,
  printing = false,
  loading = false
}) => {
  return (
    <div className="spreadsheet-controls">
      <Space>
        <Tooltip title="Save changes">
          <Button
            type="primary"
            icon={saving ? <LoadingOutlined /> : <SaveOutlined />}
            onClick={onSave}
            disabled={saving || loading}
          >
            Save
          </Button>
        </Tooltip>
        
        <Tooltip title="Export to Excel">
          <Button
            icon={exporting ? <LoadingOutlined /> : <FileExcelOutlined />}
            onClick={onExport}
            disabled={exporting || loading}
          >
            Export
          </Button>
        </Tooltip>
        
        <Tooltip title="Print spreadsheet">
          <Button
            icon={printing ? <LoadingOutlined /> : <PrinterOutlined />}
            onClick={onPrint}
            disabled={printing || loading}
          >
            Print
          </Button>
        </Tooltip>
        
        <Tooltip title="Reload data">
          <Button
            icon={loading ? <LoadingOutlined /> : <ReloadOutlined />}
            onClick={onReload}
            disabled={loading}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default SpreadsheetControls; 