"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { IPackage, IService } from "../../redux/types";
import { toast } from "react-toastify";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "@/redux/services/serviceSlice";
import { fetchPackages } from "@/redux/packages/packagesSlice";

const ServicesPage = () => {
  const dispatch = useAppDispatch();
  const { services, status, error } = useAppSelector((state) => state.services);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
  }>({
    name: "",
    description: "",
    price: "",
  });

  const [editingService, setEditingService] = useState<IService | null>(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchServices());
    }
  }, [status, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (editingService) {
      dispatch(
        updateService({
          id: editingService._id,
          data: { ...formData, price: parseFloat(formData.price) },
        })
      )
        .unwrap() // Use unwrap to throw error if the action is rejected
        .then(() => {
          toast.success("Service updated successfully!");
        })
        .catch((error) => {
          toast.error(error || "Failed to update service.");
        });

      setEditingService(null);
    } else {
      dispatch(
        createService({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
        })
      )
        .unwrap() // Use unwrap to throw error if the action is rejected
        .then(() => {
          toast.success("Service created successfully!");
        })
        .catch((error) => {
          if (error.includes("already exists")) {
            toast.error("Service with this name already exists.");
          } else {
            toast.error(error || "Failed to create service.");
          }
        });
    }
    setFormData({ name: "", description: "", price: "" });
  };

  const handleEdit = (service: IService) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
    });
  };

  // const handleDelete = (id: string) => {
  //   if (confirm("Are you sure you want to delete this service?")) {
  //     dispatch(deleteService(id)).then(() => {
  //       dispatch(fetchServices());
  //       dispatch(fetchPackages());
  //       toast.success("Service deleted successfully!");
  //     });
  //   }
  // };
  const handleDelete = (id: string) => {
    // Fetch the packages to check if this service is part of any package
    dispatch(fetchPackages()).then((packagesResult) => {
      const packages = packagesResult.payload as IPackage[]; // Cast the payload to the correct type

      const isServiceInPackage = packages.some((pkg) =>
        pkg.services.some((service) => service.service._id === id)
      );

      if (isServiceInPackage) {
        toast.error(
          "Service cannot be deleted because it is part of a package."
        );
      } else {
        // Proceed with service deletion
        dispatch(deleteService(id)).then((result) => {
          if (deleteService.rejected.match(result)) {
            const errorMessage =
              typeof result.payload === "string"
                ? result.payload
                : "Service could not be deleted.";
            toast.error(errorMessage);
          } else {
            dispatch(fetchServices());
            toast.success("Service deleted successfully!");
          }
        });
      }
    });
  };

  let content;

  if (status === "loading") {
    content = <p>Loading...</p>;
  } else if (status === "succeeded") {
    content = (
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price ($)</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service._id} className="text-center">
              <td className="py-2">{service.name}</td>
              <td className="py-2">{service.description}</td>
              <td className="py-2">{service.price.toFixed(2)}</td>
              <td className="py-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  } else if (status === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Service Name"
            className="border p-2 rounded mb-2 md:mb-0 flex-1"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="border p-2 rounded mb-2 md:mb-0 flex-1"
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded mb-2 md:mb-0 w-32"
            step="0.01"
            min="0"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editingService ? "Update Service" : "Add Service"}
          </button>
        </div>
      </form>
      {content}
    </div>
  );
};

export default ServicesPage;
