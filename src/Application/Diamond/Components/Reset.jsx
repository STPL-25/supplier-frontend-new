import { useContext } from 'react';
import { DiamondContext } from "../DiamondGridContext/DiamondGridContext"; // Import your context
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ToastContainer, toast } from 'react-toastify';

function Reset() {
    const { resetFields } = useContext(DiamondContext)
    return (
        <div className="combination-submit-button flex">
            <button type="button" className="combination-submit-button text-black bg-blue-500 hover:bg-blue-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2" onClick={resetFields}>Reset</button>

        </div>
    );
}

export default Reset;