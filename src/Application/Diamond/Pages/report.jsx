import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {DIA_API} from "../../../config/configData";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Card, Typography } from "@material-tailwind/react";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'; // Import the DesktopDatePicker
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; // Import LocalizationProvider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; // Import an adapter for dayjs or another date library

function SupplierReport1() {
  const {userRole, user} = useContext(DashBoardContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterData, setFilterData] = useState('Pending');
  const [supplierNames, setSupplierNames] = useState("");
  const [invNo, setInvNo] = useState('');
  const [queryOptions, setQueryOptions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchOptionData = async () => {
      if (userRole === "Diamond-Supplier") {
        setSupplierNames(user);
      }
      const response = await axios.get(`${DIA_API}/gettingoptiondata`);
      const { supplierNames } = response.data;
      setQueryOptions(supplierNames);
    };
    fetchOptionData();
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
        try {
            const res = await axios.put(`${DIA_API}/submittedData`,{supplierNames,filterData});
            setRows(res.data);
            // console.log(res.data)
        } catch (error) {
            // console.log(error)
        }
     
    };
    fetchDetails();
  }, [supplierNames, filterData]);

  const [rows, setRows] = useState([]);
  const TABLE_HEAD = [/* ... your table header data ... */];

  const handleSupplierChange = (event) => {
    if (userRole === "Diamond-Purchase") {
      setSupplierNames(event.target.innerText);
    }
  };

  return (
    <div className="supplierreport">
      <div style={{ marginTop: "50px" }}>
        {userRole === "Diamond-Purchase" ? (
          <Autocomplete
            disablePortal
            id="filter-autocomplete"
            options={queryOptions}
            onChange={handleSupplierChange}
            sx={{ width: 200 }}
            renderInput={(params) => <TextField {...params} label="Search By Supplier" />}
            style={{ margin: "auto", marginTop: "20px", marginBottom: "20px" }}
          />
        ) : null}

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={["Accepted", "Rejected", "Pending"]}
          defaultValue="Pending"
          onChange={(event, value) => setFilterData(value)}
          sx={{ width: 200 }}
          renderInput={(params) => <TextField {...params} label="Filter By" />}
          style={{ margin: "auto", marginTop: "20px", marginBottom: "20px" }}
        />

        {/* Wrapping date pickers in LocalizationProvider */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="MM/DD/YYYY"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="MM/DD/YYYY"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>

      {rows.length > 0 ? (
        <Card className="h-full w-full">
          <h3 className="heading">
            <b>SUPPLIER REPORT</b>
          </h3>
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th key={head.key} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                    <Typography variant="h1" color="blue-gray" className="font-bold leading-none opacity-70">
                      {head.label}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((data, index) => {
                const isLast = index === rows.length - 1;
                const classes = isLast ? "p-4 border-b border-blue-200" : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={data.RefNo + index}>
                    {TABLE_HEAD.map((col) => (
                      <td key={col.key} className={classes}>
                        <Typography variant="h1" color="blue-gray" className="font-bold">
                          {col.key === "index" ? index + 1 : data[col.key] ?? "NA"}
                        </Typography>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      ) : (
        <div className="center-data flex items-center justify-center">
          <p>
            <span className="bg-red-100 rounded-lg p-5 text-sm text-red-700 font-medium" role="alert">
              No Data Found
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default SupplierReport1;
