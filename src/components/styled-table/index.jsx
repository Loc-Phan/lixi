import { Table } from "antd";
import "./styles.css"

const StyledTable = ({ dataSource, columns, onChange, pagination }) => (
  <Table dataSource={dataSource} columns={columns} onChange={onChange} pagination={pagination} />
);

export default StyledTable;
