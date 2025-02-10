"use client";

import { useProtectedRoutesApi } from "@/libraries/API/ProtectedRoute/secureRoutes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import InfantModal from "./editInfantModal";
import { useRouter } from "next/navigation";

const InfantList = () => {
  const { infantList, deleteInfants, UploadChildProfileImage } =
    useProtectedRoutesApi();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [selectedInfantIds, setSelectedInfantIds] = React.useState<string[]>(
    []
  );
  const [selectedInfant, setSelectedInfant] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeInfantId, setActiveInfantId] = React.useState<string | null>(
    null
  );

  // Loading state for image upload
  const [uploadingImageId, setUploadingImageId] = React.useState<string | null>(
    null
  );

  // Fetch all infants
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["infants"],
    queryFn: infantList,
  });

  // Mutation for deleting infants
  const deleteMutation = useMutation({
    mutationFn: deleteInfants,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infants"] }); // Refresh the list
      setSelectedInfantIds([]); // Clear selection
    },
    onError: (err: any) => {
      console.error("Delete failed:", err.message);
      alert(`Error: ${err.message}`);
    },
  });

  // Mutation for uploading image
  const uploadImageMutation = useMutation({
    mutationFn: ({ id, imageFile }: { id: string; imageFile: File }) =>
      UploadChildProfileImage(id, imageFile),
    onMutate: ({ id }) => {
      setUploadingImageId(id);
    },
    onSettled: () => {
      setUploadingImageId(null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infants"] });
    },
    onError: (err: any) => {
      console.error("Image upload failed:", err.message);
      alert(`Error: ${err.message}`);
    },
  });

  const totalItems = data?.data?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedInfants = data?.data?.slice(startIndex, endIndex) || [];

  const isValidImageUrl = (url: string) => {
    return (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://")
    );
  };

  const handleCheckboxChange = (infantId: string) => {
    setSelectedInfantIds((prev) =>
      prev.includes(infantId)
        ? prev.filter((id) => id !== infantId)
        : [...prev, infantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedInfantIds.length === paginatedInfants.length) {
      setSelectedInfantIds([]); // Unselect all
    } else {
      setSelectedInfantIds(paginatedInfants.map((infant) => infant.id)); // Select all on current page
    }
  };

  const handleDeleteSelected = () => {
    if (selectedInfantIds.length === 0) {
      alert("No infants selected for deletion.");
      return;
    }
    deleteMutation.mutate(selectedInfantIds);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditClick = (e: React.MouseEvent, infant: any) => {
    // Prevent the card's onClick (alert) from triggering.
    e.stopPropagation();
    setSelectedInfant(infant);
    setIsModalOpen(true);
  };

  // Handle image click
  const handleImageClick = (e: React.MouseEvent, infantId: string) => {
    // Prevent the card's onClick (alert) from triggering.
    e.stopPropagation();
    setActiveInfantId(infantId);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
      fileInputRef.current.click();
    }
  };

  // Handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && activeInfantId) {
      const file = event.target.files[0];
      uploadImageMutation.mutate({ id: activeInfantId, imageFile: file });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Infant List ({totalItems})</h1>

        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded-md p-1 text-sm"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center mb-2">
        <Checkbox
          checked={
            selectedInfantIds.length === paginatedInfants.length &&
            paginatedInfants.length > 0
          }
          onCheckedChange={handleSelectAll}
          className="mr-2"
        />
        <span className="text-sm">Select All</span>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <ScrollArea className="h-full pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {paginatedInfants.map((infant: any) => (
            <div
              key={infant.id}
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
            >
              <Checkbox
                checked={selectedInfantIds.includes(infant.id)}
                onCheckedChange={() => handleCheckboxChange(infant.id)}
                className="mr-2"
              />

              {/* Edit Infant Modal */}
              <InfantModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                infant={selectedInfant}
              />

              <Button onClick={(e) => handleEditClick(e, infant)}>Edit</Button>

              {/* Image with onClick handler */}
              <div
                onClick={(e) => handleImageClick(e, infant.id)}
                className="relative cursor-pointer"
              >
                {uploadingImageId === infant.id && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="loader">Uploading...</div>
                  </div>
                )}
                {infant.image && isValidImageUrl(infant.image) ? (
                  <Image
                    src={infant.image!}
                    alt={infant.fullname}
                    className="w-16 h-16 rounded-full object-cover"
                    width={100}
                    height={100}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>

              <div
                onClick={() => {
                  router.push(`/home/infant/details?id=${infant.id}`);
                }}
              >
                <h2 className="text-lg font-semibold">{infant.fullname}</h2>
                <p className="text-sm text-gray-600">
                  Gender: {infant.gender}
                  <br />
                  Weight: {infant.weight} kg
                  <br />
                  Height: {infant.height} cm
                  <br />
                  Birthday: {infant.birthday.month}/{infant.birthday.day}/
                  {infant.birthday.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 flex justify-between">
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} | Showing {paginatedInfants.length}{" "}
          of {totalItems} infants
        </div>

        <Button
          variant="destructive"
          onClick={handleDeleteSelected}
          disabled={selectedInfantIds.length === 0}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete Selected"}
        </Button>
      </div>
    </>
  );
};

export default InfantList;
