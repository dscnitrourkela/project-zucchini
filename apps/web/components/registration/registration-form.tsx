"use client";

import { type User } from "@repo/firebase-config";
import { RegistrationSchema, type Registration } from "@repo/shared-types";
import { useApi } from "@repo/shared-utils";
import CloudinaryUploader from "../cloudinary-uploader";
import { registrationFields } from "@/config/register";
import { useFormState, renderFormFields, SubmitButton, ErrorDisplay } from "@/utils/form";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface RegistrationFormProps {
  user: User;
  onComplete: (isNitrStudent: boolean) => void;
}

export default function RegistrationForm({ user, onComplete }: RegistrationFormProps) {
  const [isNitrStudent, setIsNitrStudent] = useState(false);

  const { formData, errors, handleInputChange, validateForm, setFormData, setErrors } =
    useFormState<Registration>(
      {
        email: user.email || "",
        name: user.displayName || "",
        gender: undefined,
        permission: undefined as any,
        undertaking: undefined as any,
      },
      RegistrationSchema
    );

  useEffect(() => {
    if (isNitrStudent) {
      setFormData((prev) => ({
        ...prev,
        institute: "National Institute of Technology Rourkela",
        university: "NIT Rourkela",
        // Set dummy URLs for permission and undertaking to pass validation
        permission: "https://nitr.ac.in/permission",
        undertaking: "https://nitr.ac.in/undertaking",
      }));
      // Clear any validation errors for these fields
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.permission;
        delete newErrors.undertaking;
        return newErrors;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        permission: undefined as any,
        undertaking: undefined as any,
      }));
    }
  }, [isNitrStudent]);

  const {
    loading: isSubmitting,
    error: submitError,
    execute: registerApi,
  } = useApi<{ userId: number }>({
    onSuccess: (result) => {
      toast.success("Registration successful!", {
        description: isNitrStudent
          ? "Your registration is complete. No payment required for NIT Rourkela students."
          : "Please proceed to payment to complete your registration.",
      });
      onComplete(isNitrStudent);
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: error,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For NITR students, skip validation of permission and undertaking
    if (!isNitrStudent && !validateForm()) {
      return;
    }

    // For NITR students, validate only the fields that are shown
    if (isNitrStudent) {
      const fieldsToValidate = [
        "name",
        "email",
        "phone",
        "institute",
        "university",
        "idCard",
        "rollNumber",
        "gender",
      ];
      const hasErrors = Object.keys(errors).some(
        (key) => fieldsToValidate.includes(key) && errors[key as keyof typeof errors]
      );

      if (
        hasErrors ||
        !formData.name ||
        !formData.email ||
        !formData.phone ||
        !formData.institute ||
        !formData.university ||
        !formData.idCard ||
        !formData.rollNumber ||
        !formData.gender
      ) {
        return;
      }
    }

    await registerApi("register", {
      method: "POST",
      body: JSON.stringify({
        ...formData,
        isNitrStudent,
      }),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* NIT Rourkela Toggle */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isNitrStudent}
            onChange={(e) => setIsNitrStudent(e.target.checked)}
            className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
          />
          <span className="ml-2 text-sm font-semibold text-blue-900">I am from NIT Rourkela</span>
        </label>
        {isNitrStudent && (
          <p className="mt-2 text-xs text-blue-700">
            Your college information will be auto-filled and you won't need to pay registration
            fees.
          </p>
        )}
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderFormFields(
          registrationFields.map((field) => ({
            ...field,
            disabled: isNitrStudent && (field.name === "institute" || field.name === "university"),
          })),
          formData,
          errors,
          handleInputChange
        )}
      </div>

      {/* ID Card Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          College/University ID Card <span className="text-red-500">*</span>
        </label>
        <CloudinaryUploader
          maxFiles={1}
          value={formData.idCard}
          onUploadComplete={(url) => handleInputChange("idCard", url)}
        />
        {errors.idCard && <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>}
      </div>

      {/* Referral Code */}
      {/* {renderFormFields([referralField], formData, errors, handleInputChange)} */}

      {/* Permission Document Upload - Only for non-NITR students */}
      {!isNitrStudent && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Permission Document from Institute <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload a signed permission letter from your institute's authority
          </p>
          <CloudinaryUploader
            maxFiles={1}
            value={formData.permission as any}
            onUploadComplete={(url) => handleInputChange("permission", url)}
          />
          {errors.permission && <p className="mt-1 text-sm text-red-600">{errors.permission}</p>}
        </div>
      )}

      {/* Undertaking Document Upload - Only for non-NITR students */}
      {!isNitrStudent && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Undertaking Document <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Upload a signed undertaking/declaration document accepting terms and conditions
          </p>
          <CloudinaryUploader
            maxFiles={1}
            value={formData.undertaking as any}
            onUploadComplete={(url) => handleInputChange("undertaking", url)}
          />
          {errors.undertaking && <p className="mt-1 text-sm text-red-600">{errors.undertaking}</p>}
        </div>
      )}

      <ErrorDisplay error={submitError} />
      <SubmitButton
        isSubmitting={isSubmitting}
        loadingText="Registering..."
        submitText={isNitrStudent ? "Complete Registration (Free)" : "Continue to Payment"}
      />
    </form>
  );
}
