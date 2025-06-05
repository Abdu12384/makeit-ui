import type React from "react"
import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"
import WorkSamplesList from "@/components/vendor/work-sample/ListWorkSample"
import WorkSampleForm from "@/components/vendor/work-sample/WorkSampleForm"
import { useCreateWorkSampleMutation, useGetAllWorkSamplesByVendorIdMutation, useUpdateWorkSampleMutation, useUploadeImageToCloudinaryMutation } from "@/hooks/VendorCustomHooks"
import toast from "react-hot-toast"
import { Pagination1 } from "@/components/common/paginations/Pagination"

interface WorkSample {
  workSampleId: string
  title: string
  description: string
  images: string[]
}

const WorkSamplePage: React.FC = () => {
  const [workSamples, setWorkSamples] = useState<WorkSample[]>([])

  const [currentView, setCurrentView] = useState<"list" | "add" | "edit">("list")
  const [editingWorkSample, setEditingWorkSample] = useState<WorkSample | null>(null)
  const getAllWorkSamplesMutation = useGetAllWorkSamplesByVendorIdMutation()
  const createWorkSampleMutation = useCreateWorkSampleMutation()
  const updateWorkSampleMutation = useUpdateWorkSampleMutation()
  const uploadToCloudinary = useUploadeImageToCloudinaryMutation()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 9

  useEffect(() => {
    getAllWorkSamplesMutation.mutate(
      {
        page: currentPage,
        limit: limit,
      },
      {
        onSuccess: (response) => {
          console.log(response)
          setWorkSamples(response.workSamples.workSamples)
          setTotalPages(response.workSamples.totalWorkSamples)
        },
        onError: (error) => {
          console.error("Error fetching work samples:", error)
        },
      }
    )
  }, [currentPage])


  const handleAddWorkSample = () => {
    setEditingWorkSample(null)
    setCurrentView("add")
  }

  const handleEditWorkSample = (workSample: WorkSample) => {
    setEditingWorkSample(workSample)
    setCurrentView("edit")
  }


  
  const handleSubmitWorkSample = async (data: WorkSample) => {
    console.log('submit',data)
    const cloudinaryUrls = [];
    console.log(data.images)
    for (const imageUrl of data.images) {
      if (!imageUrl.includes("cloudinary.com")) {
        const imageBlob = await fetch(imageUrl).then((r) => r.blob());
        const imageFile = new File([imageBlob], "event-image.jpg", { type: "image/jpeg" });
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append("file", imageFile);
        cloudinaryFormData.append("upload_preset", "vendor_id"); 

        const uploadResponse = await uploadToCloudinary.mutateAsync(cloudinaryFormData);
        cloudinaryUrls.push(uploadResponse.secure_url);
      } else {
        cloudinaryUrls.push(imageUrl);
      }
    }

    console.log(cloudinaryUrls)
    const updatedWorkSample = {
      ...data,
      images: cloudinaryUrls,
    };

    if (currentView === "edit" && editingWorkSample) {  
      // Update existing work sample
      setWorkSamples((prev) =>
        prev.map((sample) => (sample.workSampleId === editingWorkSample.workSampleId ? { ...updatedWorkSample, workSampleId: editingWorkSample.workSampleId } : sample)),
      )
      updateWorkSampleMutation.mutate(
        {
          data:updatedWorkSample,
          workSampleId: editingWorkSample.workSampleId,
        },
        {
          onSuccess: (response) => {
            console.log(response)
            toast.success(response.message)
            setWorkSamples((prev) =>
              prev.map((sample) =>
                sample.workSampleId === editingWorkSample.workSampleId ? { ...updatedWorkSample, workSampleId: editingWorkSample.workSampleId } : sample
              )
            )
          },
          onError: (error) => {
            console.error("Error updating work sample:", error)
            toast.error(error?.response?.data?.message || "Failed to update work sample")
          },
        }
      )
    } else {
      // Add new work sample
      const newWorkSample = {
        ...data,
        images: cloudinaryUrls,
        workSampleId: Date.now().toString(),
      }
      createWorkSampleMutation.mutate(
        newWorkSample,
        {
          onSuccess: (response) => {
            console.log(response)
            toast.success(response.message)
            setWorkSamples((prev) => [...prev, newWorkSample])
          },
          onError: (error) => {
            console.error("Error creating work sample:", error)
            toast.error(error?.response?.data?.message || "Failed to create work sample")
          },
        }
      )    
    }
    setCurrentView("list")
    setEditingWorkSample(null)
  }


  const handleDeleteWorkSample = (id: string) => {
    setWorkSamples((prev) => prev.filter((sample) => sample.workSampleId !== id))
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingWorkSample(null)
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {currentView === "list" && (
          <WorkSamplesList
            key="list"
            workSamples={workSamples}
            onEdit={handleEditWorkSample}
            onDelete={handleDeleteWorkSample}
            onAdd={handleAddWorkSample}
          />
        )}

        {(currentView === "add" || currentView === "edit") && (
          <WorkSampleForm
            key={currentView}
            initialData={editingWorkSample || undefined}
            onSubmit={handleSubmitWorkSample}
            onCancel={handleCancel}
            isEditing={currentView === "edit"}
          />
        )}
      </AnimatePresence>
      <Pagination1
        currentPage={currentPage}
        totalPages={totalPages}
        onPageNext={() => setCurrentPage(currentPage + 1)}
        onPagePrev={() => setCurrentPage(currentPage - 1)}
      />
    </div>
  )
}

export default WorkSamplePage
