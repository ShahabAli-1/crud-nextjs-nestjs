"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  fetchPackages,
  createPackage,
  updatePackage,
  deletePackage,
} from "../../redux/packages/packagesSlice";
import { fetchServices } from "@/redux/services/serviceSlice";
import { IPackage, IPackageInput } from "../../redux/types";
import { toast } from "react-toastify";
import ActionButton from "@/components/ActionButton";
import FormField from "@/components/FormField";
import ServiceDropdown from "@/components/ServiceDropdown";
import PackageTable from "@/components/PackageTable";

interface FormService {
  service: string; // Service ID
  quantity: number;
}

const PackagesPage = () => {
  const dispatch = useAppDispatch();
  const {
    packages,
    fetchStatus,
    fetchError,
    createStatus,
    createError,
    updateStatus,
    updateError,
    deleteStatus,
    deleteError,
  } = useAppSelector((state) => state.packages);
  const { services } = useAppSelector((state) => state.services);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    services: FormService[];
  }>({
    name: "",
    description: "",
    services: [],
  });

  const [formErrors, setFormErrors] = useState<{
    name: string | null;
    description: string | null;
    services: string | null;
  }>({
    name: null,
    description: null,
    services: null,
  });

  const [editingPackage, setEditingPackage] = useState<IPackage | null>(null);

  useEffect(() => {
    if (fetchStatus === "idle") {
      dispatch(fetchPackages());
    }
  }, [fetchStatus, dispatch]);

  useEffect(() => {
    if (services.length === 0) {
      dispatch(fetchServices());
    }
  }, [dispatch, services.length]);

  const handleServiceChange = (
    index: number,
    field: keyof FormService,
    value: string
  ) => {
    const updatedServices = [...formData.services];
    if (field === "quantity") {
      updatedServices[index][field] = parseInt(value) || 1;
    } else {
      updatedServices[index][field] = value;
    }
    setFormData({ ...formData, services: updatedServices });
    setFormErrors({ ...formErrors, services: null }); // Reset error when a service is changed
  };

  const addServiceField = () => {
    if (selectedServiceIds.length >= services.length) {
      toast.error("You Have Selected All Available Services.");
    } else {
      setFormData({
        ...formData,
        services: [...formData.services, { service: "", quantity: 1 }],
      });
    }
  };

  const removeServiceField = (index: number) => {
    const updatedServices = [...formData.services];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormErrors({ ...formErrors, [e.target.name]: null }); // Reset error when typing
  };

  const validateForm = () => {
    const errors: {
      name: string | null;
      description: string | null;
      services: string | null;
    } = {
      name: null,
      description: null,
      services: null,
    };

    if (!formData.name.trim()) {
      errors.name = "Package name can't be empty.";
    }

    if (!formData.description.trim()) {
      errors.description = "Description can't be empty.";
    }

    if (formData.services.length === 0) {
      errors.services = "At least one service must be added.";
    } else {
      const serviceIds = formData.services.map((s) => s.service);
      const uniqueServiceIds = new Set(serviceIds);
      if (uniqueServiceIds.size !== serviceIds.length) {
        errors.services = "Each service can be selected only once.";
      }

      formData.services.forEach((s, index) => {
        if (!s.service) {
          errors.services = `Service ${index + 1} is not selected.`;
        }
      });
    }

    setFormErrors(errors);

    // Return true if there are no errors
    return !errors.name && !errors.description && !errors.services;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return; // Don't submit if validation fails
    }

    const packageData: IPackageInput = {
      name: formData.name,
      description: formData.description,
      services: formData.services.map((s) => ({
        service: s.service,
        quantity: s.quantity,
      })),
    };

    if (editingPackage) {
      dispatch(
        updatePackage({
          id: editingPackage._id,
          data: packageData,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Package updated successfully!");
          setEditingPackage(null);
          dispatch(fetchPackages());
        })
        .catch((error: string) => {
          if (error.includes("already exists")) {
            toast.error("Package with this name already exists.");
          } else if (error.includes("cannot be added multiple times")) {
            toast.error(
              "A service cannot be added multiple times to a package."
            );
          } else {
            toast.error(error || "Failed to update package.");
          }
        });
    } else {
      dispatch(createPackage(packageData))
        .unwrap()
        .then(() => {
          toast.success("Package created successfully!");
          dispatch(fetchPackages());
        })
        .catch((error: string) => {
          if (error.includes("already exists")) {
            toast.error("Package with this name already exists.");
          } else if (error.includes("cannot be added multiple times")) {
            toast.error(
              "A service cannot be added multiple times to a package."
            );
          } else {
            toast.error(error || "Failed to create package.");
          }
        });
    }
    setFormData({ name: "", description: "", services: [] });
  };

  const handleEdit = (pkg: IPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      services: pkg.services
        .filter((s) => s.service !== null) // Only include valid services
        .map((s) => ({
          service: s.service ? s.service._id : "", // Provide a default value for invalid services
          quantity: s.quantity,
        })),
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      dispatch(deletePackage(id))
        .unwrap()
        .then(() => {
          dispatch(fetchPackages());
          toast.success("Package deleted successfully!");
        })
        .catch((error: string) => {
          toast.error(error || "Failed to delete package.");
        });
    }
  };

  let content;

  if (fetchStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (fetchStatus === "succeeded") {
    content = (
      <PackageTable
        packages={packages}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    );
  } else if (fetchStatus === "failed") {
    content = <p className="text-red-500">Error: {fetchError}</p>;
  }

  // Get a list of already selected service IDs to prevent duplicates
  const selectedServiceIds = formData.services.map((s) => s.service);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Packages</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col space-y-4">
          <FormField
            label="Package Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter package name"
            required
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm">{formErrors.name}</p>
          )}
          <FormField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            type="textarea"
            placeholder="Enter package description"
            required
          />
          {formErrors.description && (
            <p className="text-red-500 text-sm">{formErrors.description}</p>
          )}
          <div>
            <h2 className="text-xl font-semibold mb-2">Services</h2>
            {formData.services.map((s, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <ServiceDropdown
                  services={services}
                  value={s.service}
                  onChange={(e) =>
                    handleServiceChange(index, "service", e.target.value)
                  }
                  index={index}
                  // Disable already selected services except for the current one
                  disabledServices={selectedServiceIds.filter(
                    (id) => id !== s.service
                  )}
                />
                <FormField
                  label="Quantity"
                  name={`quantity-${index}`}
                  value={s.quantity}
                  onChange={(e) =>
                    handleServiceChange(index, "quantity", e.target.value)
                  }
                  type="number"
                  placeholder="Quantity"
                  required
                  className="border p-2 rounded w-24"
                />
                <ActionButton
                  onClick={() => removeServiceField(index)}
                  label="Remove"
                  className="bg-red-500 text-white px-2 py-1 rounded"
                />
              </div>
            ))}
            {formErrors.services && (
              <p className="text-red-500 text-sm">{formErrors.services}</p>
            )}

            <button
              type="button"
              onClick={addServiceField}
              className="bg-green-500 text-white px-4 py-2 rounded"
              // disabled={selectedServiceIds.length >= services.length}
            >
              Add Service
            </button>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={
              createStatus === "loading" ||
              updateStatus === "loading" ||
              deleteStatus === "loading"
            }
          >
            {editingPackage ? "Update Package" : "Add Package"}
          </button>
        </div>
      </form>
      {content}
    </div>
  );
};

export default PackagesPage;
