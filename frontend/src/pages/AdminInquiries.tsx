import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InquiryDrawer, { type Inquiry } from "./InquiryDrawer";

const KANBAN_STAGES = [
  "New Lead",
  "Email Replied",
  "Contract Sent",
  "Contract Signed",
  "Deposit Paid",
  "Flowers Purchased",
  "Event Complete",
];

const STAGE_COLORS: Record<string, { bg: string; header: string; dot: string }> = {
  "New Lead":         { bg: "#f8f8f8", header: "#eeeeee", dot: "#aaa" },
  "Email Replied":    { bg: "#f0f4ff", header: "#dde6ff", dot: "#6b8cff" },
  "Contract Sent":    { bg: "#f8f0ff", header: "#ead6ff", dot: "#a06bcf" },
  "Contract Signed":  { bg: "#fff0fb", header: "#ffd6f4", dot: "#cf6bb5" },
  "Deposit Paid":     { bg: "#fffbf0", header: "#fff0c0", dot: "#c0961a" },
  "Flowers Purchased":{ bg: "#f0fff4", header: "#c8f0d4", dot: "#3a9a5a" },
  "Event Complete":   { bg: "#e8f8e8", header: "#b8e8b8", dot: "#2a7a2a" },
};

const WORKFLOW_STAGES = [
  "Email Replied", "Contract Sent", "Contract Signed",
  "Deposit Paid", "Final Payment Received", "Flowers Purchased", "Event Complete",
];

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthed = localStorage.getItem("admin-auth");
    if (!isAuthed) navigate("/admin/login");
  }, [navigate]);

  useEffect(() => { fetchInquiries(); }, []);

  async function fetchInquiries() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries`);
      setInquiries(res.data);
    } catch {
      setError("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }

  async function handleDrop(targetStage: string) {
    if (draggedId === null || dragOverStage === null) return;
    const inq = inquiries.find((i) => i.id === draggedId);
    if (!inq || inq.kanbanStage === targetStage) return;

    // Optimistic update
    setInquiries((prev) => prev.map((i) => i.id === draggedId ? { ...i, kanbanStage: targetStage } : i));

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${draggedId}`, {
        name: inq.name, phoneNumber: inq.phoneNumber, email: inq.email,
        instagramHandle: inq.instagramHandle, eventType: inq.eventType,
        bookingStage: inq.bookingStage, eventLocation: inq.eventLocation,
        eventDate: inq.eventDate, colorPalette: inq.colorPalette, budget: inq.budget,
        weddingItems: inq.weddingItems ? inq.weddingItems.split(",") : null,
        rentalsInterest: inq.rentalsInterest, referralSource: inq.referralSource,
        notes: inq.notes, flowerCost: inq.flowerCost, bookingAmount: inq.bookingAmount,
        workflowStages: inq.workflowStages ? inq.workflowStages.split(",") : null,
        pricingData: inq.pricingData,
        kanbanStage: targetStage,
      });
      setInquiries((prev) => prev.map((i) => i.id === draggedId ? res.data : i));
    } catch {
      // Revert on failure
      setInquiries((prev) => prev.map((i) => i.id === draggedId ? inq : i));
    }
  }

  function handleSaved(updated: Inquiry) {
    setInquiries((prev) => prev.map((i) => i.id === updated.id ? updated : i));
    setSelectedInquiry(updated);
  }

  function handleDeleted(id: number) {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    setSelectedInquiry(null);
  }

  // Tax summary across all inquiries
  const totalBooked = inquiries.reduce((sum, i) => sum + (i.bookingAmount ?? 0), 0);
  const totalFlowers = inquiries.reduce((sum, i) => sum + (i.flowerCost ?? 0), 0);
  const taxSave = totalBooked * 0.33;

  if (loading) return <p style={{ padding: "32px" }}>Loading...</p>;
  if (error) return <p style={{ color: "red", padding: "32px" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", background: "#f4f4f4" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "14px 24px", display: "flex", alignItems: "center", gap: "32px", flexWrap: "wrap" }}>
        <h1 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Inquiries</h1>
        <div style={{ display: "flex", gap: "24px", marginLeft: "auto" }}>
          <Stat label="Total Revenue" value={`$${totalBooked.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <Stat label="Flower Costs" value={`$${totalFlowers.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <Stat label="Tax Reserve (33%)" value={`$${taxSave.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} color="#c0392b" />
          <Stat label="Total Leads" value={String(inquiries.length)} />
        </div>
      </div>

      {/* Kanban board */}
      <div style={{ display: "flex", gap: "12px", padding: "16px", overflowX: "auto", alignItems: "flex-start", minHeight: "calc(100vh - 72px)" }}>
        {KANBAN_STAGES.map((stage) => {
          const colors = STAGE_COLORS[stage];
          const cards = inquiries.filter((i) => (i.kanbanStage || "New Lead") === stage);
          const isDragTarget = dragOverStage === stage;

          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setDragOverStage(stage); }}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => { e.preventDefault(); setDragOverStage(null); handleDrop(stage); setDraggedId(null); }}
              style={{
                minWidth: "210px", width: "210px", flexShrink: 0,
                background: colors.bg,
                border: isDragTarget ? "2px dashed #b85c38" : "2px solid transparent",
                borderRadius: "10px",
                transition: "border-color 0.15s",
              }}
            >
              {/* Column header */}
              <div style={{ background: colors.header, borderRadius: "8px 8px 0 0", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#444" }}>{stage}</span>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#666", background: "rgba(255,255,255,0.6)", borderRadius: "10px", padding: "1px 7px" }}>{cards.length}</span>
              </div>

              {/* Cards */}
              <div style={{ padding: "8px", display: "flex", flexDirection: "column", gap: "6px", minHeight: "80px" }}>
                {cards.map((inq) => {
                  const stagesComplete = (inq.workflowStages ?? "").split(",").filter(Boolean).length;
                  const isDragging = draggedId === inq.id;

                  return (
                    <div
                      key={inq.id}
                      draggable
                      onDragStart={() => setDraggedId(inq.id)}
                      onDragEnd={() => { setDraggedId(null); setDragOverStage(null); }}
                      onClick={() => setSelectedInquiry(inq)}
                      style={{
                        background: "#fff",
                        border: "1px solid #e8e8e8",
                        borderRadius: "7px",
                        padding: "10px 12px",
                        cursor: "grab",
                        opacity: isDragging ? 0.4 : 1,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                        transition: "box-shadow 0.15s, opacity 0.15s",
                        userSelect: "none",
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "3px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {inq.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>
                        {inq.eventType}
                        {inq.eventDate && (
                          <> · {new Date(inq.eventDate + (inq.eventDate.includes("T") ? "Z" : "")).toLocaleDateString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", year: "2-digit" })}</>
                        )}
                      </div>
                      {inq.bookingAmount != null && (
                        <div style={{ fontSize: "12px", fontWeight: 600, color: "#b85c38", marginBottom: "6px" }}>
                          ${inq.bookingAmount.toLocaleString()}
                        </div>
                      )}
                      {/* Progress dots */}
                      <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                        {WORKFLOW_STAGES.map((ws) => {
                          const done = (inq.workflowStages ?? "").split(",").includes(ws);
                          return <div key={ws} title={ws} style={{ width: "7px", height: "7px", borderRadius: "50%", background: done ? colors.dot : "#e0e0e0", flexShrink: 0 }} />;
                        })}
                        <span style={{ fontSize: "10px", color: "#bbb", marginLeft: "4px" }}>{stagesComplete}/{WORKFLOW_STAGES.length}</span>
                      </div>
                    </div>
                  );
                })}

                {isDragTarget && cards.length === 0 && (
                  <div style={{ border: "2px dashed #b85c38", borderRadius: "7px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#b85c38", fontSize: "12px" }}>
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      <InquiryDrawer
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onSaved={handleSaved}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: "11px", color: "#aaa", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontSize: "16px", fontWeight: 700, color: color ?? "#333" }}>{value}</div>
    </div>
  );
}
