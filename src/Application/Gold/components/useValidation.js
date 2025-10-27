import { useContext } from "react";
import { PoContext } from "../PoContext/PoContext";

export const useValidation = () => {
  const { errors, setErrors, formData } = useContext(PoContext);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    // switch (name) {
    //   case "product":
    //     if (!value && formData.orderType === "office") {
    //       newErrors[name] = "Product is required for office orders";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "productName":
    //     if (!value?.trim() && formData.orderType === "fair") {
    //       newErrors[name] = "Product name is required for fair orders";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "pieces":
    //     if (!value) {
    //       newErrors[name] = "Number of pieces is required";
    //     } else if (isNaN(value) || parseFloat(value) <= 0) {
    //       newErrors[name] = "Enter valid number of pieces";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "grossWt":
    //     if (!value) {
    //       newErrors[name] = "Gross weight is required";
    //     } else if (isNaN(value) || parseFloat(value) <= 0) {
    //       newErrors[name] = "Enter valid gross weight";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "stoneWt":
    //     if (!value) {
    //       newErrors[name] = "Stone weight is required";
    //     } else if (isNaN(value) || parseFloat(value) < 0) {
    //       newErrors[name] = "Enter valid stone weight";
    //     } else if (parseFloat(value) >= parseFloat(formData.grossWt)) {
    //       newErrors[name] = "Stone weight cannot be greater than gross weight";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "stoneCost":
    //     if (!value) {
    //       newErrors[name] = "Stone cost is required";
    //     } else if (isNaN(value) || parseFloat(value) < 0) {
    //       newErrors[name] = "Enter valid stone cost";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "waxWt":
    //     if (!value) {
    //       newErrors[name] = "Wax weight is required";
    //     } else if (isNaN(value) || parseFloat(value) < 0) {
    //       newErrors[name] = "Enter valid wax weight";
    //     } else if (parseFloat(value) >= parseFloat(formData.grossWt)) {
    //       newErrors[name] = "Wax weight cannot be greater than gross weight";
    //     } else {
    //       const totalDeductions =
    //         parseFloat(value) + parseFloat(formData.stoneWt || 0);
    //       if (totalDeductions >= parseFloat(formData.grossWt)) {
    //         newErrors[name] =
    //           "Combined stone and wax weight cannot exceed gross weight";
    //       } else {
    //         delete newErrors[name];
    //       }
    //     }
    //     break;

    //   case "melting":
    //     if (!value) {
    //       newErrors[name] = "Melting percentage is required";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "wastage":
    //     if (!value) {
    //       newErrors[name] = "Wastage percentage is required";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;

    //   case "photo":
    //     if (!value) {
    //       newErrors[name] = "Product photo is required";
    //     } else {
    //       delete newErrors[name];
    //     }
    //     break;
    // }

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
      if (!formData.pieces) {
        newErrors.pieces = "Number of pieces is required";
      }
    
      // For Silver products with "Pcs" weightage, skip certain validations
      const isSilverWithPcsWeightage = 
        (formData.metal_type === "Silver" || formData.metal_type === "Airra" || formData.metal_type === "GA") && 
        formData.productWeightage?.value === "Pcs";
    
      // Only validate these fields if not Silver with Pcs weightage
      if (!isSilverWithPcsWeightage) {
        if (!formData.grossWt) {
          newErrors.grossWt = "Gross weight is required";
        }
    
        // These fields are always required regardless of product type
        if (!formData.stoneWt) {
          newErrors.stoneWt = "Stone weight is required";
        }
    
        if (!formData.stoneCost) {
          newErrors.stoneCost = "Stone cost is required";
        }
    
        if (!formData.waxWt) {
          newErrors.waxWt = "Wax weight is required";
        }
    
        // For Silver with Pcs weightage, no need to validate melting and wastage
        if (!formData.melting) {
          newErrors.melting = "Melting percentage is required";
        }
    
        if (!formData.wastage) {
          newErrors.wastage = "Wastage percentage is required";
        }
      } else {
        // For Silver with Pcs weightage, validate rate field
        if (!formData.rate) {
          newErrors.rate = "Rate is required for per piece calculation";
        }
      }
    
      // Photo is always required
      if (!formData.photo) {
        newErrors.photo = "Product photo is required";
      }
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    setErrors(newErrors);
  };

  return { validateField };
};
