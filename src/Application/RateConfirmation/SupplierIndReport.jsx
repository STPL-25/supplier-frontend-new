import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Tooltip,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import { RateContext } from "./Context/Ratecontext";
import { API } from "../../config/configData";

function SupplierIndReport() {
  const [datas, setDatas] = useState([]);
  const { mobileNo } = useContext(RateContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // console.log(API);
  useEffect(() => {
    fetchData();
  }, [mobileNo]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/supreport/${mobileNo}`);
      setDatas(response.data);
    } catch (error) {
      // console.error("Error fetching data:", error);
    }
  };

  const renderGoldRate = (supplier) => {
    const rateMap = {
      "9999 Rate": `9999 Rate - ${supplier.pure999Rate}`,
      "999 Rate": `999 Rate - ${supplier.PureRate}`,
      "995 Rate": `995 Rate - ${supplier.cRate}`,
    };
    return rateMap[supplier.goldData] || "N/A";
  };

  // Desktop Table View
  const DesktopView = () => (
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: 3,
        borderRadius: 2,
        border: "1px solid #e0e0e0",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            {[
              "S No",
              "Bill No",
              "Fixed Gold Rate (in INR)",
              "Total Qty (Pure-Grams)",
              "Status",
              "Status Date",
              "Actions",
            ].map((header) => (
              <TableCell
                key={header}
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "#34495e",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {datas.length > 0 &&
            datas.map((supplier, index) => (
              <TableRow
                key={supplier.Billno + index}
                hover
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#f8f9fa",
                  },
                }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{supplier.Billno}</TableCell>
                <TableCell align="center">
                  {supplier.pure999Rate || supplier.PureRate || supplier.cRate}
                </TableCell>
                <TableCell align="center">{supplier.tQty}</TableCell>
                <TableCell align="center">
                  <Chip
                    icon={
                      supplier.approvedstatus === "accepted" ? (
                        <CheckCircleIcon />
                      ) : (
                        <CancelIcon />
                      )
                    }
                    label={supplier.approvedstatus.toUpperCase()}
                    color={
                      supplier.approvedstatus === "accepted"
                        ? "success"
                        : "error"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">{supplier.StatusDate}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Image">
                    <a
                      href={supplier.approvedImages}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#3498db",
                        cursor: "pointer",
                      }}
                    >
                      <VisibilityIcon />
                    </a>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Mobile Card View
  const MobileView = () => (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {datas.map((supplier, index) => (
        <Card
          key={supplier.Billno + index}
          variant="outlined"
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            transition: "transform 0.2s",
            "&:hover": {
              transform: "scale(1.02)",
            },
          }}
        >
          <CardContent>
            <Stack spacing={1.5}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Bill No: {supplier.Billno}
                </Typography>
                <Chip
                  icon={
                    supplier.approvedstatus === "accepted" ? (
                      <CheckCircleIcon />
                    ) : (
                      <CancelIcon />
                    )
                  }
                  label={supplier.approvedstatus.toUpperCase()}
                  color={
                    supplier.approvedstatus === "accepted" ? "success" : "error"
                  }
                  size="small"
                />
              </Box>

              <Typography variant="body2">
                <strong>Gold Rate:</strong> {renderGoldRate(supplier)}
              </Typography>

              <Typography variant="body2">
                <strong>Total Qty (Pure-Grams):</strong> {supplier.tQty}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Status Date: {supplier.StatusDate}
                </Typography>

                <Tooltip title="View Image">
                  <a
                    href={supplier.approvedImages}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#3498db",
                      cursor: "pointer",
                    }}
                  >
                    <VisibilityIcon fontSize="small" />
                  </a>
                </Tooltip>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#f9f9f9",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 3,
        }}
      >
        Supplier Individual Report
      </Typography>

      {datas.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <Typography variant="subtitle1" color="textSecondary">
            No supplier reports available
          </Typography>
        </Box>
      ) : // Conditional rendering based on screen size
      isMobile ? (
        <MobileView />
      ) : (
        <DesktopView />
      )}
    </Box>
  );
}

export default SupplierIndReport;
