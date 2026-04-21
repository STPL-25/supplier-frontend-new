import { CustomInputField } from "../CustomComponent/CustomInputField";
import poFields from "../FieldDatas/FieldsDatas";
import { useContext, useRef, useState, useCallback, useEffect } from "react";
import { DashBoardContext } from "../../../DashBoardContext/DashBoardContext";
import { PhotoCapture } from "../../Gold/components/InputComp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicTable from "../CustomComponent/DynamicTables";

const PoEntryPage = () => {
  const { userRole } = useContext(DashBoardContext);

  // Enhanced form state management
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoCaptureRef = useRef(null);

  // Get fields based on user role and form data
  const fields = poFields(userRole, formData);
  const initialDatas = [
    {
      sno: 1,
      product: "Gold",
      productName: "Ring",
      pieces: 2,
      grossWt: 10.5,
      diacent: 0.5,
      stoneWt: 0.2,
      stoneCost: 5000,
      waxWt: 0.1,
      netWt: 10.2,
      pureWt: 9.5,
      amount: 50000,
      mc: 2000,
    },
    {
      sno: 2,
      product: "Diamond",
      productName: "Necklace",
      pieces: 1,
      grossWt: 25.3,
      diacent: 2.5,
      stoneWt: 1.5,
      stoneCost: 150000,
      waxWt: 0.3,
      netWt: 23.5,
      pureWt: 22.0,
      amount: 350000,
      mc: 15000,
    },
  ];
  const [initialData,setInitialData]= useState(initialDatas)
  // useEffect(()=>{
  //   setInitialData((prev)=>({...prev,formData}))
  // },[JSON.toString(formData)])

  // Enhanced photo capture handler
  const handlePhotoCapture = useCallback(
    async (file, capturedImage, setCapturedImage) => {
      try {
        if (file) {
          // Add your compression logic here
          // const compressedImage = await compressAndConvertToJPG(file);
          const compressedImage = file; // Placeholder

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
        // console.error("Photo capture error:", error);
        setFormData((prev) => ({
          ...prev,
          photo: file,
        }));
      }
    },
    []
  );

  // Universal form handler for all field types
  const handleFieldChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: null,
        }));
      }
    },
    [errors]
  );

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setInitialData((prev) => [...prev, formData]);
    setFormData({})
    setIsSubmitting(true);

    try {
      // Add your form submission logic here
      // console.log("Form submitted:", initialData);

      // Reset form after successful submission if needed
      // setFormData({});
    } catch (error) {
      // console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // console.log(initialData);

  return (
    <div className="min-h-screen bg-gray-50/30 p-2 sm:p-2 lg:p-3">
      <div className="mx-auto ">
        {/* Header Section */}
        <div className="mb-2 ">
          <h1 className="text-xl font-bold text-gray-900 sm:text-xl">
            Purchase Order Entry
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Supplier Selection Card */}
          <Card className="shadow-sm mb-2">
            <CardContent>
              <div className="max-w-md">
                <CustomInputField
                  field="supplierName"
                  label="Select Supplier"
                  type="select"
                  options={[
                    { label: "Supplier 1", value: "supplier1" },
                    { label: "Supplier 2", value: "supplier2" },
                  ]}
                  require={true}
                  value={formData.supplierName || ""}
                  onChange={(value) => handleFieldChange("supplierName", value)}
                  error={errors.supplierName}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Details Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {fields && fields.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                  {fields
                    .filter((field) => field.input)
                    .map((field) => (
                      <div
                        key={field.id || field.field}
                        className={`
                          ${
                            field.field === "photo" || field.field === "image"
                              ? "col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                              : ""
                          }
                          ${
                            field.type === "textarea"
                              ? "col-span-1 sm:col-span-2"
                              : ""
                          }
                        `}
                      >
                        {field.field === "photo" || field.field === "image" ? (
                          <div className="space-y-2">
                            {/* <label className="text-sm font-medium text-gray-900">
                              Product Photo
                              {field.require && (
                                <span className="ml-1 text-red-500">*</span>
                              )}
                            </label> */}
                            <div className="">
                              <PhotoCapture
                                ref={photoCaptureRef}
                                onPhotoCapture={handlePhotoCapture}
                                photoUrl={
                                  formData.photo ? formData.photo : null
                                }
                              />
                            </div>
                          </div>
                        ) : (
                          <CustomInputField
                            field={field.field}
                            label={field.label}
                            type={field.type}
                            options={field.options}
                            require={field.require}
                            value={formData[field.field] || ""}
                            onChange={(value) =>
                              handleFieldChange(field.field, value)
                            }
                            error={errors[field.field]}
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="mx-auto max-w-sm">
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">
                      No fields available
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Please select a valid user role to display form fields.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setFormData({})}
                >
                  Clear Form
                </Button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Order"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
        <DynamicTable
          fields={fields}
          initialData={initialData}
          title="Product Management"
          // selectOptions={{
          //   product: productOptions
          // }}
          // onDataChange={handleDataChange}
        />
      </div>
    </div>
  );
};

export default PoEntryPage;
