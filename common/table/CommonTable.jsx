import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import * as React from "react";
import { useEffect } from "react";
import { GripVertical } from "lucide-react";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const tableSort = (array, comparator) => {
  if (!Array.isArray(array)) return [];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

function CommonTableNew(props) {
  const {
    dataResult = [],
    setDataResult, // need to pass only if we want enable SelectAll checkbox functionality
    removeHeaders, // send array of headers which need to remove. NOTE: send at least one header i.e. id
    tableClass, // required css for tableContainer i.e. height, etc.
    renderActions, // render Actions @1st column i.e. icons, checkboxes, etc.
    highlightRow, // default row highlighted, if not want to highlight set as false.
    customRowBgColor, // useful when required another bg color of selected row than default.
    rowBackgroundColor, // use this to show conditional row bg color.
    handleSelectedRow, // get row onclick use this fn.
    editableColumns, // array of headers to make column editable
    renderInput, // actual content to render i.e. input, dropdown, checkbox, icon, etc
    enableSelectAll, // to enable select all checkbox functionality
    darkMode = false, // add support for modern dark theme admin panels
    emptyMessage = "No records found",
    enableReorder = false, // enable drag-and-drop row reordering
    onReorder, // callback with reordered rows array
    reorderHeaderLabel = "SEQUENCE",
    renderStatus, // dedicated Active / Inactive column renderer
    statusHeaderLabel = "ACTIVE / INACTIVE",
  } = props;

  const [rowIndex, setRowIndex] = React.useState(-1);
  const [order, setOrder] = React.useState("asc");
  const [upAndDownKey, setUpANdDownKey] = React.useState(true);
  const [orderBy, setOrderBy] = React.useState();
  const [draggedIndex, setDraggedIndex] = React.useState(null);
  const [dragOverIndex, setDragOverIndex] = React.useState(null);

  const handleDragStart = (e, index) => {
    if (!enableReorder) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  };

  const handleDragOver = (e, index) => {
    if (!enableReorder) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    if (!enableReorder) return;
    e.preventDefault();
    if (
      draggedIndex === null ||
      draggedIndex === undefined ||
      draggedIndex === dropIndex
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const currentList = orderBy
      ? tableSort(safeData, getComparator(order, orderBy))
      : safeData;
    const reordered = [...currentList];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    setOrderBy(undefined);

    if (onReorder) {
      onReorder(reordered);
    }
    if (setDataResult) {
      setDataResult(reordered);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const createSortHandler = (property) => (event) => {
    handleSortRequest(event, property);
  };

  const handleSortRequest = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const removeHeader = (headers, fieldToRemove) => {
    if (!fieldToRemove || !Array.isArray(fieldToRemove)) return headers;
    return headers.filter((v) => !fieldToRemove.includes(v));
  };

  const safeData = Array.isArray(dataResult) ? dataResult : [];
  const allHeaders = safeData.length > 0 && safeData[0] ? Object.keys(safeData[0]) : [];
  const headers = removeHeaders
    ? removeHeader(allHeaders, removeHeaders)
    : allHeaders;

  const handleSelectAll = () => {
    if (!setDataResult || safeData.length === 0) return;
    const allChecked = safeData.every((row) => row.isChecked);

    const updatedDataResult = safeData.map((row) => ({
      ...row,
      isChecked: !allChecked,
    }));

    setDataResult(updatedDataResult);
  };

  const handleRowSelect = (index) => {
    if (!setDataResult || !safeData[index]) return;
    const updatedDataResult = [...safeData];
    updatedDataResult[index] = {
      ...updatedDataResult[index],
      isChecked: !updatedDataResult[index].isChecked,
    };

    setDataResult(updatedDataResult);
  };

  const handleKeyDown = (event) => {
    if (
      (highlightRow === undefined || highlightRow === true) &&
      rowIndex >= 0 &&
      upAndDownKey === true
    ) {
      if (event.key === "ArrowUp" && rowIndex > 0) {
        setRowIndex(rowIndex - 1);
      } else if (
        event.key === "ArrowDown" &&
        rowIndex < safeData.length - 1
      ) {
        setRowIndex(rowIndex + 1);
      }
    }
  };

  React.useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest(".MuiTableContainer-root")) {
        setUpANdDownKey(false);
      } else {
        setUpANdDownKey(true);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [rowIndex, upAndDownKey]);

  useEffect(() => {
    if (rowIndex !== -1) {
      setRowIndex(-1);
    }
  }, [dataResult]);

  return (
    <div
      className={`w-full overflow-x-auto rounded-2xl ${
        darkMode
          ? "border border-white/[0.08] bg-[#09152b]/70 shadow-[0_12px_36px_rgba(0,0,0,0.3)]"
          : "grid w-auto border rounded my-2"
      }`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <Box sx={{ width: "100%", overflow: "visible" }}>
        <TableContainer
          sx={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
              width: 0,
              height: 0,
            },
          }}
          className={tableClass}
        >
          <Table
            size="small"
            stickyHeader
            aria-label="responsive sticky table"
            sx={{
              minWidth: { xs: 600, sm: "100%" },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    paddingY: 1.25,
                    paddingX: 2,
                    backgroundColor: darkMode ? "#0d1f3d" : "#F1F1F1",
                    color: darkMode ? "#00C4FF" : "#4b5563",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: darkMode
                      ? "1px solid rgba(255,255,255,0.08)"
                      : "1px solid #e5e7eb",
                  },
                }}
              >
     {renderActions && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 110,
                      minWidth: 110,
                      padding: "10px 10px",
                      borderBottom: darkMode
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      className={
                        darkMode
                          ? "text-[#00C4FF] font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                          : "text-gray-600 font-semibold whitespace-nowrap text-xs"
                      }
                    >
                      Actions
                    </span>
                  </TableCell>
                )}
                {enableReorder && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 110,
                      minWidth: 110,
                      padding: "10px 8px",
                      borderBottom: darkMode
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      className={
                        darkMode
                          ? "text-[#00C4FF] font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                          : "text-gray-600 font-semibold whitespace-nowrap text-xs"
                      }
                      title="Drag to change display sequence"
                    >
                      {reorderHeaderLabel || "SEQUENCE"}
                    </span>
                  </TableCell>
                )}

                {renderStatus && (
                  <TableCell
                    align="center"
                    sx={{
                      width: 160,
                      minWidth: 160,
                      padding: "10px 10px",
                      borderBottom: darkMode
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      className={
                        darkMode
                          ? "text-[#00C4FF] font-bold uppercase tracking-wider text-xs whitespace-nowrap"
                          : "text-gray-600 font-semibold whitespace-nowrap text-xs"
                      }
                    >
                      Status
                    </span>
                  </TableCell>
                )}
             

                {enableSelectAll && (
                  <TableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={safeData.length > 0 && safeData.every((row) => row.isChecked)}
                      onChange={handleSelectAll}
                      sx={{
                        color: darkMode ? "rgba(255,255,255,0.4)" : undefined,
                        "&.Mui-checked": {
                          color: "#00C4FF",
                        },
                      }}
                    />
                  </TableCell>
                )}
              
                {headers.map((header, index) => {
                  return (
                    <TableCell
                      key={header || index}
                      sortDirection={orderBy === header ? order : false}
                      className="whitespace-nowrap"
                    >
                      <TableSortLabel
                        active={orderBy === header}
                        direction={orderBy === header ? order : "asc"}
                        onClick={createSortHandler(header)}
                        sx={{
                          color: darkMode ? "#00C4FF !important" : undefined,
                          "& .MuiTableSortLabel-icon": {
                            color: darkMode ? "#00C4FF !important" : undefined,
                          },
                        }}
                      >
                        <span
                          className={
                            darkMode
                              ? "text-white/90 text-xs font-bold"
                              : "text-gray-600 text-xs font-semibold"
                          }
                        >
                          {header}
                        </span>
                        {orderBy === header ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {safeData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      headers.length +
                      (renderActions ? 1 : 0) +
                      (renderStatus ? 1 : 0) +
                      (enableSelectAll ? 1 : 0) +
                      (enableReorder ? 1 : 0)
                    }
                    align="center"
                    sx={{
                      py: 8,
                      color: darkMode ? "rgba(255,255,255,0.4)" : "#6b7280",
                      fontSize: "13px",
                      borderBottom: "none",
                    }}
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                (enableReorder && !orderBy
                  ? safeData
                  : tableSort(safeData, getComparator(order, orderBy))
                ).map((row, index) => {
                  const isSelected =
                    (highlightRow === undefined || highlightRow === true) &&
                    rowIndex === index;

                  return (
                    <TableRow
                      key={row.id || index}
                      hover={false}
                      draggable={enableReorder}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      style={{
                        backgroundColor: isSelected
                          ? customRowBgColor || (darkMode ? "rgba(37,99,235,0.2)" : "#FFC44B")
                          : rowBackgroundColor
                          ? rowBackgroundColor(row, index)
                          : darkMode
                          ? index % 2 === 0
                            ? "rgba(255,255,255,0.015)"
                            : "transparent"
                          : "",
                      }}
                      sx={{
                        transition: "background-color 0.15s ease, opacity 0.15s ease",
                        opacity: draggedIndex === index ? 0.35 : 1,
                        borderTop:
                          dragOverIndex === index && draggedIndex !== index
                            ? "2px solid #00C4FF !important"
                            : undefined,
                        boxShadow:
                          dragOverIndex === index && draggedIndex !== index
                            ? "inset 0 2px 0 0 #00C4FF, 0 -4px 10px rgba(0,196,255,0.35)"
                            : undefined,
                        "&:hover": {
                          backgroundColor: darkMode
                            ? "rgba(255,255,255,0.04) !important"
                            : "#f9fafb",
                        },
                        "& td": {
                          paddingY: 1,
                          paddingX: 2,
                          borderColor: darkMode
                            ? "rgba(255,255,255,0.06)"
                            : "#f3f4f6",
                          color: darkMode ? "rgba(255,255,255,0.85)" : "#374151",
                          fontSize: "13px",
                        },
                      }}
                      onClick={() => {
                        setRowIndex(index);
                        handleSelectedRow && handleSelectedRow(row, index);
                      }}
                    >

                         {renderActions && (
                        <TableCell
                          align="center"
                          className="whitespace-nowrap"
                          sx={{
                            width: 110,
                            minWidth: 110,
                            padding: "6px 10px",
                          }}
                        >
                          {renderActions(row, index)}
                        </TableCell>
                      )}
                      {enableReorder && (
                        <TableCell
                          align="center"
                          sx={{
                            width: 110,
                            minWidth: 110,
                            padding: "6px 8px",
                          }}
                        >
                          <div
                            className="inline-flex items-center justify-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-[#00C4FF]/40 text-white/70 hover:text-white transition-all select-none group cursor-grab active:cursor-grabbing"
                            title="Drag to change display sequence"
                          >
                         
                            <GripVertical size={14} className="text-white/40 group-hover:text-[#00C4FF] transition-colors" />
                          </div>
                        </TableCell>
                      )}

                      {renderStatus && (
                        <TableCell
                          align="center"
                          className="whitespace-nowrap"
                          sx={{
                            width: 160,
                            minWidth: 160,
                            padding: "6px 10px",
                          }}
                        >
                          {renderStatus(row, index)}
                        </TableCell>
                      )}

      
                   
                        {enableSelectAll && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              size="small"
                              checked={row.isChecked ? true : false}
                              onChange={() => handleRowSelect(index)}
                              sx={{
                                color: darkMode ? "rgba(255,255,255,0.4)" : undefined,
                                "&.Mui-checked": {
                                  color: "#00C4FF",
                                },
                              }}
                            />
                          </TableCell>
                        )}
                   
                        {headers &&
                          headers.map((header, i) => (
                            <TableCell
                              className="whitespace-nowrap"
                              key={i}
                            >
                              {editableColumns &&
                              editableColumns.includes(header)
                                ? renderInput(row, index, header)
                                : row[header] === true
                                ? "Yes"
                                : row[header] === false
                                ? "No"
                                : row[header]}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

export default React.memo(CommonTableNew);
