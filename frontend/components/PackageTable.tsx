import React from "react";
import { IPackage } from "@/redux/types";
import ActionButton from "./ActionButton";

interface PackageTableProps {
  packages: IPackage[];
  handleEdit: (pkg: IPackage) => void;
  handleDelete: (id: string) => void;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages,
  handleEdit,
  handleDelete,
}) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <th className="py-2">Name</th>
          <th className="py-2">Description</th>
          <th className="py-2">Services</th>
          <th className="py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {packages.map((pkg) => {
          // Check if the package has no services or all services are invalid
          const isPackageEmpty =
            pkg.services.length === 0 ||
            pkg.services.every((s) => s.service === null);

          return (
            <tr
              key={pkg._id}
              className={`text-center ${
                isPackageEmpty ? "bg-gray-200 text-gray-500" : ""
              }`}
            >
              <td className="py-2">{pkg.name}</td>
              <td className="py-2">{pkg.description}</td>
              <td className="py-2">
                {isPackageEmpty ? (
                  <span className="text-gray-500">No services available</span>
                ) : (
                  <ul>
                    {pkg.services.map((s, index) => (
                      <li key={index}>
                        {s.service
                          ? s.service.name
                          : "Service no longer exists"}
                      </li>
                    ))}
                  </ul>
                )}
              </td>
              <td className="py-2">
                {/* Edit and Delete buttons retain their original styling */}
                <ActionButton
                  onClick={() => handleEdit(pkg)}
                  label="Edit"
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                />
                <ActionButton
                  onClick={() => handleDelete(pkg._id)}
                  label="Delete"
                  className="bg-red-500 text-white px-2 py-1 rounded"
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default PackageTable;
