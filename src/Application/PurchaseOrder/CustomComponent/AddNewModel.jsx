import React, { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomInputField } from "../AdditionalComponent/CustomInputField";
import { useAppState } from "@/states/hooks/useAppState";
const AddNewModal = ({
  isOpen,  onClose,  headers,  onSave,  isLoading = false,  initialData = null,  isEditMode = false,  master = null, }) => {
  const { formData, setFormData } = useAppState();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const newFormData = {};
      headers.forEach((header) => {
        if (header.field !== "Sno" && header.field !== "actions") {
          newFormData[header.field] = "";
        }
      });
      setFormData(newFormData);
      setErrors({});
    }
  }, []); 

  const handleInputChange = (field, value) => {
 
    const updatedFormData = {
      ...formData,
      [field]: value,
    };
    setFormData(updatedFormData);

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSave = async (formData, master) => {
    try {
      await onSave(formData, master);
      onClose();
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-6xl max-h-[90vh] overflow-hidden"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {master?.replace(/([a-z])([A-Z])/g, "$1 $2")} Entry
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {headers
              .filter(
                (header) =>
                  header.field !== "Sno" &&
                  header.field !== "actions" &&
                  header.input !== false
              )
              .map((header, index) => (
                <CustomInputField
                  key={index}
                  field={header.field}
                  label={header.label}
                  type={header.type || header.inputType || "text"}
                  options={header.options || []}
                  value={formData ? formData[header.field] || "" : ""}
                  onChange={(e) => {
                    const value =
                      e?.target?.value !== undefined ? e.target.value : e;
                    handleInputChange(header.field, value);
                  }}
                  error={errors[header.field]}
                  disabled={isLoading}
                />
              ))}
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setFormData({});
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button onClick={() => handleSave(formData, master)}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewModal;
