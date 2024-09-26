import { Button } from "components/ui/button"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { CircleX, Download } from "lucide-react"
import React, { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useHistoryContext } from "src/hooks/useHistory"

type FileDownloaderProps = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const FileDownloader = ({ isOpen, setIsOpen }: FileDownloaderProps) => {
  const { getHistory } = useHistoryContext()
  const [fileName, setFileName] = React.useState("untitled")
  const extension = ".chalkboard"
  const modalRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (getHistory().length === 0) {
      toast.error("Chalkboard is empty")
      return
    }
    const fileContent = JSON.stringify(getHistory())
    const file = new Blob([fileContent], { type: "application/json" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(file)
    link.download = `${fileName}${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    toast.success("Chalkboard Downloaded Successfully")
  }

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  return (
    <>
      {isOpen ? (
        <div className="fixed isolate z-50 mx-auto grid h-[100vh] w-full place-items-center bg-black/60 backdrop-blur-md">
          <div
            ref={modalRef}
            className="z-[100] space-y-4 rounded-xl border border-white/50 bg-white/30 p-6 shadow-lg backdrop-blur-md"
          >
            <div className="header">
              <h2 className="text-2xl font-bold text-primary">
                Download Your File
              </h2>
              <CircleX
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-sm text-white/80 ring-offset-background transition-colors hover:scale-[1.125] hover:text-white disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-name" className="text-white">
                File Name
              </Label>
              <div className="flex items-center">
                <Input
                  id="file-name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="rounded-r-none bg-white/50 focus-visible:ring-primary"
                />
                <span className="rounded-r-md border border-l-0 border-input bg-gray-200 px-3 py-2 text-sm text-black">
                  {extension}
                </span>
              </div>
            </div>
            <Button
              onClick={handleDownload}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Download className="mr-2 h-4 w-4" /> Download File
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}
