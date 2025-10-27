import DynamicTable from "../PurchaseOrder/CustomComponent/DynamicTables";
import { Sales_Report_Config } from "./Sales_Report_Config";
import axios from "axios";
import { useState, useEffect } from "react";
import { API } from "../../config/configData";

function FundPlanning() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFundPlanningDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API}/summary_report/daily-fund-transfer-summary`);
        console.log('API Response:', response.data);
        
        // Handle different response structures
        const responseData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        
        setData(responseData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchFundPlanningDetails();
  }, []);

  const handleDataChange = (updatedData) => {
    console.log('Data changed:', updatedData);
    setData(updatedData);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <div className=" mx-auto">
      <DynamicTable
        fields={Sales_Report_Config}
        initialData={data}
        title="Daily Fund Transfer Summary"
        onDataChange={handleDataChange}
      />
    </div>
  );
}

export default FundPlanning;
