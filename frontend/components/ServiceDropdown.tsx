// import React from "react";
// import { IService } from "@/redux/types";

// interface ServiceDropdownProps {
//   services: IService[];
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   index: number;
// }

// const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
//   services,
//   value,
//   onChange,
//   index,
// }) => {
//   return (
//     <select
//       name={`service-${index}`}
//       value={value}
//       onChange={onChange}
//       className="border p-2 rounded flex-1"
//       required
//     >
//       <option value="">Select Service</option>
//       {services.map((service) => (
//         <option key={service._id} value={service._id}>
//           {service.name}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default ServiceDropdown;

// src/components/ServiceDropdown.tsx

import React from "react";

// Define the IService interface
interface IService {
  _id: string;
  name: string;
}

// Define the props for ServiceDropdown
interface ServiceDropdownProps {
  services: IService[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  index: number;
  disabledServices?: string[]; // Optional prop to disable specific services
}

const ServiceDropdown: React.FC<ServiceDropdownProps> = ({
  services,
  value,
  onChange,
  index,
  disabledServices = [], // Default to an empty array if not provided
}) => {
  return (
    <select
      name="service"
      value={value}
      onChange={onChange}
      className="border p-2 rounded flex-1"
      required
    >
      <option value="">Select Service</option>
      {services.map((service) => (
        <option
          key={service._id}
          value={service._id}
          disabled={disabledServices.includes(service._id)}
        >
          {service.name}
        </option>
      ))}
    </select>
  );
};

export default ServiceDropdown;
