
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DashBoardContext } from '../DashBoardContext/DashBoardContext';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon 
} from 'lucide-react';

function Admin() {
    const [adminBoardDatas, setAdminBoardDatas] = useState([])
    const { LOGG_API } = useContext(DashBoardContext)
    const [filterValues, setFilterValues] = useState("")
    const [userType, setUserType] = useState({ sno: "", userType: "" })
    const [count, setCount] = useState({ pending: 0, approved: 0, rejected: 0 })
    const [userRole, setUserRole] = useState([])

    useEffect(() => {
        fetchFilterDatas()
    }, [filterValues])

    const fetchFilterDatas = async () => {
        try {
            const response = await axios.put(`${LOGG_API}/consolidativelist`, { filterValues });
            setAdminBoardDatas(response.data);
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        const fetchRoleNames = async () => {
            const response = await axios.get(`${LOGG_API}/userrole`)
            console.log(response.data);
            setUserRole(response.data)
        }
        fetchRoleNames()
    }, [])

    useEffect(() => {
        fetchCountData()
    }, [])

    const fetchCountData = async () => {
        const response = await axios.get(`${LOGG_API}/getCount`);
        const data = response.data;
        setCount({
            pending: data.pending || 0,
            approved: data.approved || 0,
            rejected: data.rejected || 0
        });
    }

    const handleFetchDatas = async (values) => {
        setFilterValues(values)
    };

    const handleUserTypeChange = (sno, value) => {
        setUserType({ sno: sno, userType: value })
    };

    const handleAccept = async (sno) => {
        try {
            if (userType.sno == sno) {
                const response = await axios.put(`${LOGG_API}/pending/action`, userType);
                if (response.status === 200) {
                    fetchFilterDatas()
                    fetchCountData()
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleReject = async (sno) => {
        try {
            const response = await axios.put(`${LOGG_API}/pending/reject`, { sno });
            if (response.status === 200) {
                fetchFilterDatas()
                fetchCountData()
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div 
                    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => handleFetchDatas("Pending Lists")}
                >
                    <div className="flex items-center justify-center mb-2 text-yellow-500">
                        <ClockIcon size={40} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Pending Requests</h3>
                    <p className="text-2xl font-bold text-yellow-500">{count.pending}</p>
                </div>
                <div 
                    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => handleFetchDatas("Approved Lists")}
                >
                    <div className="flex items-center justify-center mb-2 text-green-500">
                        <CheckCircleIcon size={40} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Approved Requests</h3>
                    <p className="text-2xl font-bold text-green-500">{count.approved}</p>
                </div>
                <div 
                    className="bg-white shadow-md rounded-lg p-6 text-center cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => handleFetchDatas("Rejected Lists")}
                >
                    <div className="flex items-center justify-center mb-2 text-red-500">
                        <XCircleIcon size={40} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700">Rejected Requests</h3>
                    <p className="text-2xl font-bold text-red-500">{count.rejected}</p>
                </div>
            </div>

            {adminBoardDatas.length !== 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                    <h1 className="text-center text-2xl font-bold text-gray-800 py-4">{filterValues}</h1>
                    <div className="w-full overflow-x-scroll">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {adminBoardDatas.map(item => (
                                    <tr key={item.Sno} className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-4 py-3 whitespace-nowrap">{item.Name}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{item.MobileNo}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {item.signUpCatagory === "Supplier" ? item.companyName : "SPACE TEXTILES"}
                                        </td>
                                        {filterValues === "Pending Lists" ? (
                                            <td className="px-4 py-3">
                                                <select
                                                    onChange={(e) => handleUserTypeChange(item.Sno, e.target.value)}
                                                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                                                >
                                                    <option value="">Select one</option>
                                                    {console.log(userRole)}
                                                    {userRole
                                                        ?.filter(role => {
                                                            if (item.signUpCatagory === "Supplier") {
                                                                return role.RoleName.includes("Supplier");
                                                            } else {
                                                                return !role.RoleName.includes("Supplier");
                                                            }
                                                        })
                                                        .map((data, index) => (
                                                            <option key={data.RoleName + index} value={data.RoleName}>
                                                                {data.RoleName}
                                                            </option>
                                                        )) || []}
                                                </select>
                                            </td>
                                        ) : (
                                            <td className="px-4 py-3 whitespace-nowrap">{item.userRole}</td>
                                        )}

                                        {filterValues === "Pending Lists" ? (
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleAccept(item.Sno)}
                                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(item.Sno)}
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {item.Status === "A" ? "Accepted" : item.Status === "D" ? "Rejected" : null}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center mt-12">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center">
                        <p className="font-bold text-lg">No Data Found</p>
                        <p className="text-sm">Please select a different filter or try again later.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;