const RenderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Selection
              </h3>
              <div className="space-y-2">
                <div className="relative">
                  <select
                    value={companyType}
                    onChange={handleCompanyTypeChange}
                    className="w-full p-3 border rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" disabled>
                        Select company type
                      </option>
                      {Object.entries(COMPANY_PRESETS).map(([key, preset]) => (
                        <option key={key} value={key} className="py-2">
                          {preset.name + " " + preset.subTitle}
                        </option>
                      ))}
                    </select>
                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {/* Show selected option's subtitle if it exists */}
                  {companyType && COMPANY_PRESETS[companyType]?.subTitle && (
                    <p className="text-sm text-gray-500 mt-1">
                      {COMPANY_PRESETS[companyType].subTitle}
                    </p>
                  )}
                  {errors.companyType && (
                    <p className="text-sm text-red-600">{errors.companyType}</p>
                  )}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                 {formData.poDetails.companyType} Purchase Order Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PO Number
                    </label>
                    <input
                      type="text"
                      value={formData.poDetails.poNumber}
                      className={`${inputClasses(
                        "poDetails.poNumber"
                      )} bg-gray-50`}
                      disabled
                    />
                    {errors["poDetails.poNumber"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["poDetails.poNumber"]}
                      </p>
                    )}
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      PO Date*
                    </label>
                    <input
                      type="date"
                      value={formData.poDetails.poDate}
                      onChange={(e) =>
                        handleInputChange("poDetails", "poDate", e.target.value, "1")
                      }
                      className={inputClasses("poDetails.poDate")}
                    />
                    {errors["poDetails.poDate"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["poDetails.poDate"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date*
                    </label>
                    <input
                      type="date"
                      value={formData.poDetails.dueDate}
                      onChange={(e) =>
                        handleInputChange("poDetails", "dueDate", e.target.value, "1")
                      }
                      className={inputClasses("poDetails.dueDate")}
                    />
                    {errors["poDetails.dueDate"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["poDetails.dueDate"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {companyType && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Selected Company Preview
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      {COMPANY_PRESETS[companyType].doorNo},{" "}
                      {COMPANY_PRESETS[companyType].streetName}
                    </p>
                    <p>
                      {COMPANY_PRESETS[companyType].city} -{" "}
                      {COMPANY_PRESETS[companyType].pincode}
                    </p>
                    <p>{COMPANY_PRESETS[companyType].state}</p>
                    <div className="pt-2 mt-2 border-t border-gray-200">
                      <p>Phone: {COMPANY_PRESETS[companyType].phone}</p>
                      <p>Email: {COMPANY_PRESETS[companyType].email}</p>
                      <p>GST: {COMPANY_PRESETS[companyType].gstNo}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
          case 2:
            return (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Supplier Information
                </h3>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Search Supplier
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className={`w-full p-2.5 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                        errors["supplier.name"]
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Type supplier name to search..."
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((supplier, index) => (
                        <div
                          key={index}
                          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleSupplierSelect(supplier)}
                        >
                          <p className="font-medium text-gray-900">
                            {supplier.companyname}
                          </p>
                          <p className="text-sm text-gray-500">
                            {supplier.city}, {supplier.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Supplier Name*
                    </label>
                    <input
                      type="text"
                      value={formData.supplier.name}
                      onChange={(e) =>
                        handleInputChange("supplier", "name", e.target.value, "2")
                      }
                      className={inputClasses("supplier.name")}
                      placeholder="Enter supplier name"
                    />
                    {errors["supplier.name"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["supplier.name"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      GST Number*
                    </label>
                    <input
                      type="text"
                      value={formData.supplier.gstNo}
                      onChange={(e) =>
                        handleInputChange("supplier", "gstNo", e.target.value, "2")
                      }
                      className={inputClasses("supplier.gstNo")}
                      placeholder="Enter GST number"
                    />
                    {errors["supplier.gstNo"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["supplier.gstNo"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone*
                    </label>
                    <input
                      type="tel"
                      value={formData.supplier.phone}
                      onChange={(e) =>
                        handleInputChange("supplier", "phone", e.target.value, "2")
                      }
                      className={inputClasses("supplier.phone")}
                      placeholder="Enter phone number"
                    />
                    {errors["supplier.phone"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["supplier.phone"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email*
                    </label>
                    <input
                      type="email"
                      value={formData.supplier.email}
                      onChange={(e) =>
                        handleInputChange("supplier", "email", e.target.value, "2")
                      }
                      className={inputClasses("supplier.email")}
                      placeholder="Enter email address"
                    />
                    {errors["supplier.email"] && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors["supplier.email"]}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Details*
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <input
                          type="text"
                          placeholder="Door No*"
                          value={formData.supplier.doorNo}
                          onChange={(e) =>
                            handleInputChange("supplier", "doorNo", e.target.value, "2")
                          }
                          className={inputClasses("supplier.doorNo")}
                        />
                        {errors["supplier.doorNo"] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors["supplier.doorNo"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Street Name*"
                          value={formData.supplier.streetName}
                          onChange={(e) =>
                            handleInputChange("supplier", "streetName", e.target.value, "2")
                          }
                          className={inputClasses("supplier.streetName")}
                        />
                        {errors["supplier.streetName"] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors["supplier.streetName"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Area"
                          value={formData.supplier.area}
                          onChange={(e) =>
                            handleInputChange("supplier", "area", e.target.value, "2")
                          }
                          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City*
                        </label>
                        <input
                          type="text"
                          value={formData.supplier.city}
                          onChange={(e) =>
                            handleInputChange("supplier", "city", e.target.value, "2")
                          }
                          className={inputClasses("supplier.city")}
                          placeholder="Enter city"
                        />
                        {errors["supplier.city"] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors["supplier.city"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State*
                        </label>
                        <input
                          type="text"
                          value={formData.supplier.state}
                          onChange={(e) =>
                            handleInputChange("supplier", "state", e.target.value, "2")
                          }
                          className={inputClasses("supplier.state")}
                          placeholder="Enter state"
                        />
                        {errors["supplier.state"] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors["supplier.state"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode*
                        </label>
                        <input
                          type="text"
                          value={formData.supplier.pincode}
                          onChange={(e) =>
                            handleInputChange("supplier", "pincode", e.target.value, "2")
                          }
                          className={inputClasses("supplier.pincode")}
                          placeholder="Enter pincode"
                        />
                        {errors["supplier.pincode"] && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors["supplier.pincode"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
        case 3:
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Authorization Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Incharge*
                      </label>
                      <input
                        type="text"
                        value={formData.counterDetails.purchaseIncharge}
                        onChange={(e) =>
                          handleInputChange(
                            "counterDetails",
                            "purchaseIncharge",
                            e.target.value,
                            "3"
                          )
                        }
                        className={inputClasses(
                          "counterDetails.purchaseIncharge"
                        )}
                        placeholder="Enter name"
                      />
                      {errors["counterDetails.purchaseIncharge"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["counterDetails.purchaseIncharge"]}
                        </p>
                      )}
                      </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Manager*
                      </label>
                      <input
                        type="text"
                        value={formData.counterDetails.purchaseManager}
                        onChange={(e) =>
                          handleInputChange(
                            "counterDetails",
                            "purchaseManager",
                            e.target.value,
                            "3"
                          )
                        }
                        className={inputClasses("counterDetails.purchaseManager")}
                        placeholder="Enter name"
                      />
                      {errors["counterDetails.purchaseManager"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["counterDetails.purchaseManager"]}
                        </p>
                      )}
                    </div>
                    {/* <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Counter (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.counterDetails.counter}
                        onChange={(e) =>
                          handleInputChange(
                            "counterDetails",
                            "counter",
                            e.target.value,
                            "3"
                          )
                        }
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter counter"
                      />
                    </div> */}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Delivery Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Type
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="locationType"
                            value="direct"
                            checked={formData.delivery.locationType === "direct"}
                            onChange={(e) =>
                              handleInputChange(
                                "delivery",
                                "locationType",
                                e.target.value,
                                "3"
                              )
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Direct</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="locationType"
                            value="courier"
                            checked={formData.delivery.locationType === "courier"}
                            onChange={(e) =>
                              handleInputChange(
                                "delivery",
                                "locationType",
                                e.target.value,
                                "3"
                              )
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Courier</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Type
                      </label>
                      <div className="flex gap-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="paymentType"
                            value="RTGS"
                            checked={formData.delivery.paymentType === "RTGS"}
                            onChange={(e) =>
                              handleInputChange(
                                "delivery",
                                "paymentType",
                                e.target.value,
                                "3"
                              )
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">RTGS</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="paymentType"
                            value="MSB"
                            checked={formData.delivery.paymentType === "MSB"}
                            onChange={(e) =>
                              handleInputChange(
                                "delivery",
                                "paymentType",
                                e.target.value,
                                "3"
                              )
                            }
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Metal Sale Bill</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address*
                      </label>
                      <textarea
                        value={formData.delivery.address}
                        onChange={(e) =>
                          handleInputChange(
                            "delivery",
                            "address",
                            e.target.value,
                            "3"
                          )
                        }
                        className={`${inputClasses(
                          "delivery.address"
                        )} resize-none min-h-[100px]`}
                        placeholder="Enter full delivery address"
                      ></textarea>
                      {errors["delivery.address"] && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors["delivery.address"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case 4:
          return (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Review Purchase Order
              </h3>
              {/* <div className="bg-white rounded-lg border border-gray-200">
                <PurchaseOrderGenerator
                  formData={formData}
                  selectedItems={selectedItems}
                  preview={true}
                />
              </div> */}
            </div>
          );
        default:
          return null;
      }
    };

    export default RenderStep;