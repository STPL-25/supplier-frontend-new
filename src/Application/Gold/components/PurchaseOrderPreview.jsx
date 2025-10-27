import React from "react";
import {
  Eye,
  Download,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Hash,
  Package,
  Weight,
  Coins,
} from "lucide-react";

const formatAddress = (parts) => {
  return parts.filter((part) => part && part.trim()).join(", ");
};

const calculateTotals = (datas) => {
  const totals = {
    totalPieces: 0,
    totalGrossWeight: 0,
    totalNetWeight: 0,
    totalAmount: 0,
    totalDiamondWeight: 0,
    totalStoneWeight: 0,
    totalGoldWeight: 0,
    totalPlatinumWeight: 0,
    totalPureWeight: 0,
  };

  datas.forEach((data) => {
    totals.totalPieces += parseFloat(data.pieces) || 0;
    totals.totalGrossWeight += parseFloat(data.gross_weight) || 0;
    totals.totalNetWeight += parseFloat(data.net_weight) || 0;
    totals.totalAmount += parseFloat(data.amount) || 0;
    totals.totalDiamondWeight += parseFloat(data.diamondwt) || 0;
    totals.totalStoneWeight += parseFloat(data.stone_weight) || 0;
    totals.totalGoldWeight += parseFloat(data.goldwt) || 0;
    totals.totalPlatinumWeight += parseFloat(data.platinumWt) || 0;

    if (data.productWeightage !== "Pcs" && data.pure_wt) {
      totals.totalPureWeight += parseFloat(data.pure_wt) || 0;
    }
  });

  return totals;
};

const PurchaseOrderPreview = ({ datas, supplierDetails }) => {
  console.log(supplierDetails)
    console.log(datas)

  const totals = calculateTotals(datas);
  const isTct = supplierDetails?.poDetails?.poNumber?.includes("TCT");
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8" />
            <div>
              <h6 className="text-2xl font-bold">
                {isTct ? "Job Order" : "Purchase Order"} Preview
              </h6>
              <p className="text-blue-100">Document Preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* From and To Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50">
        {/* From Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="bg-blue-600 text-white p-2 rounded-t-lg -m-4 mb-4">
            <h3 className="font-semibold flex items-center">
              <User className="w-4 h-4 mr-2" />
              From
            </h3>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-lg">
              {supplierDetails.from?.name || "Company Name"}
            </p>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-sm text-gray-700">
                {formatAddress([
                  supplierDetails.from?.doorNo,
                  supplierDetails.from?.streetName,
                  supplierDetails.from?.city,
                  supplierDetails.from?.pincode,
                ]) || "Company Address"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-700">
                {supplierDetails.from?.phone || "Phone Number"}
              </p>
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">GST:</span>{" "}
              {supplierDetails.from?.gstNo || "GST Number"}
            </p>
          </div>
        </div>

        {/* To Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="bg-green-600 text-white p-2 rounded-t-lg -m-4 mb-4">
            <h3 className="font-semibold flex items-center">
              <User className="w-4 h-4 mr-2" />
              To
            </h3>
          </div>
          <div className="space-y-2">
            <p className="font-medium">
              Supplier Name:{" "}
              <span className="font-normal">
                {supplierDetails.supplier?.name || "Supplier Name"}
              </span>
            </p>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <p className="text-sm text-gray-700">
                {formatAddress([
                  supplierDetails.supplier?.doorNo,
                  supplierDetails.supplier?.streetName,
                  supplierDetails.supplier?.city,
                  supplierDetails.supplier?.pincode,
                ]) || "Supplier Address"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <p className="text-sm text-gray-700">
                {supplierDetails.supplier?.phone || "Phone Number"}
              </p>
            </div>
            <p className="text-sm text-gray-700">
              <span className="font-medium">GST:</span>{" "}
              {supplierDetails.supplier?.gstNo || "GST Number"}
            </p>
          </div>
        </div>
      </div>

      {/* Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* PO Details */}
      </div>

      {/* Product Details Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="bg-gray-800 text-white p-3">
            <h3 className="font-semibold flex items-center">
              <Package className="w-4 h-4 mr-2" />
              Product Details
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pieces
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Wt
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Wt
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pure Wt
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Melting %
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wastage %
                  </th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                </tr>
              </thead>
              {datas?.length > 0 &&
                datas.map((data,index) => (
                  <tbody className="bg-white divide-y divide-gray-200"key={data.sno}>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 text-sm text-gray-900">{index+1}</td>
                      <td className="p-3 text-sm text-gray-900">
                        { data.product_name || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.productType || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.pieces || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.gross_weight || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.net_weight || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.pure_wt || "-"}
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.melting || "-"}%
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.wastage || "-"}%
                      </td>
                      <td className="p-3 text-sm text-gray-900">
                        {data.product_image ? (
                          <img
                            src={data.product_image}
                            alt="Product"
                            className="w-12 h-12 object-cover rounded border"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <div
                          className="w-12 h-12 bg-gray-200 rounded border flex items-center justify-center text-xs text-gray-500"
                          style={{
                            display: data.product_image ? "none" : "flex",
                          }}
                        >
                          No Image
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="p-6 bg-gray-50">
        <div className="bg-white rounded-lg border shadow-sm">
          <div className="bg-indigo-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold flex items-center">
              <Coins className="w-4 h-4 mr-2" />
              Summary
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {totals.totalPieces}
                </p>
                <p className="text-sm text-gray-600">Total Pieces</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {totals.totalGrossWeight}g
                </p>
                <p className="text-sm text-gray-600">Gross Weight</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {totals.totalNetWeight}g
                </p>
                <p className="text-sm text-gray-600">Net Weight</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {totals.totalPureWeight ? `${totals.totalPureWeight}g` : "-"}
                </p>
                <p className="text-sm text-gray-600">Pure Weight</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderPreview;
