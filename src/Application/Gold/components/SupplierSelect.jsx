import Select from 'react-select';

const SupplierSelect = ({ selectedSupplier, setSelectedSupplier, suppliers ,label='Supplier',id='supplier'}) => {
  const options = suppliers?.map((supplier) => ({
    value: supplier,
    label: supplier,
  }));

  const handleChange = (selectedOption) => {
    setSelectedSupplier(selectedOption ? selectedOption.value : '');
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Select
        id={id}
        options={options}
        value={options.find((opt) => opt.value === selectedSupplier)}
        onChange={handleChange}
        isClearable
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
};
export default SupplierSelect;