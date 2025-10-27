import React, { useState, useEffect, useRef, useContext } from "react";
import {
  CustomSelect,
  CustomInput,
  PhotoCapture,
  CustomSelects,
  ProductTypeSelection,
} from "../components/InputComp";
import SubmittedDataComp from "../components/SubmittedDataComp";
import PurchaseOrderDialog from "../components/PurchaseOrderDialog";
import axios from "axios";
import { API } from "../../../config/configData";
import { useSendToServer } from "../components/SendToServer";
import Snackbar from "../../../Components/Snackbar";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { PoContext } from "../PoContext/PoContext";
import { useValidation } from "../components/useValidation";
import useImageCompression from "../components/useImageCompression";
const DiamondProductForm = () => {
  const { userRole, user } = useContext(DashBoardContext);
  const {
    formData,
    setFormData,
    snackbar,
    setSnackbar,
    hideSnackbar,
    showSnackbar,
    goldMelting,
    errors,
    setErrors,
    selectedTypes,
    setSelectedTypes,
  } = useContext(PoContext);
  let metal = userRole?.split("-")[0];
  const [submittedData, setSubmittedData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPoDialogOpen, setIsPoDialogOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [poAddressData, setPoAddressData] = useState(null);
  const { validateField } = useValidation();
  const { compressAndConvertToJPG, isCompressing } = useImageCompression(100);

  const [meltingOptions, setMeltingOptions] = useState([]);

  console.log(isCompressing);

  const [filteredSubmittedData, setFilteredSubmittedData] = useState([]);
  console.log(filteredSubmittedData);

  const photoCaptureRef = useRef(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/fetch_all_products/${userRole}/${
            formData?.productType ?? ""
          }`
        );
        console.log("...........................", response.data);
        setProductDetails(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProductDetails();
  }, [formData?.productType ?? ""]);
  useEffect(() => {
    const fetchMeltingDetails = async () => {
      try {
        const response = await axios.get(
          `${API}/gold_po/meltingdetails/${userRole}
          }`
        );
        setMeltingOptions(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMeltingDetails();
  }, [userRole]);
  console.log(formData?.productType);
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers and decimal point for numeric fields
    if (
      [
        "pieces",
        "grossWt",
        "stoneWt",
        "stoneCost",
        "waxWt",
        "netWt",
        "amount",
        "wastage",
      ].includes(name)
    ) {
      // Reject if not a valid number format (only digits and single decimal point)
      if (!/^\d*\.?\d*$/.test(value)) {
        return;
      }

      // Prevent multiple decimal points
      if (value.split(".").length > 2) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "wastage" ? { label: value, value: value } : value,
    }));

    validateField(name, value);
  };

  // const handlePhotoCapture = (event, capturedImage, setCapturedImage) => {
  //   // const reSizedImage=compressAndConvertToJPG(event)

  //   setFormData((prev) => ({
  //     ...prev,
  //     photo: reSizedImage,
  //   }));
  // };
  const handlePhotoCapture = async (file, capturedImage, setCapturedImage) => {
    try {
      // Compress the image before storing it
      if (file) {
        const compressedImage = await compressAndConvertToJPG(file);

        // Get the size of the original image in KB
        const originalSizeKB = (file.size / 1024).toFixed(2);

        // Get the size of the compressed image in KB
        const compressedSizeKB = (compressedImage.size / 1024).toFixed(2);

        console.log(
          `Original image: ${originalSizeKB} KB, Compressed: ${compressedSizeKB} KB`
        );

        // Optional: Show compression result to user
        // showSnackbar(`Image compressed from ${originalSizeKB}KB to ${compressedSizeKB}KB`, "success");

        setFormData((prev) => ({
          ...prev,
          photo: compressedImage,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          photo: null,
        }));
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      // showSnackbar("Failed to process image", "error");
      // Fallback to uncompressed image if compression fails
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
    }
  };
  const handleSelect = (itemId, orderType) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleEdit = (event) => {
    const data = event;
    console.log("Edit data:", data);

    // Find the product details
    const productData = productDetails.find(
      (opt) => opt.value === data.product
    );

    setFormData({
      sno: data.sno,
      product: data.product,
      orderType: data.orderType,
      metal_type:
        data.metal_type ||
        (userRole.includes("Gold")
          ? "Gold"
          : userRole.includes("Silver")
          ? "Silver"
          : ""),
      productName: data.product_name,
      pieces: data.pieces,
      grossWt: data.gross_weight,
      stoneWt: data.stone_weight,
      stoneCost: data.stone_cost,
      waxWt: data.wax_weight,
      amount: data.amount,
      melting: { label: data.melting, value: data.melting },
      wastage: { label: data.wastage, value: data.wastage },
      edit: true,
      photo: data.product_image,
      netWt: data.net_weight || "",
      pureWt: data.pure_weight || "",
      productWeightage: data.productWeightage || "Gram",
      goldwt: data.goldwt,
      platinumWt: data.platinumWt,
      diacent: data.diamondwt,
      productType: data.productType || "GO",
      mc: data.makingCharges,
    });
    let parsedTypes;

    try {
      const maybeParsed = JSON.parse(data.productAvlTypes);

      // If it's still a string (i.e., double-encoded), parse again
      parsedTypes =
        typeof maybeParsed === "string" ? JSON.parse(maybeParsed) : maybeParsed;
    } catch (err) {
      parsedTypes = {}; // or [] or null — whatever makes sense as a fallback
    }

    setSelectedTypes(parsedTypes);
  };

  const handleDelete = async (id) => {
    try {
      console.log(id);
      const response = await axios.put(`${API}/gold_po/delete/${id}`);
      if (response.status === 200) {
        fetchPoUserDetails();
        showSnackbar("Product deleted successfully!", "error");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
      showSnackbar("Failed to delete product", "error");
    }
  };

  const handlePoSubmit = async (poData) => {
    console.log(poData);
    try {
      const filteredItems = submittedData.filter((item) =>
        selectedItems.includes(item.sno)
      );

      // Ensure we have data to work with
      if (!filteredItems || filteredItems.length === 0) {
        throw new Error("No items selected for the purchase order");
      }
      const orderTypes = [
        ...new Set(filteredItems.map((data) => data.orderType)),
      ];
      console.log(filteredItems);
      // Set the filtered data and PO address data for the PDF generation
      setFilteredSubmittedData(filteredItems);
      setPoAddressData(poData);

      // First generate the PDF with the actual data
      // const pdfGenerated = await generatePdf(
      //   filteredItems,
      //   poData,
      //   submittedData,
      //   orderTypes
      // );
      let pdfGenerated = true;
      if (pdfGenerated) {
        // Now prepare data for updating the PO records
        const submitDataForUpdate = {
          items: selectedItems,
          poDetails: poData,
        };
        console.log(submitDataForUpdate);

        const response = await axios.put(
          `${API}/gold_po/update_po_records/${userRole}/${user}`,
          submitDataForUpdate
        );

        if (response.status === 200) {
          fetchPoUserDetails();
          setIsPoDialogOpen(false);
          setSelectedItems([]);
          showSnackbar(response.data.message);
        }
      }
    } catch (error) {
      console.error("Error submitting PO:", error);
      showSnackbar(error.message || "Failed to submit Purchase Order", "error");
    }
  };

  const fetchPoUserDetails = async () => {
    try {
      const response = await axios.get(
        `${API}/gold_po/Get_Po_Details/${userRole}`
      );
      setSubmittedData(response.data);
    } catch (error) {
      console.error("Error fetching PO details:", error);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if product is required based on order type
    if (formData.orderType === "office" && !formData.product) {
      newErrors.product = "Product is required for office orders";
    }

    // Check if product name is required based on order type
    if (formData.orderType === "fair" && !formData.productName?.trim()) {
      newErrors.productName = "Product name is required for fair orders";
    }

    // Validate other required fields
    // if (!formData.pieces) {
    //   newErrors.pieces = "Number of pieces is required";
    // }

    // if (!formData.grossWt) {
    //   newErrors.grossWt = "Gross weight is required";
    // }

    // if (!formData.stoneWt) {
    //   newErrors.stoneWt = "Stone weight is required";
    // }

    // if (!formData.stoneCost) {
    //   newErrors.stoneCost = "Stone cost is required";
    // }

    // if (!formData.waxWt) {
    //   newErrors.waxWt = "Wax weight is required";
    // }

    // if (!formData.melting) {
    //   newErrors.melting = "Melting percentage is required";
    // }

    // if (!formData.wastage) {
    //   newErrors.wastage = "Wastage percentage is required";
    // }

    // if (!formData.photo) {
    //   newErrors.photo = "Product photo is required";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  console.log(formData.productWeightage);
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      showSnackbar("Please fix the errors before submitting", "error");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("productAvlTypes", JSON.stringify(selectedTypes));

    // Append all form fields to FormData
    Object.keys(formData).forEach((key) => {
      console.log(formData["productType"]);
      if (key === "photo" && formData[key]) {
        formDataToSubmit.append("photo", formData[key]);
      } else if (key === "product" && formData[key]) {
        formDataToSubmit.append(key, formData[key]);
      } else if (key === "melting" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? 0);
      } else if (key === "wastage" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? 0);
      } else if (key === "productWeightage" && formData[key]) {
        formDataToSubmit.append(key, formData[key].value ?? "Gram");
      } else if (key === "productType" && formData[key]) {
        formDataToSubmit.append(key, formData[key] ?? "GO");
      } else if (formData[key] !== null && formData[key] !== undefined) {
        console.log(key, formData[key]);
        formDataToSubmit.append(key, formData[key]);
      }
    });
    console.log(selectedTypes);
    // Always append metal_type
    for (let pair of formDataToSubmit.entries()) {
      console.log(pair[0], pair[1]);
    }
    try {
      const response = await axios.post(
        `${API}/gold_po/gold_po`,
        formDataToSubmit
      );
      if (response.status === 201) {
        if (photoCaptureRef.current) {
          photoCaptureRef.current.recapture();
        }
        // Reset form
        setFormData({
          product: null,
          metal_type: userRole.includes("Gold")
            ? "Gold"
            : userRole.includes("Silver")
            ? "Silver"
            : userRole.includes("Diamond")
            ? "Diamond"
            : "",
          productName: "",
          orderType: "office",
          pieces: "",
          grossWt: "",
          stoneWt: "",
          stoneCost: "",
          waxWt: "",
          netWt: "",
          amount: "",
          photo: null,
          melting: null,
          wastage: null,
          diacent: "",
          pureWt: "",
          edit: false,
          photoUrl: "",
          productType: userRole.includes("Gold")
            ? "GO"
            : userRole.includes("Diamond")
            ? "DIA"
            : "GO",
          productWeightage: "Gram",
          mc: "",
        });
        setSelectedTypes({
          Gold: userRole.includes("Diamond") ? true : false,
          Diamond: userRole.includes("Diamond") ? true : false,
          Platinum: false,
        });
        fetchPoUserDetails();
        setErrors({});
        showSnackbar("Product added successfully!");
      }
    } catch (error) {
      showSnackbar(
        error.response?.data?.message || "Failed to add product",
        "error"
      );
      console.error("Error submitting form:", error);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchPoUserDetails();
  }, []);
  useEffect(() => {
    console.log("Selected types changed:", selectedTypes);
    // You can add additional logic here if needed when selectedTypes changes
  }, [selectedTypes]);

  return (
    <div className="p-4 md:p-6 max-w-10xl mx-auto bg-white rounded-xl shadow-lg">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6 ">
        {userRole?.split("-")[0]} Purchase Order
      </h2>
      <div className="flex space-x-6 mb-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="orderType"
            value="office"
            checked={formData.orderType === "office"}
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                orderType: "office",
                productName: "",
              }));
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.productName;
                return newErrors;
              });
            }}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Office Selection</span>
        </label>
        <label className="flex items-center cursor-pointer">
          <input
            type="radio"
            name="orderType"
            value="fair"
            checked={formData.orderType === "fair"}
            onChange={() => {
              setFormData((prev) => ({
                ...prev,
                orderType: "fair",
              }));
              // Clear product error when switching to fair
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.product;
                return newErrors;
              });
            }}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2 text-gray-700">Exhibition Selection</span>
        </label>
      </div>
      {userRole.includes("Silver") && (
        <div className="flex space-x-6 mb-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="Silver"
              checked={formData.productType === "Silver"}
              onChange={() => {
                setFormData((prev) => ({
                  ...prev,
                  productType: "Silver",
                }));
                // Clear product name error when switching to office
              }}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Silver</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="GA"
              checked={formData.productType === "GA"}
              onChange={() => {
                setFormData((prev) => ({
                  ...prev,
                  productType: "GA",
                }));
                // Clear product error when switching to fair
              }}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Gift Article</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="productType"
              value="Airra"
              checked={formData.productType === "Airra"}
              onChange={() => {
                setFormData((prev) => ({
                  ...prev,
                  productType: "Airra",
                }));
                // Clear product error when switching to fair
              }}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-gray-700">Airra</span>
          </label>
        </div>
      )}
      {userRole.includes("Diamond") && (
        <div className="flex space-x-6 mb-4">
          <label className="flex items-center cursor-pointer">
            <ProductTypeSelection
              formData={formData}
              setFormData={setFormData}
              selectedTypes={selectedTypes}
              setSelectedTypes={setSelectedTypes}
            />
          </label>
        </div>
      )}
      {console.log(formData.productType)}
      <div className="p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          <CustomSelects
            label="Product"
            options={productDetails}
            value={formData.product}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, product: value }))
            }
            error={errors.product}
          />

          {formData.orderType === "fair" && (
            <CustomInput
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleInputChange}
              error={errors.productName}
            />
          )}
          <CustomInput
            label="Pieces"
            name="pieces"
            value={formData.pieces}
            onChange={handleInputChange}
            error={errors.pieces}
          />
          {formData.metal_type === "Silver" && (
            <>
              <CustomSelect
                label="Product Weightage"
                options={[
                  { label: "Gram", value: "Gram" },
                  { label: "Pcs", value: "Pcs" },
                ]}
                value={formData?.productWeightage}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, productWeightage: value }))
                }
                error={errors.productWeightage}
              />
              {console.log(formData?.productWeightage)}
              {formData?.productWeightage?.value === "Pcs" && (
                <CustomInput
                  label="Rate"
                  name="rate"
                  value={formData.rate}
                  onChange={handleInputChange}
                  error={errors.rate}
                />
              )}
            </>
          )}

          <CustomInput
            label="Gross Weight"
            name="grossWt"
            value={formData.grossWt}
            onChange={handleInputChange}
            error={errors.grossWt}
          />
          {selectedTypes.Diamond && (
            <>
              <CustomInput
                label="Diamond Carat"
                name="diacent"
                value={formData.diacent}
                onChange={handleInputChange}
                error={errors.diacent}
              />
            </>
          )}

          <CustomInput
            label="Stone Weight in (gm)"
            name="stoneWt"
            value={formData.stoneWt}
            onChange={handleInputChange}
            error={errors.stoneWt}
          />
          <CustomInput
            label="Stone Cost"
            name="stoneCost"
            value={formData.stoneCost}
            onChange={handleInputChange}
            error={errors.stoneCost}
          />
          <CustomInput
            label="Wax Weight"
            name="waxWt"
            value={formData.waxWt}
            onChange={handleInputChange}
            error={errors.waxWt}
          />
          {selectedTypes.Gold && selectedTypes.Platinum && (
            <>
              <CustomInput
                label="Gold net wt"
                name="goldwt"
                value={formData.goldwt}
                onChange={handleInputChange}
                error={errors.goldwt}
              />
              <CustomInput
                label="Platinum Grs wt"
                name="platinumWt"
                value={formData.platinumWt}
                onChange={handleInputChange}
                error={errors.platinumWt}
              />
            </>
          )}

          {/* {(selectedTypes.Gold&&selectedTypes.Platinum) && (
            <>
             <CustomInput
                label="Gold net wt"
                name="goldwt"
                value={formData.goldwt}
                onChange={handleInputChange}
                error={errors.goldwt}
              />
               <CustomInput
                label="Platinum net wt"
                name="platinumWt"
                value={formData.platinumWt}
                onChange={handleInputChange}
                error={errors.platinumWt}
              />
            </>
          )} */}
          <CustomInput
            label={selectedTypes.Platinum ? "Pt Net Weight" : "Net Weight"}
            name="netWt"
            value={formData.netWt}
            disabled={true}
            error={errors.netWt}
          />
          <CustomInput
            label="Amount"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            error={errors.amount}
          />
          {/* {formData?.productWeightage?.value === "Gram" && ( */}

          {formData?.productWeightage?.value === "Gram" ||
            (formData.metal_type === "Gold" && (
              <>
                <CustomSelect
                  label="Melting"
                  options={meltingOptions}
                  value={formData.melting}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, melting: value }))
                  }
                  error={errors.melting}
                />
                <CustomInput
                  label="Wastage"
                  name="wastage"
                  value={formData.wastage?.value || ""}
                  onChange={handleInputChange}
                  error={errors.wastage}
                />

                <CustomInput
                  label="Making Charges"
                  name="mc"
                  value={formData.mc}
                  onChange={handleInputChange}
                  error={errors.mc}
                />
              </>
            ))}
          {selectedTypes.Gold && selectedTypes.Platinum && (
            <>
              <CustomSelect
                label="Gold Melting"
                options={meltingOptions}
                value={formData.melting}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, melting: value }))
                }
                error={errors.melting}
              />
              <CustomSelect
                label="Platinum Melting"
                options={meltingOptions}
                value={formData.melting}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, melting: value }))
                }
                error={errors.melting}
              />
              {/* <CustomInput
              label="Gold PureWt"
              name="pureWt"
              value={formData.pureWt}
              onChange={handleInputChange}
              disabled
              error={errors.pureWt}
            /> */}
              <CustomInput
                label="Platinum PureWt"
                name="pureWt"
                value={formData.pureWt}
                onChange={handleInputChange}
                disabled
                error={errors.pureWt}
              />
            </>
          )}
          {/* )} */}
          {formData.metal_type !== "Silver" && (
            <CustomInput
              label={
                selectedTypes.Gold && selectedTypes.Platinum
                  ? "Gold pure Wt"
                  : "PureWt"
              }
              name="pureWt"
              value={formData.pureWt}
              onChange={handleInputChange}
              disabled
              error={errors.pureWt}
            />
          )}
        </div>
        <div className="flex items-end h-full mt-10">
          <PhotoCapture
            ref={photoCaptureRef}
            onPhotoCapture={handlePhotoCapture}
            photoUrl={formData.photo ? formData.photo : null}
          />
        </div>
        <div className="flex justify-center mt-6">
          {(formData?.productWeightage?.value === "Pcs" &&
            formData.rate &&
            formData.pieces) ||
          (formData.netWt && parseFloat(formData.netWt) > 0) ? (
            //
            // ) :  ? (
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Add Product
            </button>
          ) : null}
        </div>
      </div>
      <SubmittedDataComp
        submittedData={submittedData}
        handleSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedItems={selectedItems}
        ispocreation={false}
      />
      {selectedItems.length > 0 && (
        <div className="w-full flex justify-center mt-2">
          <button
            onClick={() => setIsPoDialogOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}
      {/* <div className="flex justify-center mt-6">
        {(formData.netWt && parseFloat(formData.netWt) > 0) ||
        ((formData.metal_type === "Silver" ||
          formData.metal_type === "Airra" ||
          formData.metal_type === "GA") &&
          formData.productWeightage?.value === "Pcs" &&
          formData.rate &&
          formData.pieces) ? (
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Product
          </button>
        ) : null}
      </div> */}
      <PurchaseOrderDialog
        isOpen={isPoDialogOpen}
        metal_type={metal}
        onClose={() => {
          setIsPoDialogOpen(false);
          setSelectedItems([]);
        }}
        onSubmit={handlePoSubmit}
      />
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={hideSnackbar}
        position="top-right"
        duration={5000}
      />
    </div>
  );
};

export default DiamondProductForm;
