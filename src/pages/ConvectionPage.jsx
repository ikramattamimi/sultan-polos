import {useLoaderData, useNavigate} from "react-router-dom";
import CardConvection from "../components/convections/CardConvection.jsx";
import { FaPlus } from "react-icons/fa6";

const ConvectionPage = () => {

  const { convections } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="mb-6">Convection</h1>
        
      <button
        className="bg-blue-500 hover:bg-blue-600 mb-4 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors"
        onClick={() => navigate('/inventory/create')}
      >
        <div className="flex items-center">
          <FaPlus className="mr-2"/><span>Tambah Convection</span>
        </div>
      </button>

      <div className="me-10 flex gap-5 flex-wrap">

        {convections.map((item) => (
          <CardConvection key={item.id} convection={item} />
        ))}

      </div>
    </div>
  );
};

export default ConvectionPage;