
 
//  useEffect(() => {
//      if (
//        (formData?.metal_type === "Silver" ||
//          formData?.metal_type === "Airra" ||
//          formData?.metal_type === "GA") &&
//        formData?.productWeightage?.value === "Pcs"
//      ) {
//        const amt = parseFloat(formData.pieces) * parseFloat(formData.rate);
//        setFormData((prev) => ({
//          ...prev,
//          amount: isNaN(amt.toFixed(3)) ? 0 : amt.toFixed(3), // This returns a string, make sure that's okay
//        }));
//      }
//    }, [
//      formData.rate,
//      formData.pieces,
//      formData.productWeightage,
//      formData.metal_type,
//    ]);
 
//    useEffect(() => {
//      if (formData.grossWt && !isNaN(formData.grossWt)) {
//        const stoneWeight =
//          formData.stoneWt && !isNaN(formData.stoneWt)
//            ? parseFloat(formData.stoneWt)
//            : 0;
//        const waxWeights =
//          formData.waxWt && !isNaN(formData.waxWt)
//            ? parseFloat(formData.waxWt)
//            : 0;
//        const diamondWtInGrams = parseFloat(formData.diacent) * 0.2;
//        let netWeight;
//        if (
//          selectedTypes.Gold &&
//          selectedTypes.Diamond &&
//          selectedTypes.Platinum
//        ) {
//          netWeight =
//            parseFloat(formData.platinumWt??0) -
//            parseFloat(stoneWeight??0) -
//            parseFloat(waxWeights??0) -
//            (isNaN(diamondWtInGrams) ? 0 : diamondWtInGrams);
//        } else {
//          netWeight =
//            parseFloat(formData.grossWt??0) -
//            parseFloat(stoneWeight??0) -
//            parseFloat(waxWeights??0) -
//            (isNaN(diamondWtInGrams) ? 0 : diamondWtInGrams);
//        }
//        setFormData((prev) => ({
//          ...prev,
//          netWt: netWeight.toFixed(3),
//        }));
//      }
//    }, [
//      formData.grossWt,
//      formData.stoneWt,
//      formData.waxWt,
//      formData?.diacent ?? formData.diacent,
//      formData.platinumWt,
//    ]);
 
//    // Calculate pure weight when net weight, melting, or wastage changes
//    useEffect(() => {
//      if (formData.netWt && !isNaN(formData.netWt)||formData.goldwt) {
//        const netWeight = parseFloat(formData.netWt);
//        const goldNetWt=parseFloat(formData.goldwt)
//        const melting = formData.melting?.value
//          ? parseFloat(formData.melting.value)
//          : 0;
//        const wastage = formData.wastage?.value
//          ? parseFloat(formData.wastage.value)
//          : 0;
//          let pureWt
//          if(selectedTypes.Platinum&&selectedTypes.Gold){
//            pureWt=goldNetWt*(melting/100)
//          }
//          else {
//         pureWt = netWeight * ((melting + wastage) / 100);
//          }
       
//        setFormData((prev) => ({
//          ...prev,
//          pureWt: pureWt.toFixed(3),
//        }));
//      }
//    }, [
//      formData.netWt,
//      formData.melting?.value,
//      formData.wastage?.value,
//      formData.melting,
//      formData.wastage,
//      formData.goldwt,
//      selectedTypes.Gold,selectedTypes.Platinum
//    ]);

 const Gold = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true ,options:[{"label":"Gold","value":"Gold"},{label:"Airra",value:"Airra"}]},
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: false },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
    { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
    // { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: false },
    { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];

const Silver = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productWeightage", label: "Product Weightage", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: true },
    { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
    { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];

const SilverPcs = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "productWeightage", label: "Product Weightage", require: false, view: false, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "rate", label: "Rate", require: true, view: true, type: 'number', input: true },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];

const Gold_Diamond = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "productType", label: "Product Type", require: false, view: false, type: 'text', input: false },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "diacent", label: "Dia Cent", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "goldwt", label: "Gold Wt", require: false, view: false, type: 'number', input: true },
    { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: true },
    { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
    { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
    // { field: "productWeightage", label: "Product Weightage", require: false, view: false, type: 'text', input: false },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];

const Platinum_Diamond = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "productType", label: "Product Type", require: false, view: false, type: 'text', input: false },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "diacent", label: "Dia Cent", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "platinumWt", label: "Platinum Wt", require: false, view: false, type: 'number', input: true },
    { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
    { field: "ptPureWt", label: "Pt Pure Wt", require: false, view: false, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: true },
    { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
    { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
    { field: "ptMelting", label: "Pt Melting", require: false, view: false, type: 'number', input: true },
    // { field: "productWeightage", label: "Product Weightage", require: false, view: false, type: 'text', input: false },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];

const Gold_Platinum_Diamond = [
    { field: "sno", label: "S.No", require: false, view: true, type: 'text', input: false },
    { field: "product", label: "Product", require: true, view: true, type: 'select', input: true },
    { field: "metal_type", label: "Metal Type", require: false, view: false, type: 'text', input: false },
    { field: "productName", label: "Product Name", require: false, view: true, type: 'text', input: true },
    { field: "orderType", label: "Order Type", require: false, view: false, type: 'text', input: false },
    { field: "productType", label: "Product Type", require: false, view: false, type: 'text', input: false },
    { field: "pieces", label: "Pieces", require: false, view: true, type: 'number', input: true },
    { field: "grossWt", label: "Gross Wt", require: false, view: true, type: 'number', input: true },
    { field: "diacent", label: "Dia Cent", require: false, view: true, type: 'number', input: true },
    { field: "stoneWt", label: "Stone Wt", require: false, view: true, type: 'number', input: true },
    { field: "stoneCost", label: "Stone Cost", require: false, view: true, type: 'number', input: true },
    { field: "waxWt", label: "Wax Wt", require: false, view: true, type: 'number', input: true },
    { field: "netWt", label: "Net Wt", require: false, view: true, type: 'number', input: true },
    { field: "goldwt", label: "Gold Wt", require: false, view: false, type: 'number', input: true },
    { field: "platinumWt", label: "Platinum Wt", require: false, view: false, type: 'number', input: true },
    { field: "pureWt", label: "Pure Wt", require: false, view: true, type: 'number', input: true },
    { field: "ptPureWt", label: "Pt Pure Wt", require: false, view: false, type: 'number', input: true },
    { field: "amount", label: "Amount", require: false, view: true, type: 'number', input: true },
    { field: "mc", label: "Making Charge", require: false, view: true, type: 'number', input: true },
    { field: "melting", label: "Melting", require: false, view: false, type: 'number', input: true },
    { field: "wastage", label: "Wastage", require: false, view: false, type: 'number', input: true },
    { field: "ptMelting", label: "Pt Melting", require: false, view: false, type: 'number', input: true },
    // { field: "productWeightage", label: "Product Weightage", require: false, view: false, type: 'text', input: false },
    { field: "photo", label: "Photo", require: false, view: false, type: 'file', input: true },
    { field: "photoUrl", label: "Photo URL", require: false, view: false, type: 'text', input: false },
    { field: "edit", label: "Edit", require: false, view: true, type: 'boolean', input: false }
];
const poFields = (user,formData) => {
    if (user && user.includes("Gold")) {
        return Gold; 
    }
    // else if (user && user.includes("Silver")&&formData?.productWeightage==="PCS") {
    //     return SilverPcs; 
    // }
   else if (user && user.includes("Silver")) {
        return Silver; 
    }
    // else if (user && user.includes("Diamond")&&!formData?.productType) {
    //     return Diamond; 
    // }
    return null; // or return a default value
};


export default poFields;
