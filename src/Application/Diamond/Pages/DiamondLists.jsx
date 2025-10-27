
import { useContext, useEffect, useState } from "react";
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext";
import TextField from "@mui/material/TextField";
// import InputLabel from "@mui/material/InputLabel";
import { Card, Typography } from "@material-tailwind/react";
// import Button from "@mui/material/Button";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import { DIA_API } from "../../../config/configData";
// import { Vortex } from "../Components/ui/vortex";
import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import PDFExportButton from "./ExportToPdf"

function DiamondLists() {
  const [rows, setRows] = useState([]);
  // const [refNo,setRefNo]=useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [statusData, setStatusData] = useState([])
  console.log(XLSX)
  // const navigate = useNavigate();
  const { inputFields, setInputFields, metalTypeData, setMetalTypeData, user, setTotalDiamondData, totalDiamondData, diamondData, setDiamondData, setTotalClrstnData, setclrStn, errors, setErrors } =
    useContext(DiamondContext);
  const [invNo, setInvNo] = useState('')
  const [estimateNo, setEstimateNo] = useState("")
  const [refNo, setRefNo] = useState("")
  const [isRefNoActive, setIsRefNoActive] = useState(false)
  const [selectedItems, setSelectedItems] = useState([])
  const [invDate, setInvDate] = useState("")
  console.log(user)
  console.log(rows)
  const { renderContent, setActiveSection, activeSection,setActiveComponent } = useContext(DashBoardContext)

  const TABLE_HEAD = [
    // { id: '', label: 'Select', type: 'text' },
    { id: 'sno', label: 'S.No', type: 'number' },
    { id: 'SupplierName', label: 'Supplier Name', type: 'text' },
    // { id: 'EstNo', label: 'Estimate No', type: 'text' },
    { id: 'ProductName', label: 'Product Name', type: 'text' },
    { id: 'MetalType', label: 'Metal Type', type: 'text' },
    { id: 'WtMode', label: 'Weight Mode', type: 'text' },
    { id: 'DesignNo', label: 'Design No', type: 'text' },
    { id: 'GCarat', label: 'Gold Karat', type: 'text' },
    { id: 'PCS', label: 'PCS', type: 'number' },
    { id: 'GoldWt', label: 'Gold Weight', type: 'number' },
    { id: 'GoldPurity', label: 'Gold Purity', type: 'text' },
    { id: 'GoldPurityWt', label: 'Gold Purity Weight', type: 'number' },
    { id: 'Gold999Rate', label: 'Gold 999 Rate', type: 'text' },
    { id: 'GoldValue', label: 'Gold Value', type: 'number' },
    { id: 'PTWt', label: 'Platinum Weight', type: 'number' },
    { id: 'PTPurity', label: 'Platinum Purity', type: 'text' },
    { id: 'PTPurityWt', label: 'Platinum Purity Weight', type: 'number' },
    { id: 'PT999Rate', label: 'Platinum 999 Rate', type: 'text' },
    { id: 'PTValue', label: 'Platinum Value', type: 'number' },
    // { 
    //   id: 'DiamondDatas', 
    //   label: 'Diamond Data', 
    //   type: 'component',
    //   render: (value, row) => <DiamondTable diamonds={row.Diamonds} />
    // },
    { id: 'NoofStone', label: 'Number of Stones', type: 'number' },
    { id: 'DCarat', label: 'Diamond Carat', type: 'number' },
    { id: 'DiamondWt', label: 'Diamond Weight', type: 'number' },
    { id: 'DiamondRate', label: 'Diamond Rate', type: 'text' },
    { id: 'DiamondValue', label: 'Diamond Value', type: 'number' },
    // { 
    //   id: 'ColorStoneDatas', 
    //   label: 'Color Stone Data', 
    //   type: 'component',
    //   render: (value, row) => <ColorStoneTable colorStones={row.ColorStones} />
    // },
    { id: 'ClrStnPCS', label: 'Color Stone PCS', type: 'number' },
    { id: 'CLSCarat', label: 'Color Stone Carat', type: 'number' },
    { id: 'ClrStnWt', label: 'Color Stone Weight', type: 'number' },
    { id: 'ClrStnRate', label: 'Color Stone Rate', type: 'text' },
    { id: 'CSAmount', label: 'Color Stone Amount', type: 'number' },
    { id: 'GoMcType', label: 'Gold Making Charge Type', type: 'text' },
    { id: 'GoMcRate', label: 'Gold Making Charge Rate', type: 'text' },
    { id: 'GoMcAmount', label: 'Gold Making Charge Amount', type: 'number' },
    { id: 'PTMcType', label: 'Platinum Making Charge Type', type: 'text' },
    { id: 'PTMcRate', label: 'Platinum Making Charge Rate', type: 'text' },
    { id: 'PTMcAmount', label: 'Platinum Making Charge Amount', type: 'number' },
    { id: 'WastageType', label: 'Wastage Type', type: 'text' },
    { id: 'WastageWeight', label: 'Wastage Weight', type: 'number' },
    { id: 'WastageAmt', label: 'Wastage Amount', type: 'number' },
    { id: 'CertType', label: 'Certificate Type', type: 'text' },
    { id: 'CertGST', label: 'Certificate GST', type: 'text' },
    { id: 'CertQty', label: 'Certificate Quantity', type: 'number' },
    { id: 'CertRate', label: 'Certificate Rate', type: 'text' },
    { id: 'CertTaxableAmt', label: 'Certificate Taxable Amount', type: 'number' },
    { id: 'CertTotal', label: 'Certificate Total', type: 'number' },
    { id: 'HallMarkType', label: 'Hallmark Type', type: 'text' },
    { id: 'HMGST', label: 'Hallmark GST', type: 'text' },
    { id: 'HMQty', label: 'Hallmark Quantity', type: 'number' },
    { id: 'HMRate', label: 'Hallmark Rate', type: 'text' },
    { id: 'HMTaxableAmt', label: 'Hallmark Taxable Amount', type: 'number' },
    { id: 'HMTotal', label: 'Hallmark Total', type: 'number' },
    { id: 'HandleRate', label: 'Handling Rate', type: 'text' },
    { id: 'HandleAmount', label: 'Handling Amount', type: 'number' },
    { id: 'GNetWt', label: 'Gold Net Weight', type: 'number' },
    { id: 'PNetWt', label: 'Platinum Net Weight', type: 'number' },
    { id: 'TotalValue', label: 'Total Value', type: 'number' },
    { id: 'GST', label: 'GST', type: 'number' },
    { id: 'GrandTotal', label: 'Grand Total', type: 'number' },
    { id: 'HUID', label: 'HUID', type: 'text' },
    // { id: 'AcceptReject', label: 'Accept/Reject', type: 'text' },
  ];
  const totals = rows.reduce((acc, row) => {
    console.log(acc, row)
    TABLE_HEAD.forEach(col => {
      if (col.type === 'number' && col.id !== 'sno') {
        acc[col.id] = (acc[col.id] || 0) + (Number(row[col.id]) || 0);
      }
    });
    return acc;
  }, {});
  useEffect(() => {
    let refNo
    if (!isRefNoActive) {
      refNo = localStorage.getItem("EstNo");
    }
    if (refNo && !estimateNo) {
      fetchData(refNo);
      setRefNo(refNo)
      setEstimateNo(refNo)

      console.log(estimateNo)
    } else if (estimateNo) {
      fetchData(estimateNo);
    }
  }, [rows.length, estimateNo]);

  const fetchData = async (refNo) => {
    // const response = await axios.get(`${API}/getDashData/${refNo}`, 
    try {
      const response = await axios.get(`${DIA_API}/getDashData/${user}`);
      setRows(response.data);
      // toast.success("Data fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch data");
    }
  };
  // console.log(refNo)
  const handleDeleteRow = async (Id) => {
    try {
      const responseData = await axios.get(`${DIA_API}/delete/${Id}`);
      if (responseData.status === 200) {
        fetchData();
        toast.success("Data deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete data");
    }
  };
  // const handleEditRow = (index) => {
  //   const EditValue = rows.filter((_, i) => i === index);
  //   EditValue.forEach((data) => setInputFields(data));
  //   // navigate("/diamondField");
  //   EditValue.forEach((data)=>setTotalDiamondData(data.Diamonds))
  //   // redirect("/diamondField")
  //   // setActiveSection("Diamond Data Entry"); 
  // };
  const handleEditRow = (index) => {
    // 1. Select the specific row data by index
    const selectedRow = rows[index];
    console.log(selectedRow);

    // 2. Handle potential errors gracefully
    if (!selectedRow) {
      console.error("Invalid row index provided. Please check your input.");
      return; // Exit the function if no valid row is found
    }

    // 3. Extract diamond/color stone data with optional handling
    let mappedDiamondData, mappedClrstnData;
    try {
      if (Array.isArray(selectedRow.Diamonds)) {
        mappedDiamondData = selectedRow.Diamonds.map(diamond => ({
          diamondShape: diamond.Shape,
          numberOfStones: diamond.NoOfStones,
          carat: diamond.Carat,
          diaRate: diamond.Rate,
          diaValue: diamond.Value,
          diaWt: diamond.Weight
        }));
        setDiamondData(true); // Assuming this sets a diamond data flag

      }

      if (Array.isArray(selectedRow.ColorStones)) {
        mappedClrstnData = selectedRow.ColorStones.map(clrstn => ({
          csType: clrstn.Type,
          csPcs: clrstn.Pcs,
          csCarat: clrstn.csCarat,
          csRate: clrstn.csRate,
          csAmt: clrstn.Amount,
          csWt: clrstn.csWeight
        }));
        setclrStn(true)
      }
    } catch (error) {
      toast.error("Error processing diamond/color stone data")
      console.error("Error processing diamond/color stone data:", error);
      // Handle the error appropriately, e.g., display an error message to the user
      return; // Optionally, exit the function if the error is critical
    }

    // 4. Update state variables (assuming appropriate state management)
    setInputFields(selectedRow);
    setTotalDiamondData(mappedDiamondData);
    setTotalClrstnData(mappedClrstnData);
    setActiveComponent("Diamond Data Entry");
    setMetalTypeData(selectedRow.metalTypeData)
    setErrors({})
  };
  console.log(totalDiamondData, metalTypeData, inputFields)
  const handleSubmitData = async () => {
    try {


      const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
      // const response = await axios.get(`${API}/submitData/${user}/${encodeURIComponent(invNo)}`);
      if (invNo && dateRegex.test(invDate)) {
        const invoiceNumber = `${invNo}|${invDate}`

        const response = await axios.put(`${DIA_API}/submitData`, { user, invNo: invoiceNumber, selectedItems });

        // console.log(encodeURIComponent(invNo))
        if (response.status === 200) {
          console.log(response.data.message);
          toast.success("Data submitted successfully");
          setErrorMsg("")

          fetchData(); // Fetch data again after submission
          localStorage.removeItem("EstNo");
          localStorage.removeItem("sCode");
          navigate("/diamondField");
        }
      }

      else {
        if (!invNo) { setErrorMsg("Please Enter Invoice Number "); toast.error("Please Enter Invoice Number ") }
        else if (!invDate) { setErrorMsg("Please Enter Invoice Date "); toast.error("Please Enter Invoice Date") }
        else if (!dateRegex.test(invDate)) { setErrorMsg("Invalid Invoice Date "); toast.error("Invalid Invoice Date") }
        else {
          // setErrorMsg("Please Enter Invoice and Date ")
          toast.error("Submission failed. Please enter invoice number and Date");
        }


      }

    } catch (error) {
      console.log("please enter invoice number ")
    }
  };
  const handleInvChange = (event) => {
    setInvNo(event.target.value)
    setErrorMsg("")

    console.log(invNo)
  }
  const formatNumber = (value, columnId) => {
    // Columns requiring 3 decimal places
    const threeDecimalColumns = [
      'GoldWt', 'WastageWeight', 'GNetWt', 'PTWt', 'PNetWt', 
      'DCarat', 'DiamondWt', 'CLSCarat', 'ClrStnWt'
    ];

    // Columns requiring no decimal places (integers)
    const integerColumns = ['PCS', 'NoofStone', 'ClrStnPCS'];

    if (threeDecimalColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
      });
    }

    if (integerColumns.includes(columnId)) {
      return Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
    }

    // Default formatting for other number columns
    return Number(value).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const handleInvDateChange = (event) => {
    const input = event.target.value.replace(/\D/g, '');
    let formattedDate = '';

    // Apply formatting logic
    if (input.length <= 2) {
      formattedDate = input;
    } else if (input.length <= 4) {
      formattedDate = input.slice(0, 2) + '/' + input.slice(2);
    } else {
      formattedDate = input.slice(0, 2) + '/' + input.slice(2, 4) + '/' + input.slice(4, 8);
    }

    // Validate the formatted date
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
    if (formattedDate.length === 10 && !dateRegex.test(formattedDate)) {
      setErrorMsg('Invalid date format. Please use DD/MM/YYYY.');
      setInvDate(formattedDate);
      return;
    }

    // Check if the date is below today's date
    if (formattedDate.length === 10) {
      const [day, month, year] = formattedDate.split('/').map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of the day

      if (enteredDate >= today) {
        setErrorMsg('Date must be earlier than today.');
      } else {
        setErrorMsg('');
      }
    }

    setInvDate(formattedDate);
  };


  // const handleEstNoChange=()=>{
  //   setEstimateNo(event.target.value)
  //   setIsRefNoActive(true)
  //   console.log(isRefNoActive)

  // }


  const exportToExcel = async () => {
    try {
      // Make a PUT request to the backend with the data
      const response = await axios.put(`${DIA_API}/excel`, rows, {
        responseType: 'blob' // Ensure the response is treated as a binary blob
      });

      // Create a new Blob object using the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a link element
      const link = document.createElement('a');

      // Set the download attribute with a default file name
      link.href = URL.createObjectURL(blob);
      link.download = 'PackingLists.xlsx';

      // Append the link to the body (not displayed)
      document.body.appendChild(link);

      // Programmatically click the link to trigger the download
      link.click();

      // Remove the link from the document
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    }
  };


  const handleSelectItems = (id) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((ids) => ids !== id)
        : [...prevSelected, id]
    );
  };

  // const isChecked = (id) => {
  //   return selectedItems.includes(id);
  // };
  console.log(selectedItems)
  return (
    <div>
      <ToastContainer />
      <div className="dia-buttons m-6 flex flex-row gap-4 ">
        {/* Export to Excel Button */}


        {/* Invoice Number Input */}
        <div className="w-full max-w-xs">
          <input
            type="text"
            name="Invoice Number"
            value={invNo}
            onChange={handleInvChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter Invoice No"
          />
        </div>

        {/* Invoice Date Input */}
        <div className="w-full max-w-xs">
          <input
            type="text"
            name="Invoice Date"
            value={invDate}
            onChange={handleInvDateChange}
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter Invoice Date (DD/MM/YYYY)"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Export to Excel
          </button>
          <PDFExportButton data={rows} />
        </div>
        {/* Submit Button */}
        {rows.length > 0 && (
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSubmitData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        )}

        {/* <div className="flex-right">
        <button
          onClick={exportToExcel}
          className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 w-48"
        >
          Export to Excel
        </button>
        </div> */}

        {/* Error Message */}
        {/* {errorMsg && (
          <div className="acceptance-message w-full mt-4">
            <div className="bg-red-100 text-red-700 text-sm font-medium p-4 rounded-lg">
              {errorMsg}
            </div>
          </div>
        )} */}
      </div>






      <div className="diamond-list mt-20">

        {rows.length > 0 ? (

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">
                    Select
                  </th>
                  {TABLE_HEAD.map(column => (
                    <th key={column.id} className="border p-2 text-left wrap-text">
                      {column.label}
                    </th>
                  ))}

                  {/* <th className="border p-2 text-left">Actions</th> */}
                  <th className="border p-2 text-left">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(row.id)}
                        onChange={() => handleSelectItems(row.id)}
                      />
                    </td>
                    {TABLE_HEAD.map(column => (
                      <td key={column.id} className="border p-2">
                        {column.render ?
                          column.render(row[column.id], row) :
                          column.type === 'number' && column.id !== 'sno'
                            ? formatNumber(row[column.id], column.id)
                            : column.id === 'sno'
                              ? index + 1
                              : row[column.id]}
                      </td>
                    ))}
                    <td className="border p-2">
                      <div className="flex gap-2">
                        <button type="button" className="text-blue-500 bg-white hover:bg-blue-500 hover:text-white border border-blue-500 font-medium rounded-lg text-sm px-5 py-2 text-center me-2 mb-2 " onClick={() => handleEditRow(index)}>Edit</button>
                        <button type="button" className="text-red-500 bg-white hover:bg-red-500 hover:text-white border border-red-500  font-medium rounded-lg text-sm px-5 py-2 text-center me-2 mb-2" onClick={() => handleDeleteRow(row.id, index)}>Delete</button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td>

                  </td>
                  {TABLE_HEAD.map(column => (

                    <td key={column.id} className="border p-2 bold bg-gray-100">
                      {column.type === 'number' && column.id !== 'sno' ? (
                        <strong>
                          {formatNumber(totals[column.id], column.id)}
                        </strong>
                      ) : column.id === 'sno' ? (
                        <strong>Totals</strong>
                      ) : (
                        ''
                      )}
                    </td>



                  ))}
                  <td>

                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

        ) : (
          <div className="text-center py-10 bg-gray-100 rounded-lg">
            <p className="text-gray-600 text-xl">No Data Found</p>
          </div>
        )}

      </div>
    </div>

  );
}

export default DiamondLists;

