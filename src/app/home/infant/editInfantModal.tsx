"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useProtectedRoutesApi } from "@/libraries/API/ProtectedRoute/secureRoutes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";

interface InfantModalProps {
  isOpen: boolean;
  onClose: () => void;
  infant: {
    id: string;
    fullname: string;
    address: {
      purok: string;
      baranggay: string;
      municipality: string;
      province: string;
    };
    place_of_birth: string;
    height: string;
    gender: string;
    weight: string;
    health_center: string;
    family_no: string;
  } | null;
}

const InfantModal: React.FC<InfantModalProps> = ({
  isOpen,
  onClose,
  infant,
}) => {
  const { updateInfant } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: ({ data, id }: { data: any; id: string }) =>
      updateInfant(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["infants"] });
    },
  });

  // Form state
  const [fullname, setFullname] = useState("");
  const [purok, setPurok] = useState("");
  const [baranggay, setBaranggay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [place_of_birth, setPlaceOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [health_center, setHealthCenter] = useState("");
  const [family_no, setFamilyNo] = useState("");

  // Function to clear all form fields
  const clearForm = () => {
    setFullname("");
    setPurok("");
    setBaranggay("");
    setMunicipality("");
    setProvince("");
    setPlaceOfBirth("");
    setHeight("");
    setGender("");
    setWeight("");
    setHealthCenter("");
    setFamilyNo("");
  };

  const handleSave = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {
      ...(fullname && { fullname }),
      ...(place_of_birth && { place_of_birth }),
      ...(height && { height: Number(height) }),
      ...(weight && { weight: Number(weight) }),
      ...(gender && { gender }),
      ...(health_center && { health_center }),
      ...(family_no && { family_no: Number(family_no) }),
    };

    // Build the address object only if at least one of its fields has a value.
    const address =
      purok || baranggay || municipality || province
        ? {
            ...(purok && { purok }),
            ...(baranggay && { baranggay }),
            ...(municipality && { municipality }),
            ...(province && { province }),
          }
        : null;

    // If there is an address, add it to the data.
    if (address) {
      data.address = address;
    }

    try {
      // Pass an object with both data and id
      await updateMutation.mutateAsync({ data, id: infant!.id });
      clearForm();
    } catch (error) {
      console.error("Error updating infant:", error);
    }

    onClose();
  };

  if (!infant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Infant</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex flex-col">
            <label
              htmlFor="fullname"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <Input
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder={infant.fullname}
            />
          </div>

          {/* Address Fields */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="purok"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Purok
              </label>
              <Input
                id="purok"
                value={purok}
                onChange={(e) => setPurok(e.target.value)}
                placeholder={infant.address.purok}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="baranggay"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Baranggay
              </label>
              <Input
                id="baranggay"
                value={baranggay}
                onChange={(e) => setBaranggay(e.target.value)}
                placeholder={infant.address.baranggay}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="municipality"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Municipality
              </label>
              <Input
                id="municipality"
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                placeholder={infant.address.municipality}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="province"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Province
              </label>
              <Input
                id="province"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                placeholder={infant.address.province}
              />
            </div>
          </div>

          {/* Place of Birth */}
          <div className="flex flex-col">
            <label
              htmlFor="place_of_birth"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Place of Birth
            </label>
            <Input
              id="place_of_birth"
              value={place_of_birth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
              placeholder={infant.place_of_birth}
            />
          </div>

          {/* Physical details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="height"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Height
              </label>
              <Input
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder={infant.height}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="weight"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Weight
              </label>
              <Input
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder={infant.weight}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label
              htmlFor="gender"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <Input
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder={infant.gender}
            />
          </div>

          {/* Health and Family details */}
          <div className="flex flex-col">
            <label
              htmlFor="health_center"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Health Center
            </label>
            <Input
              id="health_center"
              value={health_center}
              onChange={(e) => setHealthCenter(e.target.value)}
              placeholder={infant.health_center}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="family_no"
              className="mb-1 text-sm font-medium text-gray-700"
            >
              Family Number
            </label>
            <Input
              id="family_no"
              value={family_no}
              onChange={(e) => setFamilyNo(e.target.value)}
              placeholder={infant.family_no}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InfantModal;
