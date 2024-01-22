import { Table } from "antd";
import "./styles.css"

const StyledTable = ({ dataSource, columns }) => (
  <Table dataSource={dataSource} columns={columns} />
);

export default StyledTable;
