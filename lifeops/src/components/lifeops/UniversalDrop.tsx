"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  Check,
  File,
  FileImage,
  FileText,
  LoaderCircle,
  UploadCloud,
  X,
} from "lucide-react";

import {
  useRef,
  useState,
} from "react";

import { toast } from "sonner";

import {
  formatFileSize,
  validateFile,
} from "@/lib/files";

import type {
  IntakeResult,
  IntakeStatus,
} from "@/lib/types";

import { uploadToLifeOps, analyseLifeOpsDocument } from "@/lib/uploads";
import { processWithLifeOpsAgent } from "@/lib/agent";

interface UniversalDropProps {
  open: boolean;
  onClose: () => void;
}

export function UniversalDrop({
  open,
  onClose,
}: UniversalDropProps) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [file, setFile] =
    useState<File | null>(null);

  const [status, setStatus] =
    useState<IntakeStatus>("idle");

  const [result, setResult] =
    useState<IntakeResult | null>(null);

  const [dragging, setDragging] =
    useState(false);

  async function processFile(
    selectedFile: File,
  ) {
    const validationError =
      validateFile(selectedFile);

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setStatus("uploading");

    try {

      const uploaded = await uploadToLifeOps(selectedFile);
      setStatus("analyzing");

      const analysis = await analyseLifeOpsDocument(uploaded);
      setStatus("acting");
      const agentResult = await processWithLifeOpsAgent(analysis);

      setResult({
        id: uploaded.documentId,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        category: selectedFile.type.startsWith("image/",) ? "image" : "document",
        status: "handled",
        createdAt: new Date().toISOString(),
        analysis,
        agentResult,
      });
      setStatus("complete");

      toast.success(
        "LifeOps received your file.",
      );
    } catch (error) {
      console.error(error);

      setStatus("error");

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    }
  }

  function handleDrop(
    event: React.DragEvent<HTMLDivElement>,
  ) {
    event.preventDefault();

    setDragging(false);

    const droppedFile =
      event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    void processFile(droppedFile);
  }

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    void processFile(selectedFile);
  }

  function reset() {
    setFile(null);
    setResult(null);
    setStatus("idle");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function close() {
    reset();
    onClose();
  }

  const processing =
    status === "uploading" ||
    status === "analyzing";

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 12,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: 10,
              }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 28,
              }}
              className="relative w-full max-w-[600px] overflow-hidden rounded-[32px] border border-black/[0.07] bg-[#fbfbfc] shadow-[0_30px_100px_rgba(0,0,0,0.18)]"
            >
              <button
                type="button"
                onClick={close}
                className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-900"
              >
                <X size={16} />
              </button>

              <div className="px-7 pb-7 pt-8 md:px-9 md:pb-9">
                <header>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
                    Universal Drop
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
                    Add anything.
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                    Drop in everyday life admin.
                    LifeOps will figure out what
                    it is and what needs to happen.
                  </p>
                </header>

                {status === "idle" && (
                  <DropArea
                    dragging={dragging}
                    inputRef={inputRef}
                    onDragging={setDragging}
                    onDrop={handleDrop}
                    onInputChange={
                      handleInputChange
                    }
                  />
                )}

                {processing && file && (
                  <ProcessingState
                    file={file}
                    status={status}
                  />
                )}

                {status === "complete" &&
                  file &&
                  result && (
                    <CompleteState
                      file={file}
                      result={result}
                      onReset={reset}
                      onClose={close}
                    />
                  )}

                {status === "error" && (
                  <div className="mt-8 rounded-[24px] border border-black/[0.06] bg-white p-7 text-center">
                    <p className="font-medium text-zinc-950">
                      LifeOps could not process
                      that file.
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Try another document or
                      image.
                    </p>

                    <button
                      onClick={reset}
                      className="mt-5 rounded-xl bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white"
                    >
                      Try again
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

interface DropAreaProps {
  dragging: boolean;

  inputRef:
    React.RefObject<HTMLInputElement | null>;

  onDragging: (
    value: boolean,
  ) => void;

  onDrop: (
    event: React.DragEvent<HTMLDivElement>,
  ) => void;

  onInputChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

function DropArea({
  dragging,
  inputRef,
  onDragging,
  onDrop,
  onInputChange,
}: DropAreaProps) {
  return (
    <>
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          onDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();

          event.dataTransfer.dropEffect =
            "copy";

          onDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();

          if (
            event.currentTarget.contains(
              event.relatedTarget as Node,
            )
          ) {
            return;
          }

          onDragging(false);
        }}
        onDrop={onDrop}
        onClick={() =>
          inputRef.current?.click()
        }
        className={`mt-8 flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 text-center transition ${
          dragging
            ? "scale-[1.01] border-zinc-800 bg-zinc-100"
            : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
        }`}
      >
        <motion.div
          animate={
            dragging
              ? {
                  y: -4,
                  scale: 1.06,
                }
              : {
                  y: 0,
                  scale: 1,
                }
          }
          className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-zinc-950 text-white shadow-lg"
        >
          <UploadCloud size={22} />
        </motion.div>

        <h3 className="mt-5 text-base font-medium text-zinc-950">
          {dragging
            ? "Drop it here."
            : "Drop anything here"}
        </h3>

        <p className="mt-2 text-sm text-zinc-400">
          Bills · Receipts · Forms ·
          Appointments · Renewals
        </p>

        <p className="mt-5 text-xs text-zinc-400">
          PDF, JPG, PNG or WebP · Up to
          10 MB
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        onChange={onInputChange}
        className="hidden"
      />

      <div className="mt-5 grid grid-cols-3 gap-3">
        <SupportedItem
          icon={FileText}
          label="Documents"
        />

        <SupportedItem
          icon={FileImage}
          label="Images"
        />

        <SupportedItem
          icon={File}
          label="Forms"
        />
      </div>
    </>
  );
}

function SupportedItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType;
  label: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-black/[0.05] bg-white px-3 py-3 text-xs text-zinc-500">
      <Icon size={15} />

      {label}
    </div>
  );
}

