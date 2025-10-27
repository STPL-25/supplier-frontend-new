const validate = (kycFormData, filesDatas, fileDatasUrl) => {
    let tempErrors = {};
    console.log(kycFormData)
    // Supplier Category
    if (!kycFormData.supplierCategory) {
        tempErrors.supplierCategory = "Supplier Category is required.";
    } else {
        delete tempErrors.supplierCategory; // Correct usage of delete operator
    }


    // Company Name
    if (!kycFormData.companyname.trim()) {
        tempErrors.companyname = "Company Name is required.";
    }
    else {
        delete tempErrors.companyname;
    }

    // Door No
    if (!kycFormData.doorno.trim()) {
        tempErrors.doorno = "Door No is required.";
    } else if (!/^[a-zA-Z0-9\s\.\,\-\/]+$/.test(kycFormData.doorno)) {
        // Example: checks for alphanumeric characters, spaces, and hyphens
        tempErrors.doorno = "Invalid Door No format";
    }

    // Street
    if (!kycFormData.street.trim()) {
        tempErrors.street = "Street is required.";
    } else if (!/^[a-zA-Z0-9\s,.-]+$/.test(kycFormData.street)) {
        // Example: allows alphanumeric, spaces, commas, periods, and hyphens
        tempErrors.street = "Invaild Street Format";
    }

    // Pin Code
    if (!kycFormData.pincode.trim()) {
        tempErrors.pincode = "Pin Code is required.";
    } else if (!/^\d{6}$/.test(kycFormData.pincode)) {
        tempErrors.pincode = "Pin Code must be 6 digits.";
    }

    // Area
    if (!kycFormData.area) {
        tempErrors.area = "Area is required.";
    }

    // Taluk
    if (!kycFormData.taluk.trim()) {
        tempErrors.taluk = "Taluk is required.";
    }

    // City
    if (!kycFormData.city.trim()) {
        tempErrors.city = "City is required.";
    }

    // State
    if (!kycFormData.state.trim()) {
        tempErrors.state = "State is required.";
    }

    // Mobile Number
    if (!kycFormData.mobilenumber.trim()) {
        tempErrors.mobilenumber = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(kycFormData.mobilenumber)) {
        tempErrors.mobilenumber = "Mobile Number must be 10 digits.";
    }

    // Email
    if (!kycFormData.email.trim()) {
        tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(kycFormData.email)) {
        tempErrors.email = "Email is invalid.";
    }
    else if (/\.{2,}/.test(kycFormData.email)) {
        tempErrors.email = "Email should not contain consecutive dots.";
    }

    // Proprietor Name
    if (!kycFormData.propritorname.trim()) {
        tempErrors.propritorname = "Owner/Authorized Representative Name is required.";
    }

    // Organization
    if (!kycFormData.organization) {
        tempErrors.organization = "Organization is required.";
    }

    // Reg Under MSME
    if (!kycFormData.regUnderMsme) {
        tempErrors.regUnderMsme = "This field is required.";
    }
    if (!kycFormData.msmeNo.trim() && kycFormData.regUnderMsme === "Yes") {
        tempErrors.msmeNo = "MSME No is required.";
    }
    // PAN
    if (!kycFormData.pan.trim()) {
        tempErrors.pan = "PAN is required.";
    } else if (!/^[A-Z]{5}\d{4}[A-Z]{1}$/.test(kycFormData.pan)) {
        tempErrors.pan = "PAN is invalid.";
    }


    // GST
    if (!kycFormData.gst.trim()) {
        tempErrors.gst = "GST Number is required.";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(kycFormData.gst)) {
        tempErrors.gst = "GST Number is invalid.";
    }

    // File uploads
    if (!filesDatas.gstFile && !fileDatasUrl.gstFile) {
        tempErrors.gstFile = "GST File is required.";
    } else if (
        filesDatas.gstFile && // Ensure filesDatas.gstFile exists before accessing its properties
        filesDatas.gstFile.type === 'application/pdf' &&
        filesDatas.gstFile.size > 300 * 1024
    ) {
        tempErrors.gstFile = "GST File size must be below 300 KB.";
    }
    //  else if (
    //     fileDatasUrl.gstFile?.endsWith(".pdf")

    // ) {
    //     tempErrors.gstFile = "GST File from URL must meet validation criteria.";
    // }
    // Check if PAN file is present
    if (!filesDatas.panFile && !fileDatasUrl.panFile) {
        tempErrors.panFile = "PAN File is required.";
    } else if (filesDatas.panFile && filesDatas.panFile.type == 'application/pdf' && filesDatas.panFile.size > 300 * 1024) {
        // Check if the PAN file is PDF and size is below 100 KB
        tempErrors.panFile = "PAN File  size must be below 300 KB.";
    }
    // else if (
    //     fileDatasUrl.panFile?.endsWith(".pdf")||fileDatasUrl.panFile?.endsWith("blob")

    // ) {
    //     tempErrors.panFile = "PAN File from URL must meet validation criteria.";
    // }
// console.log(fileDatasUrl?.msmeFile?.endsWith(".pdf"))
    // Check if MSME file is required for MSME registration
    if (kycFormData.regUnderMsme === "Yes" && !filesDatas.msmeFile && !fileDatasUrl.msmeFile) {
        tempErrors.msmeFile = "MSME File is required.";
    } else if (filesDatas.msmeFile && filesDatas.msmeFile && (filesDatas.msmeFile.type == 'application/pdf' && filesDatas.msmeFile.size > 300 * 1024)) {
        // Check if the MSME file is PDF and size is below 100 KB
        tempErrors.msmeFile = "MSME File size must be below 300 KB.";
    }
    // else if (
    //     fileDatasUrl?.msmeFile?.endsWith(".pdf")

    // ) {
    //     tempErrors.msmeFile = "MSME File from URL must meet validation criteria.";
    // }
    // setErrors(tempErrors);

    // return Object.keys(tempErrors).length === 0;
    return tempErrors
};
const validateStatutoryInfo = (statutatoryInfo) => {
    let tempErrors = {};

    // Trade Name
    if (!statutatoryInfo.tradename.trim()) {
        tempErrors.tradename = "Trade Name is required.";
    } else if (!/^[a-zA-Z\s&'-]+$/.test(statutatoryInfo.tradename)) {
        // Example: allows letters, numbers, spaces, ampersands, apostrophes, and hyphens
        tempErrors.tradename = "Invalid trade name";
    } else if (statutatoryInfo.tradename.length < 3) {
        // Example: ensuring trade name is at least 3 characters long
        tempErrors.tradename = "Trade Name must be at least 3 characters.";
    }
    // Legal Name
    if (!statutatoryInfo.readelegalname.trim()) {
        tempErrors.readelegalname = "Legal Name is required.";
    }
    else if (!/^[a-zA-Z\s&'-]+$/.test(statutatoryInfo.readelegalname)) {
        // Example: allows letters, numbers, spaces, ampersands, apostrophes, and hyphens
        tempErrors.readelegalname = "Invalid Legal name";
    } else if (statutatoryInfo.readelegalname.length < 3) {
        // Example: ensuring trade name is at least 3 characters long
        tempErrors.readelegalname = "Legal Name must be at least 3 characters.";
    }

    // Door No
    if (!statutatoryInfo.tradedoorno.trim()) {
        tempErrors.tradedoorno = "Door No is required.";
    }
    else if (!/^[a-zA-Z0-9\s\.\,\-\/]+$/.test(statutatoryInfo.tradedoorno)) {
        // Example: checks for alphanumeric characters, spaces, and hyphens
        tempErrors.tradedoorno = "Invalid Door No format";
    }

    // Street
    if (!statutatoryInfo.tradestreet.trim()) {
        tempErrors.tradestreet = "Street is required.";
    }
    else if (!/^[a-zA-Z0-9\s,.-]+$/.test(statutatoryInfo.tradestreet)) {
        // Example: allows alphanumeric, spaces, commas, periods, and hyphens
        tempErrors.tradestreet = "Invaild Street Format";
    }

    // Area
    if (!statutatoryInfo.tradearea.trim()) {
        tempErrors.tradearea = "Area is required.";
    }
    else if (!/^[a-zA-Z0-9\s,.-]+$/.test(statutatoryInfo.tradearea)) {
        // Example: allows alphanumeric, spaces, commas, periods, and hyphens
        tempErrors.tradearea = "Invaild Area Format";
    }
    // State Code
    if (!statutatoryInfo.tradestatecode.trim()) {
        tempErrors.tradestatecode = "State Code is required.";
    } else if (!/^\d+$/.test(statutatoryInfo.tradestatecode)) {
        tempErrors.tradestatecode = "State Code must contain only numbers.";
    }
    else if (statutatoryInfo.tradestatecode.length > 2) {
        tempErrors.tradestatecode = "State Code must have Two numbers.";
    }


    // Pin Code
    if (!statutatoryInfo.tradepincode.trim()) {
        tempErrors.tradepincode = "Pin Code is required.";
    } else if (!/^\d{6}$/.test(statutatoryInfo.tradepincode)) {
        tempErrors.tradepincode = "Pin Code must be 6 digits.";
    }

    // Date Of Incorporation
    if (!statutatoryInfo.tradeDoI.trim()) {
        tempErrors.tradeDoI = "Date of Incorporation is required.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(statutatoryInfo.tradeDoI)) {
        tempErrors.tradeDoI = "Date of Incorporation must be in YYYY-MM-DD format.";
    }
    else {
        const enteredDate = new Date(statutatoryInfo.tradeDoI);
        const currentDate = new Date();

        // Set the time to midnight for both dates to avoid time discrepancies
        enteredDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (enteredDate > currentDate) {
            tempErrors.tradeDoI = "Date of Incorporation cannot be greater than today's date.";
        }
    }

    return tempErrors;
};
const validateBankingInfo = (BankingInfo, filesDatas, fileDatasUrl) => {
    let tempErrors = {};

    // A/C holder Name
    if (!BankingInfo.acholdername.trim()) {
        tempErrors.acholdername = "A/C holder Name is required.";
    }
    else if (!/^[a-zA-Z\s]+$/.test(BankingInfo.acholdername)) {
        
        // Example: allows only letters
        tempErrors.acholdername = "A/c holder name can only contain alphabets.";
    } else if (BankingInfo.acholdername.length < 3) {
        // Example: ensuring trade name is at least 3 characters long
        tempErrors.acholdername = "Trade Name must be at least 3 characters.";
    }

    // "A/c No
    if (!BankingInfo.acnumber.trim()) {
        tempErrors.acnumber = "A/c No is required.";
    } else if (!/^[a-zA-Z0-9\s&'-]+$/.test(BankingInfo.acnumber)) {
        // This regular expression checks for any character that is NOT a number, space, or hyphen
        tempErrors.acnumber = "A/c No cannot contain special characters.";
    }


    // "A/c type
    if (!BankingInfo.actype.trim()) {
        tempErrors.actype = "A/c type is required.";
    }

    // IFSC 
    if (!BankingInfo.ifsc.trim()) {
        tempErrors.ifsc = "IFSC is required.";
    }
    else if (!/^[a-zA-Z0-9\s&'-]+$/.test(BankingInfo.ifsc)) {
        // This regular expression checks for any character that is NOT a number, space, or hyphen
        tempErrors.ifsc = "IFSC cannot contain special characters.";
    }
    // Bank name
    if (!BankingInfo.bankname.trim()) {
        tempErrors.bankname = "Bank name is required.";
    }
    else if (!/^[a-zA-Z0-9\s&'-]+$/.test(BankingInfo.bankname)) {
        // This regular expression checks for any character that is NOT a number, space, or hyphen
        tempErrors.bankname = "Bank name cannot contain special characters.";
    }
    // Bank Branch
    if (!BankingInfo.bankbranchname.trim()) {
        tempErrors.bankbranchname = " Bank Branch is required.";
    }
    //Bank Address
    // console.log(fileDatasUrl.chequeFile)
    if (!BankingInfo.bankaddress.trim()) {
        tempErrors.bankaddress = "Bank Address is required.";
    }
    if (!filesDatas.chequeFile && !fileDatasUrl.chequeFile) {
        tempErrors.chequeFile = "Cancelled Cheque  is required.";
    }
    else if (filesDatas.chequeFile && filesDatas.chequeFile.type == 'application/pdf' && filesDatas.chequeFile.size > 300 * 1024) {
        // Check if the GST file is PDF and size is below 100 KB
        tempErrors.chequeFile = "cancelled cheque  size must be below 300 KB.";
    }
    // else if (fileDatasUrl.chequeFile?.endsWith(".pdf")||fileDatasUrl.chequeFile?.endsWith("blob")) {
    //     tempErrors.chequeFile = "Invalid Type.";
    // }

    return tempErrors;
};


const validateContactInfo = (contactInfo, filesDatas, fileDatasUrl) => {
    let tempErrors = {};

    // Owner details
    if (!contactInfo.owner.trim()) {
        tempErrors.owner = "Owner details Name is required.";
    }

    // Owner name
    if (!contactInfo.ownername.trim()) {
        tempErrors.ownername = "Owner name is required.";
    } else if (!/^[a-zA-Z\s.]+$/.test(contactInfo.ownername)) {
        tempErrors.ownername = "Owner name can only contain letters, spaces";
    }


    // Owner mobile
    if (!contactInfo.ownermobile.trim()) {
        tempErrors.ownermobile = "Owner mobile is required.";
    } else if (!/^\d+$/.test(contactInfo.ownermobile)) {
        tempErrors.ownermobile = "Mobile number must contain only numbers.";
    }

    else if (!/^\d{10}$/.test(contactInfo.ownermobile)) {
        tempErrors.ownermobile = "Mobile Number must be 10 digits.";
    }

    // Owner mail
    if (!contactInfo.owneremail.trim()) {
        tempErrors.owneremail = "Owner mail is required.";
    }
    else if (!/\S+@\S+\.\S+/.test(contactInfo.owneremail)) {
        tempErrors.owneremail = "Email is invalid.";
    }
    else if (/\.{2,}/.test(contactInfo.owneremail)) {
        tempErrors.owneremail = "Email should not contain consecutive dots.";
    }
    // Business details
    if (!contactInfo.businessoperation.trim()) {
        tempErrors.businessoperation = "Business details is required.";
    }
    //BO name
    if (!contactInfo.boname.trim()) {
        tempErrors.boname = " BO name is required.";
    }
    else if (!/^[a-zA-Z\s.]+$/.test(contactInfo.boname)) {
        tempErrors.boname = " BO can only contain letters, spaces";
    }
    //Bo mobile
    if (!contactInfo.bomobile.trim()) {
        tempErrors.bomobile = "Bo mobile is required.";
    }
    else if (!/^\d{10}$/.test(contactInfo.bomobile)) {
        tempErrors.bomobile = "Mobile Number must be 10 digits.";
    }
    if (!contactInfo.boemail.trim()) {
        tempErrors.boemail = "Bo mail is required.";
    }

    else if (!/\S+@\S+\.\S+/.test(contactInfo.boemail)) {
        tempErrors.boemail = "Email is invalid.";
    }
    else if (/\.{2,}/.test(contactInfo.boemail)) {
        tempErrors.boemail = "Email should not contain consecutive dots.";
    }

    // Street
    if (!contactInfo.accounts.trim()) {
        tempErrors.accounts = "Accounts Details is required.";
    }
    else if (!/^[a-zA-Z\s.]+$/.test(contactInfo.accounts)) {
        tempErrors.accounts = " Accounts should only contain letters, spaces";
    }
    // Area
    if (!contactInfo.accname.trim()) {
        tempErrors.accname = "Acc name is required.";
    }
    else if (!/^[a-zA-Z\s.]+$/.test(contactInfo.accname)) {
        tempErrors.accname = " Accounts should only contain letters, spaces";
    }
    if (!contactInfo.accmobile.trim()) {
        tempErrors.accmobile = " Ac mobile is required.";
    }
    else if (!/^\d{10}$/.test(contactInfo.accmobile)) {
        tempErrors.accmobile = "Mobile Number must be 10 digits.";
    }
    if (!contactInfo.accemail.trim()) {
        tempErrors.accemail = "Ac mail is required.";
    }
    else if (!/\S+@\S+\.\S+/.test(contactInfo.accemail)) {
        tempErrors.accemail = "Email is invalid.";
    }
    else if (/\.{2,}/.test(contactInfo.accemail)) {
        tempErrors.accemail = "Email should not contain consecutive dots.";
    }
    if (!filesDatas.ownerFile&&!fileDatasUrl.ownerFile) {
        tempErrors.ownerFile = "Owner's Cards  is required.";
    }
    else if (filesDatas.ownerFile && filesDatas.ownerFile.type == 'application/pdf' && filesDatas.ownerFile.size > 300 * 1024) {
        // Check if the GST file is PDF and size is below 100 KB
        tempErrors.ownerFile = "PDF  size must be below 300 KB.";
    }
    // else if (fileDatasUrl.ownerFile?.endsWith(".pdf")) {
    //     // Check if the GST file is PDF and size is below 100 KB
    //     tempErrors.ownerFile = "Invalid Type";
    // }
    if (!filesDatas.boFile&&!fileDatasUrl.boFile) {
        tempErrors.boFile = "Business Operation Cards  is required.";
    }
    else if (filesDatas.boFile && filesDatas.boFile.type == 'application/pdf' && filesDatas.boFile.size > 300 * 1024) {
        // Check if the GST file is PDF and size is below 100 KB
        tempErrors.boFile = "PDF  size must be below 300 KB.";
    }
    // else if (fileDatasUrl.boFile?.endsWith(".pdf")) {
    //     // Check if the GST file is PDF and size is below 100 KB
    //     tempErrors.boFile = "Invalid Type";
    // }
    if (!filesDatas.accountsFile&&!fileDatasUrl.accountsFile) {
        tempErrors.accountsFile = "Accounts card  is required.";
    }
    else if (filesDatas.accountsFile && filesDatas.accountsFile.type == 'application/pdf' && filesDatas.accountsFile.size > 300 * 1024) {
        // Check if the GST file is PDF and size is below 100 KB
        tempErrors.accountsFile = "PDF  size must be below 300 KB.";
    }
    // else if (fileDatasUrl.accountsFile?.endsWith(".pdf")) {
    //     // Check if the GST file is PDF and size is below 100 KB
    //     tempErrors.accountsFile = "Invalid Type";
    // }
    return tempErrors;
};
// const validateBusinessInfo = (BusinessInfo) => {
//     let tempErrors = {};


//     if (!BusinessInfo.natureOfBusiness.trim()) {
//         tempErrors.natureOfBusiness = "Nature of business is required.";
//     }


//     if (!BusinessInfo.authDistributor.trim()) {
//         tempErrors.authDistributor = "Auth Distributor is required.";
//     }
//     if (!BusinessInfo.retailJeweller.trim()) {
//         tempErrors.retailJeweller = "Retail jeweller is required.";
//     }
//     // if (!BusinessInfo.maincatogory.trim()) {
//     //     tempErrors.maincatogory = "Main Catogory  is required.";
//     // }
//     // if (!BusinessInfo.tradeMetals.trim()) {
//     //     tempErrors.tradeMetals = "Trade Metals is required.";
//     // }

const validateHallmarkInfo = (hallmarkInfo, filesDatas, fileDatasUrl) => {
    let tempErrors = {};

    // BIS License Number
    if (!hallmarkInfo.bisLicenseNo?.trim()) {
        tempErrors.bisLicenseNo = "BIS License Number is required.";
    } else if (!/^[A-Z0-9]+$/i.test(hallmarkInfo.bisLicenseNo)) {
        tempErrors.bisLicenseNo = "BIS License Number can only contain letters and numbers.";
    }

    // Certificate Valid From
    if (!hallmarkInfo.certificateValidFrom?.trim()) {
        tempErrors.certificateValidFrom = "Certificate Valid From date is required.";
    } else {
        const validFromDate = new Date(hallmarkInfo.certificateValidFrom);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (validFromDate > currentDate) {
            tempErrors.certificateValidFrom = "Certificate Valid From date cannot be in the future.";
        }
    }

    // Certificate Valid To
    if (!hallmarkInfo.certificateValidTo?.trim()) {
        tempErrors.certificateValidTo = "Certificate Valid To date is required.";
    } else {
        const validToDate = new Date(hallmarkInfo.certificateValidTo);
        const validFromDate = new Date(hallmarkInfo.certificateValidFrom);

        if (validToDate <= validFromDate) {
            tempErrors.certificateValidTo = "Certificate Valid To date must be after Valid From date.";
        }
    }

    // Insurance
    if (!hallmarkInfo.hasInsurance?.trim()) {
        tempErrors.hasInsurance = "Insurance selection is required.";
    }

    // Validate insurance-related fields if insurance is "Yes"
    if (hallmarkInfo.hasInsurance === "Yes") {
        // Insurance Company
        if (!hallmarkInfo.insuranceCompany?.trim()) {
            tempErrors.insuranceCompany = "Insurance Company name is required.";
        } else if (!/^[a-zA-Z\s&'.,-]+$/.test(hallmarkInfo.insuranceCompany)) {
            tempErrors.insuranceCompany = "Insurance Company name can only contain letters, spaces, and basic punctuation.";
        }

        // Insurance Amount
        if (!hallmarkInfo.insuranceAmount) {
            tempErrors.insuranceAmount = "Insurance Amount is required.";
        } else if (isNaN(hallmarkInfo.insuranceAmount) || hallmarkInfo.insuranceAmount <= 0) {
            tempErrors.insuranceAmount = "Insurance Amount must be a positive number.";
        }

        // Policy Start Date
        if (!hallmarkInfo.policyStartDate?.trim()) {
            tempErrors.policyStartDate = "Policy Start Date is required.";
        }

        // Policy End Date
        if (!hallmarkInfo.policyEndDate?.trim()) {
            tempErrors.policyEndDate = "Policy End Date is required.";
        } else {
            const startDate = new Date(hallmarkInfo.policyStartDate);
            const endDate = new Date(hallmarkInfo.policyEndDate);

            if (endDate <= startDate) {
                tempErrors.policyEndDate = "Policy End Date must be after Start Date.";
            }
        }

        // Endorsement Date
        if (!hallmarkInfo.endorsementDate?.trim()) {
            tempErrors.endorsementDate = "Endorsement Effective Date is required.";
        } else {
            const endorsementDate = new Date(hallmarkInfo.endorsementDate);
            const startDate = new Date(hallmarkInfo.policyStartDate);
            const endDate = new Date(hallmarkInfo.policyEndDate);

            if (endorsementDate < startDate || endorsementDate > endDate) {
                tempErrors.endorsementDate = "Endorsement Date must be between Policy Start and End dates.";
            }
        }
    }

    // File Validations
    // BIS Certificate
    if (!filesDatas.bisFile && !fileDatasUrl.bisFile) {
        tempErrors.bisFile = "BIS Certificate file is required.";
    } else if (
        filesDatas.bisFile && 
        filesDatas.bisFile.type === 'application/pdf' && 
        filesDatas.bisFile.size > 300 * 1024
    ) {
        tempErrors.bisFile = "BIS Certificate file size must be below 300 KB.";
    }

    // Insurance Document (only if insurance is "Yes")
    if (hallmarkInfo.hasInsurance === "Yes") {
        if (!filesDatas.insuranceFile && !fileDatasUrl.insuranceFile) {
            tempErrors.insuranceFile = "Insurance Document is required.";
        } else if (
            filesDatas.insuranceFile && 
            filesDatas.insuranceFile.type === 'application/pdf' && 
            filesDatas.insuranceFile.size > 300 * 1024
        ) {
            tempErrors.insuranceFile = "Insurance Document file size must be below 300 KB.";
        }
    }

    // Hallmark Quotation
    if (!filesDatas.quotationFile && !fileDatasUrl.quotationFile) {
        tempErrors.quotationFile = "Hallmark Quotation file is required.";
    } else if (
        filesDatas.quotationFile && 
        filesDatas.quotationFile.type === 'application/pdf' && 
        filesDatas.quotationFile.size > 300 * 1024
    ) {
        tempErrors.quotationFile = "Hallmark Quotation file size must be below 300 KB.";
    }

    // Authorized Person Details
    if (!filesDatas.authPersonFile && !fileDatasUrl.authPersonFile) {
        tempErrors.authPersonFile = "Authorized Person Details file is required.";
    } else if (
        filesDatas.authPersonFile && 
        filesDatas.authPersonFile.type === 'application/pdf' && 
        filesDatas.authPersonFile.size > 300 * 1024
    ) {
        tempErrors.authPersonFile = "Authorized Person Details file size must be below 300 KB.";
    }

    return tempErrors;
};


//     return tempErrors;
// };
const validateTradeInfo = (BusinessInfo) => {
    let tempErrors = {};

    if (!BusinessInfo.maincatogory.trim()) {
        tempErrors.maincatogory = "Main Catogory  is required.";
    }
    // if (BusinessInfo.tradeMetals.length===0) {
    //     tempErrors.tradeMetals = "Trade Metals is required.";
    // }   

    return tempErrors;
};
export { validate, validateStatutoryInfo, validateBankingInfo, validateContactInfo,  validateTradeInfo,validateHallmarkInfo }
//validateBusinessInfo