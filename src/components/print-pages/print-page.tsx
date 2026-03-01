import { fileUrlGenerator, isValidUrl } from "@/utils/helpers";
import { Header, Row } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import React from "react";
import { getHeaderNames } from "tanstack-table-export-to-csv";
import { Branches } from "@/types/shared";
import { getSetting } from "@/services/settings";
import { BRAND_NAME } from "@/config/config";

interface Props {
  headers: Header<any, any>[];
  rows: Row<any>[];
  branch: Branches;
  pageName: string;
}

const excludedColumns = ["SL", "Action"];

// Filter the headers to exclude specific columns
const getFilteredHeaders = (
  headers: Header<any, any>[]
): { name: string; index: number }[] => {
  const headerNames = getHeaderNames(headers);
  return headerNames
    .map((name, index) => ({ name, index }))
    .filter((header) => !excludedColumns.includes(header.name));
};

// Filter rows based on the filtered headers
const getFilteredRows = (
  rows: Row<any>[],
  filteredHeaders: { name: string; index: number }[]
): string[][] => {
  return rows.map((row) => {
    const cells = row.getAllCells();
    return filteredHeaders.map(
      (header) => cells[header.index].getValue() as string
    );
  });
};

// Extract branch details
const getBranch = (branch: Branches) => {
  return {
    name: branch.name,
    address: branch.address,
  };
};

export class PrintPageComponet extends React.Component<Props> {
  state = {
    filteredHeaders: getFilteredHeaders(this.props.headers),
    data: getFilteredRows(
      this.props.rows,
      getFilteredHeaders(this.props.headers)
    ),
    existingBranch: getBranch(this.props.branch),
    logoUrl: "",
  };

  // async componentDidMount() {
  //   const settings = await getSetting();
  //   this.setState({ logoUrl: fileUrlGenerator(settings.logo_image_url || "") });
  // }

  static getDerivedStateFromProps(nextProps: Props, prevState: any) {
    const filteredHeaders = getFilteredHeaders(nextProps.headers);
    const updatedBranch = getBranch(nextProps.branch);

    if (
      nextProps.rows !== prevState.rows ||
      nextProps.branch.name !== prevState.existingBranch.name
    ) {
      return {
        filteredHeaders,
        data: getFilteredRows(nextProps.rows, filteredHeaders),
        existingBranch: updatedBranch,
      };
    } else {
      return null;
    }
  }

  renderCell(cell: any) {
    if (isValidUrl(cell)) {
      return <img src={cell} width={50} height={50} />;
    }

    if (
      typeof cell === "object" &&
      cell instanceof Date &&
      !isNaN(cell.getTime())
    ) {
      return formatDate(cell, "dd/MM/yyyy");
    }

    if (typeof cell === "string") {
      const date = new Date(cell);
      if (!isNaN(date.getTime())) {
        return formatDate(date, "dd/MM/yyyy");
      }
    }

    return cell;
  }

  render() {
    const { filteredHeaders, data, existingBranch, logoUrl } = this.state;
    const { pageName } = this.props;

    return (
      <div className="w-screen mx-auto p-6 text-xs">
        {/* Header Section */}
        <div className="w-full border-b border-gray-700 p-2 flex items-center justify-between">
          <div className="w-1/5">
            <p className="w-full flex justify-start items-center text-3xl font-bold">
              {BRAND_NAME}
            </p>
          </div>
          <div className="w-2/5 text-start pl-4">
            <p>Bizpos</p>
            <p>{existingBranch.name}</p> {/* Branch Name */}
            <p>{existingBranch.address}</p> {/* Branch Address */}
          </div>
          <div className="w-2/5 text-end">
            <p className="text-xl font-semibold">{pageName}</p>
          </div>
        </div>

        {/* Table Section */}
        <table className="mt-4 rounded-lg w-full">
          <thead className="bg-primary text-primary-foreground">
            <tr>
              {filteredHeaders.map((header, index) => (
                <th key={index} className="p-2 text-start">
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr className="border-b border-gray-200" key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="p-2">
                    {this.renderCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
