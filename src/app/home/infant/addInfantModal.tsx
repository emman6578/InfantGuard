"use client";

import React, { useState } from "react";
import { useProtectedRoutesApi } from "@/libraries/API/ProtectedRoute/secureRoutes";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const AddInfantModal = () => {
  const { createInfant } = useProtectedRoutesApi();
  const queryClient = useQueryClient();

  // Form state
  const [fullname, setFullname] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [purok, setPurok] = useState("");
  const [baranggay, setBaranggay] = useState("");
  const [municipality, setMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [place_of_birth, setPlaceOfBirth] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [mothers_name, setMothersName] = useState("");
  const [fathers_name, setFathersName] = useState("");
  const [contact_num, setContactNum] = useState("");
  const [health_center, setHealthCenter] = useState("");
  const [family_no, setFamilyNo] = useState("");

  const [isOpen, setIsOpen] = useState(false);

  // Function to clear all form fields
  const clearForm = () => {
    setFullname("");
    setMonth("");
    setDay("");
    setYear("");
    setPurok("");
    setBaranggay("");
    setMunicipality("");
    setProvince("");
    setPlaceOfBirth("");
    setHeight("");
    setGender("");
    setWeight("");
    setMothersName("");
    setFathersName("");
    setContactNum("");
    setHealthCenter("");
    setFamilyNo("");
  };

  // Create a mutation using TanStack Query's useMutation hook
  const createInfantMutation = useMutation({
    mutationFn: (newInfant: {
      fullname: string;
      month: string;
      day: string;
      year: string;
      purok: string;
      baranggay: string;
      municipality: string;
      province: string;
      place_of_birth: string;
      height: string;
      gender: string;
      weight: string;
      mothers_name: string;
      fathers_name: string;
      contact_num: string;
      health_center: string;
      family_no: string;
    }) => {
      // Convert numeric fields to numbers before calling the API
      return createInfant(
        newInfant.fullname,
        Number(newInfant.month),
        Number(newInfant.day),
        Number(newInfant.year),
        newInfant.purok,
        newInfant.baranggay,
        newInfant.municipality,
        newInfant.province,
        newInfant.place_of_birth,
        Number(newInfant.height),
        newInfant.gender,
        Number(newInfant.weight),
        newInfant.mothers_name,
        newInfant.fathers_name,
        newInfant.contact_num,
        newInfant.health_center,
        Number(newInfant.family_no)
      );
    },
    onSuccess: () => {
      // Invalidate queries so the list can refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["infants"] });
      // Clear the form fields after a successful save
      clearForm();
      // Close the dialog
      setIsOpen(false);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  // Handle form submission by calling the mutation
  const handleSave = () => {
    createInfantMutation.mutate({
      fullname,
      month,
      day,
      year,
      purok,
      baranggay,
      municipality,
      province,
      place_of_birth,
      height,
      gender,
      weight,
      mothers_name,
      fathers_name,
      contact_num,
      health_center,
      family_no,
    });
  };

  return (
    <div className="flex justify-end">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="px-4 py-2">Add Infant</Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Infant</DialogTitle>
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
              />
            </div>

            {/* Birth Date: Month, Day, Year */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="month"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Month
                </label>
                <Input
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="day"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Day
                </label>
                <Input
                  id="day"
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="year"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Year
                </label>
                <Input
                  id="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            {/* Address details */}
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
              />
            </div>
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
                />
              </div>
            </div>
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
              />
            </div>

            {/* Parent details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label
                  htmlFor="mothers_name"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Mother s Name
                </label>
                <Input
                  id="mothers_name"
                  value={mothers_name}
                  onChange={(e) => setMothersName(e.target.value)}
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="fathers_name"
                  className="mb-1 text-sm font-medium text-gray-700"
                >
                  Father s Name
                </label>
                <Input
                  id="fathers_name"
                  value={fathers_name}
                  onChange={(e) => setFathersName(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="contact_num"
                className="mb-1 text-sm font-medium text-gray-700"
              >
                Contact Number
              </label>
              <Input
                id="contact_num"
                value={contact_num}
                onChange={(e) => setContactNum(e.target.value)}
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
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddInfantModal;