function ProcessingState({
  file,
  status,
}: {
  file: File;
  status: IntakeStatus;
}) {
  return (
    <div className="mt-8 flex min-h-[320px] flex-col items-center justify-center rounded-[28px] border border-black/[0.05] bg-white p-8 text-center">
      <div className="relative flex h-24 w-24 items-center justify-center">
        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            ease: "linear",
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full border border-dashed border-zinc-300"
        />

        <motion.div
          animate={{
            scale: [1, 1.06, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-950 text-white shadow-xl"
        >
          <LoaderCircle size={21} />
        </motion.div>
      </div>

      <p className="mt-6 text-lg font-medium tracking-tight text-zinc-950">
        {status === "uploading"
          ? "Taking it in..."
          : status === "analyzing" ? "Understanding what this is..." : "Taking care of it..."}
      </p>

      <p className="mt-2 max-w-sm truncate text-sm text-zinc-400">
        {file.name}
      </p>

      <div className="mt-7 w-full max-w-xs overflow-hidden rounded-full bg-zinc-100">
        <motion.div
          initial={{
            width: "12%",
          }}
          animate={{
            width:
              status === "uploading"
                ? "48%"
                : "86%",
          }}
          transition={{
            duration: 0.6,
          }}
          className="h-1 rounded-full bg-zinc-950"
        />
      </div>

      <p className="mt-4 text-xs text-zinc-400">
        {status === "uploading"
          ? "Receiving securely"
          : status === "analyzing" ? "Reading with Amazon Textract" : "Planning and executing safe actions"}
      </p>
    </div>
  );
}

function CompleteState({
  file,
  result,
  onReset,
  onClose,
}: {
  file: File;
  result: IntakeResult;
  onReset: () => void;
  onClose: () => void;
}) {
  const analysis = result.analysis;
  const agentResult = result.agentResult;

  return (
    <div className="mt-8">
      <div className="rounded-[28px] border border-black/[0.05] bg-white p-7">
        <motion.div
          initial={{
            scale: 0.7,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-950 text-white"
        >
          <Check size={20} />
        </motion.div>

        <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">
          LifeOps received it
        </p>

        <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-zinc-950">
          I have got this.
        </h3>

        <p className="mt-2 text-sm leading-6 text-zinc-500">
          LifeOps analyzed the document
          and extracted the important information.
        </p>

        <div className="mt-7 rounded-[20px] bg-[#f5f5f7] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
              {result.category ===
              "image" ? (
                <FileImage
                  size={18}
                  className="text-zinc-600"
                />
              ) : (
                <FileText
                  size={18}
                  className="text-zinc-600"
                />
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">
                {file.name}
              </p>

              <p className="mt-1 text-xs text-zinc-400">
                {formatFileSize(file.size)}
                {" · "}
                {result.category ===
                "image"
                  ? "Image"
                  : "Document"}
              </p>
            </div>
          </div>
        </div>

        {analysis && (
          <div className="mt-5 rounded-[22px] border border-black/[0.05] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-zinc-400">LifeOps Understood</p>

            <div className="mt-5 space-y-4">
              {analysis.vendor && (
                <AnalysisRow
                  label="Provider"
                  value={analysis.vendor}
                />
              )}

              {analysis.total !== undefined && (
                <AnalysisRow
                  label="Amount"
                  value={`$${analysis.total.toFixed(2)}`}
                  strong
                />
              )}

              {analysis.dueDate && (
                <AnalysisRow
                  label="Due"
                  value={analysis.dueDate}
                />
              )}

              {analysis.date && (
                <AnalysisRow
                  label="Date"
                  value={analysis.date}
                />
              )}

              {analysis.invoiceNumber && (
                <AnalysisRow
                  label="Reference"
                  value={analysis.invoiceNumber}
                />
              )}
              
              <AnalysisRow
                label="Detected as"
                value={analysis.documentType}
              />
            </div>
          </div>
        )}

        {agentResult && (
          <div className="mt-5 rounded-[22px] border border-black/[0.05] bg-zinc-950 p-6 text-white">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">LifeOps handled</p>

            <h4 className="mt-3 text-lg font-medium tracking-tight">{agentResult.event.title}</h4>

            <p className="mt-2 text-sm leading-6 text-white/60">{agentResult.plan.briefing}</p>

            <div className="mt-5 flex items-center gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/70">
                {agentResult.guardian.level === "auto"
                  ? "Autonomously handled" : agentResult.guardian.level === "decision"
                  ? "Decision required" : "Confirmation required"
                }
              </span>

              <span className="text-xs text-white/35">Guardian</span>
            </div>

            <div className="mt-6 space-y-3">
              {agentResult.plan.actions.map((action) => (
                <div
                  key={action.type}
                  className="flex items-start gap-3"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-zinc-950">
                    <Check size={11} />
                  </div>

                  <div>
                    <p className="text-sm font-medium">{formatActionName(action.type)}</p>

                    <p className="mt-0.5 text-xs leading-5 text-white/40">{action.reason}</p>
                  </div>
                </div>
              ),)}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-sm text-zinc-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
            <Check size={13} />
          </div>

          Validated
        </div>

        <div className="mt-3 flex items-center gap-3 text-sm text-zinc-500">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-100">
            <Check size={13} />
          </div>

          Analyzed by Amazon Textract
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 rounded-xl border border-black/[0.07] bg-white px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          Add another
        </button>

        <button
          onClick={onClose}
          className="flex-1 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Done
        </button>
      </div>
    </div>
  );
}

function formatActionName(action: string): string {
  return action.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function AnalysisRow({
  label,
  value,
  strong = false
}: {
  label: string;
  value: string;
  strong?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className={
        strong ? "text-base font-semibold text-zinc-950" : "text-sm font-medium text-zinc-800"
      }>
        {value}
      </span>
    </div>
  );
}