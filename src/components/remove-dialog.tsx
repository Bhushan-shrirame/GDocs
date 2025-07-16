"use client"

import{
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog" 
import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Id } from "../../convex/_generated/dataModel"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


interface RemoveDialogProps{
  documentId: Id<"documents">
  children: React.ReactNode
}

export const RemoveDialog = ({documentId, children}:RemoveDialogProps) =>{
  const router  = useRouter();
  const remove = useMutation(api.documents.removeById);
  const [isRemoving , setIsRemoving] = useState(false);
  return(
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogTitle>
          Are you sure?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your document.
        </AlertDialogDescription>
        <AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()} > 
              cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              disabled={isRemoving}
              onClick={(e) => {
                e.stopPropagation();
                setIsRemoving(true);
                remove({id:documentId})
                  .catch(() => toast.error("Something went wrong"))
                  .then(() => {
                    toast.success("Document remove")
                    router.push("/");
                  })
                  .finally(() => setIsRemoving(false))
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )

}
