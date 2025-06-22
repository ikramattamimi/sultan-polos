import React from 'react';
import {Link} from "react-router-dom";
import {formatPrice} from "../../common.js";

const CardConvection = ({convection : {id, name, category, purchase_price, stock}}) => {
  return (
    // <div>
      <div className="card bg-white p-0 min-w-[250px] max-w-1/2">
        <div className="p-4">
          <span className="p-1 rounded-sm bg-gray-200 text-gray-500 text-sm">{category}</span>
          <Link to={id?.toString()}>
            <h3 className="text-lg font-bold mt-3">{name}</h3>
          </Link>
          <h3 className="dark:text-gray-400">{ formatPrice(purchase_price) }</h3>

          {/*<p className="mt-5 flex gap-2 text-sm">*/}
          {/*  <span className="p-1 rounded-sm bg-red-200 text-red-500">{color}</span>*/}
          {/*  <span className="p-1 rounded-sm bg-yellow-200 text-yellow-500">Kuning</span>*/}
          {/*  <span className="p-1 rounded-sm bg-green-200 text-green-500">Hijau</span>*/}
          {/*</p>*/}
        </div>

        <hr className="border-gray-200"/>

        <div className="p-4 font-medium text-gray-500">
          Stock: { stock }
        </div>
      </div>
    // </div>
  );
};

export default CardConvection;