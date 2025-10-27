import { button } from "@material-tailwind/react";

 export  const HeaderData = [
    {
        title: "Supplier Information",
        fields: {
            'Supplier Category':'supplierCategory',
            'Company Name': "companyname",
            'Door No': "doorno",
            'Street': "street",
            'Pin Code': "pincode",
            'Area': "area",
            'Taluk': "taluk",
            'City': "city",
            'State': "state",
            'Mobile': "mobilenumber",
            'Email': "email",
            'Owner/Authorized Representative Name': "propritorname",
            'Organization': "organization",
            'Reg Under MSME': "regUnderMsme",
            'MSME No': "msmeNo",
            'PAN': "pan",
            'GST No': "gst",
            'GST file ':"gstFile",
            'PAN file':"panFile",
            "MSME file":"msmeFile"
        },
        
    },
    {
        title: "Statutory Information",
        fields: {
            'Trade Name': 'tradename',
            'Legal Name': "readelegalname",
            'Trade Door No': "tradedoorno",
            'Trade Street': "tradestreet",
            'Trade Area': "tradearea",
            'State Code': "tradestatecode",
            'Trade Pin Code': "tradepincode",
            'Date Of Incorporation': "tradeDoI",
        }
    },
    {
        title: "Banking Information",
        fields: {
            'A/c Holder Name': "acholdername",
            'A/c Number': "acnumber",
            'A/c Type': "actype",
            'IFSC': "ifsc",
            'Bank Name': "bankname",
            'Bank Branch Name': "bankbranchname",
            'Bank Address': "bankaddress",
            'Cancelled Cheque':"chequeFile"
        }
    },
    {
        title: "Contact Information",
        fields: {
            'Owner': "owner",
            'Owner Name': "ownername",
            'Owner Mobile': "ownermobile",
            'Owner E-Mail': "owneremail",
            'Business Operations': "businessoperation",
            'BO Name': "boname",
            'BO Mobile': "bomobile",
            'BO E-Mail': "boemail",
            'Accounts': "accounts",
            'Accounts Name': "accname",
            'Accounts Mobile': "accmobile",
            'Accounts E-Mail': "accemail",
            [`${"Owner"} Card`]: "ownerFile",
            [`${"Business Operatior"} Card`]: "boFile",
            [`${"Accounts "} Card`]: "accountsFile"
        }
    },
    {
        title: "Hallmark Information",
        fields: {
            'Bis No': "bisLicenseNo",
            'Valid From': "certificateValidFrom",
            'Valid To': "certificateValidTo",
            'Has Insurance': "hasInsurance",
            'Insurance Company':'insurance_company',
            'Insurance Amount': "insuranceAmount",
            'Policy Start Date': "policyStartDate",
            'Policy Endrosement Date': "endorsementDate",
            'Policy End Date': "policyEndDate",
            'Bis File': "bisFile",
            'Insurance File': "insuranceFile",
            'Quotation File': "quotationFile",
            'Auth Person Details': "authPersonFile",
          
        }
    },
    {
        title: "Business Information",
        fields: {
            // 'Nature of Business / Trade': "natureOfBusiness",
            // 'Authorized Distributor': "authDistributor",
            // 'Retail Jeweller': "retailJeweller",
            'Categories': "maincatogory",
            // 'Trade Catagories':"tradeMetals"
        }
    }
];