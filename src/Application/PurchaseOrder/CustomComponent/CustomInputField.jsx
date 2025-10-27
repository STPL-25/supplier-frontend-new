import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function CustomInputField({
  field,
  label,
  require = false,
  view = true,
  type = "text",
  options = [],
  input = true,
  className,
  disabled = false,
  value,
  onChange,
  optionsData = {},
  error,
  placeholder,
  maxLength,
  show = true,
  ...props
}) {
  if (label === "S.No") {
    return null;
  }

  const getOptionsArray = () => {
    if (typeof options === "string") {
      return optionsData[options] || [];
    }
    return Array.isArray(options) ? options : [];
  };

  const optionsArray = getOptionsArray();

  // Helper function to handle change events and extract values properly
  const handleChange = (eventOrValue) => {
    let actualValue;

    // Check if it's an event object
    if (eventOrValue && eventOrValue.target) {
      actualValue = eventOrValue.target.value;
    } else {
      // Direct value (from Select, Switch, Checkbox)
      actualValue = eventOrValue;
    }

    onChange(actualValue);
  };

  const renderInput = () => {
    const inputType = type.toLowerCase();

    switch (inputType) {
      case "textarea":
        return (
          <Textarea
            name={field}
            className={cn(className, error && "border-red-500")}
            disabled={disabled}
            rows={3}
            placeholder={placeholder}
            value={value || ""}
            onChange={handleChange}
            required={require}
            {...props}
          />
        );

      case "select":
        return (
          <Select
            name={field}
            value={typeof value === "object" ? value?.value || "" : value || ""}
            onValueChange={onChange}
            disabled={disabled}
            required={require}
          >
            <SelectTrigger className={cn(className, error && "border-red-500")}>
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {optionsArray.map((option, index) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <Checkbox
            name={field}
            checked={value}
            onCheckedChange={onChange}
            disabled={disabled}
            className={cn(className)}
            {...props}
          />
        );

      case "switch":
        return (
          <Switch
            name={field}
            checked={value}
            onCheckedChange={onChange}
            disabled={disabled}
            className={cn(className)}
            {...props}
          />
        );

      case "number":
        return (
          <Input
            name={field}
            type="number"
            placeholder={placeholder}
            className={cn(className, error && "border-red-500")}
            disabled={disabled}
            value={value || ""}
            onChange={(e) => {
              const newValue = e.target.value;
              // Limit number of digits
              if (maxLength && newValue.length <= maxLength) {
                handleChange(e);
              } else if (!maxLength) {
                handleChange(e);
              }
            }}
            required={require}
            {...props}
          />
        );

      case "email":
        return (
          <Input
            name={field}
            type="email"
            placeholder={placeholder}
            className={cn(className, error && "border-red-500")}
            disabled={disabled}
            value={value || ""}
            onChange={handleChange}
            required={require}
            {...props}
          />
        );

      case "date":
        return (
          <Input
            name={field}
            type="date"
            className={cn(className, error && "border-red-500")}
            disabled={disabled}
            value={value || ""}
            onChange={handleChange}
            required={require}
            {...props}
          />
        );

      case "file":
      case "upload":
        return (
          <div className="space-y-2">
            <Input
              name={field}
              type="file"
              accept="image/*"
              multiple
              className={cn(className, error && "border-red-500")}
              disabled={disabled}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(files);
              }}
              required={require}
              {...props}
            />
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {file.name || `Image ${idx + 1}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "camera":
      case "capture":
        return (
          <div className="space-y-2">
            <Input
              name={field}
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              className={cn(className, error && "border-red-500")}
              disabled={disabled}
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                onChange(files);
              }}
              required={require}
              {...props}
            />
            {value && Array.isArray(value) && value.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.map((file, idx) => (
                  <div key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {file.name || `Captured Image ${idx + 1}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <Input
            name={field}
            type="text"
            placeholder={placeholder}
            className={cn(className, error && "border-red-500")}
            disabled={disabled}
            value={value || ""}
            maxLength={maxLength}
            onChange={handleChange}
            required={require}
            {...props}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={field}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          require && "after:content-['*'] after:text-red-500 after:ml-1"
        )}
      >
        {label}
      </Label>

      <div className="space-y-1">
        {renderInput()}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}