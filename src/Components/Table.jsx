import React from 'react';
import { Table } from 'react-bootstrap';

function CustomTable({ columns, data }) {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, columnIndex) => (
              <td key={columnIndex}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default CustomTable;
