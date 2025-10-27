import { useContext } from 'react';
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext";

const Submit = () => {
    const { handleSubmit, resetFields } = useContext(DiamondContext);
    
    return (
        <div className="fixed top-[12%] right-0 p-4  shadow-lg z-50">
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={resetFields}
                    className="px-4 py-2 text-sm font-medium text-black bg-gray-500 rounded-lg hover:bg-black-400 transition-colors"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-black bg-blue-500 rounded-lg hover:bg-blue-400 transition-colors"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Submit;