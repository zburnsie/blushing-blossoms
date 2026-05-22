import { useState, useEffect } from "react";
import axios from "axios";

// ─── Flower / Recipe constants ────────────────────────────────────────────────

export const ALL_FLOWERS = [
  "White Orchid",
  "Pink Orchid",
  "White Calla Lily",
  "White Stock",
  "Burgundy Dahlia",
  "Green Anthurium",
  "White Hydrangea",
  "Green Hydrangea",
  "Burgundy Scabiosa",
  "White Larkspur",
  "Queen Anne's Lace",
  "Salal",
  "Explosion Grass",
];

export const ARRANGEMENT_TYPES = [
  "Bridal Bouquet",
  "Bridesmaid Bouquet",
  "Boutonniere",
  "Corsage",
  "Centerpiece",
  "Aisle Piece",
  "Bud Vase",
];

const DEFAULT_QUANTITIES: Record<string, number> = {
  "Bridal Bouquet": 1,
  "Bridesmaid Bouquet": 4,
  "Boutonniere": 6,
  "Corsage": 3,
  "Centerpiece": 9,
  "Aisle Piece": 6,
  "Bud Vase": 32,
};

const DEFAULT_RECIPES: Record<string, Record<string, number>> = {
  "Bridal Bouquet": {
    "White Orchid": 1, "Pink Orchid": 1, "White Calla Lily": 1,
    "White Stock": 3, "Burgundy Dahlia": 2, "Green Anthurium": 2,
    "White Hydrangea": 2, "Burgundy Scabiosa": 3, "Queen Anne's Lace": 2,
  },
  "Bridesmaid Bouquet": {
    "White Stock": 2, "Burgundy Dahlia": 2, "Green Anthurium": 1,
    "White Hydrangea": 1, "Burgundy Scabiosa": 2, "White Larkspur": 2,
    "Queen Anne's Lace": 2,
  },
  "Boutonniere": {
    "White Stock": 1, "White Hydrangea": 1, "White Larkspur": 2,
  },
  "Corsage": {
    "Burgundy Scabiosa": 1, "White Larkspur": 2,
  },
  "Centerpiece": {
    "White Stock": 2, "Burgundy Dahlia": 2, "Green Anthurium": 2,
    "White Hydrangea": 1, "Green Hydrangea": 1, "Burgundy Scabiosa": 2,
    "White Larkspur": 1, "Queen Anne's Lace": 1, "Salal": 2,
  },
  "Aisle Piece": {
    "White Stock": 2, "Burgundy Dahlia": 2, "Green Anthurium": 1,
    "White Hydrangea": 1, "Green Hydrangea": 1, "Burgundy Scabiosa": 2,
    "White Larkspur": 2, "Queen Anne's Lace": 2, "Salal": 3,
  },
  "Bud Vase": {
    "White Larkspur": 1, "Salal": 1, "Explosion Grass": 1,
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type Inquiry = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  instagramHandle: string | null;
  eventType: string;
  bookingStage: string;
  eventLocation: string;
  eventDate: string;
  colorPalette: string | null;
  budget: string;
  weddingItems: string | null;
  rentalsInterest: string | null;
  referralSource: string;
  createdAt: string;
  flowerCost: number | null;
  flowerCostItems: string | null;
  bookingAmount: number | null;
  workflowStages: string | null;
  notes: string | null;
  kanbanStage: string;
  pricingData: string | null;
};

type ArrangementConfig = {
  type: string;
  enabled: boolean;
  quantity: number;
  stemsPerUnit: Record<string, number>;
};

type PricingState = {
  arrangements: ArrangementConfig[];
  flowerPrices: Record<string, string>;
};

type EditState = {
  name: string;
  phoneNumber: string;
  email: string;
  instagramHandle: string;
  eventType: string;
  bookingStage: string;
  eventLocation: string;
  eventDate: string;
  colorPalette: string;
  budget: string;
  weddingItems: string[];
  rentalsInterest: string;
  referralSource: string;
  notes: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WORKFLOW_STAGES = [
  "Email Replied", "Contract Sent", "Contract Signed",
  "Deposit Paid", "Final Payment Received", "Flowers Purchased", "Event Complete",
];

const WEDDING_ITEM_OPTIONS = [
  "Bridal Bouquet", "Boutonnieres", "Bridesmaid Bouquets",
  "Centerpieces", "Installations", "Other",
];

function defaultPricing(): PricingState {
  return {
    arrangements: ARRANGEMENT_TYPES.map((type) => ({
      type,
      enabled: false,
      quantity: DEFAULT_QUANTITIES[type] ?? 1,
      stemsPerUnit: { ...(DEFAULT_RECIPES[type] ?? {}) },
    })),
    flowerPrices: Object.fromEntries(ALL_FLOWERS.map((f) => [f, ""])),
  };
}

function parsePricing(raw: string | null): PricingState {
  if (!raw) return defaultPricing();
  try {
    const parsed = JSON.parse(raw) as PricingState;
    const def = defaultPricing();
    // Merge in any new arrangement types that may not exist in saved data
    const savedTypes = new Set(parsed.arrangements.map((a) => a.type));
    const merged = [
      ...parsed.arrangements,
      ...def.arrangements.filter((a) => !savedTypes.has(a.type)),
    ];
    return { arrangements: merged, flowerPrices: { ...def.flowerPrices, ...parsed.flowerPrices } };
  } catch {
    return defaultPricing();
  }
}

function toEditState(inq: Inquiry): EditState {
  return {
    name: inq.name,
    phoneNumber: inq.phoneNumber,
    email: inq.email,
    instagramHandle: inq.instagramHandle ?? "",
    eventType: inq.eventType,
    bookingStage: inq.bookingStage,
    eventLocation: inq.eventLocation,
    eventDate: inq.eventDate ? inq.eventDate.split("T")[0] : "",
    colorPalette: inq.colorPalette ?? "",
    budget: inq.budget,
    weddingItems: inq.weddingItems ? inq.weddingItems.split(",") : [],
    rentalsInterest: inq.rentalsInterest ?? "",
    referralSource: inq.referralSource,
    notes: inq.notes ?? "",
  };
}

function buildPayload(inq: Inquiry, edit: EditState, pricing: PricingState, flowerCost: number, bookingAmount: number) {
  return {
    name: edit.name,
    phoneNumber: edit.phoneNumber,
    email: edit.email,
    instagramHandle: edit.instagramHandle || null,
    eventType: edit.eventType,
    bookingStage: edit.bookingStage,
    eventLocation: edit.eventLocation,
    eventDate: edit.eventDate,
    colorPalette: edit.colorPalette || null,
    budget: edit.budget,
    weddingItems: edit.weddingItems.length > 0 ? edit.weddingItems : null,
    rentalsInterest: edit.rentalsInterest || null,
    referralSource: edit.referralSource,
    notes: edit.notes || null,
    kanbanStage: inq.kanbanStage,
    workflowStages: inq.workflowStages ? inq.workflowStages.split(",") : null,
    flowerCost: flowerCost > 0 ? flowerCost : inq.flowerCost,
    bookingAmount: bookingAmount > 0 ? bookingAmount : inq.bookingAmount,
    pricingData: JSON.stringify(pricing),
  };
}

function computeTotalStems(pricing: PricingState): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const arr of pricing.arrangements) {
    if (!arr.enabled) continue;
    for (const flower of ALL_FLOWERS) {
      const stems = (arr.stemsPerUnit[flower] ?? 0) * arr.quantity;
      totals[flower] = (totals[flower] ?? 0) + stems;
    }
  }
  return totals;
}

function computeFlowerCost(pricing: PricingState, stemTotals: Record<string, number>): number {
  return ALL_FLOWERS.reduce((sum, flower) => {
    const stems = stemTotals[flower] ?? 0;
    const price = parseFloat(pricing.flowerPrices[flower] ?? "") || 0;
    return sum + stems * price;
  }, 0);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  inquiry: Inquiry | null;
  onClose: () => void;
  onSaved: (updated: Inquiry) => void;
  onDeleted: (id: number) => void;
}

export default function InquiryDrawer({ inquiry, onClose, onSaved, onDeleted }: Props) {
  const [edit, setEdit] = useState<EditState | null>(null);
  const [pricing, setPricing] = useState<PricingState>(defaultPricing());
  const [activeTab, setActiveTab] = useState<"pricing" | "progress" | "details">("pricing");
  const [saving, setSaving] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<string | null>(null);

  useEffect(() => {
    if (inquiry) {
      setEdit(toEditState(inquiry));
      setPricing(parsePricing(inquiry.pricingData));
      setActiveTab("pricing");
      setEditingRecipe(null);
    }
  }, [inquiry?.id]);

  if (!inquiry || !edit) return null;

  const stemTotals = computeTotalStems(pricing);
  const flowerCost = computeFlowerCost(pricing, stemTotals);
  const bookingAmount = flowerCost * 3;
  const activeFowers = ALL_FLOWERS.filter((f) => (stemTotals[f] ?? 0) > 0);

  function updateEdit(field: keyof EditState, value: string | string[]) {
    setEdit((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  function toggleWeddingItem(item: string, checked: boolean) {
    const current = edit.weddingItems;
    updateEdit("weddingItems", checked ? [...current, item] : current.filter((i) => i !== item));
  }

  function updateArrangement(type: string, field: "enabled" | "quantity", value: boolean | number) {
    setPricing((prev) => ({
      ...prev,
      arrangements: prev.arrangements.map((a) =>
        a.type === type ? { ...a, [field]: value } : a
      ),
    }));
  }

  function updateStemRecipe(type: string, flower: string, value: string) {
    setPricing((prev) => ({
      ...prev,
      arrangements: prev.arrangements.map((a) =>
        a.type === type
          ? { ...a, stemsPerUnit: { ...a.stemsPerUnit, [flower]: parseInt(value) || 0 } }
          : a
      ),
    }));
  }

  function updateFlowerPrice(flower: string, value: string) {
    setPricing((prev) => ({ ...prev, flowerPrices: { ...prev.flowerPrices, [flower]: value } }));
  }

  async function toggleWorkflowStage(stage: string, checked: boolean) {
    const current = inquiry.workflowStages ? inquiry.workflowStages.split(",") : [];
    const next = checked ? [...current, stage] : current.filter((s) => s !== stage);
    const updatedInq = { ...inquiry, workflowStages: next.join(",") || null };
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${inquiry.id}`, {
        ...buildPayload(inquiry, edit, pricing, flowerCost, bookingAmount),
        workflowStages: next.length > 0 ? next : null,
      });
      onSaved(res.data);
    } catch {
      alert("Failed to save progress");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${inquiry.id}`,
        buildPayload(inquiry, edit, pricing, flowerCost, bookingAmount)
      );
      onSaved(res.data);
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete inquiry for ${inquiry.name}?`)) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/inquiries/${inquiry.id}`);
      onDeleted(inquiry.id);
    } catch {
      alert("Failed to delete");
    }
  }

  const workflowSet = new Set(inquiry.workflowStages ? inquiry.workflowStages.split(",") : []);
  const editingArr = pricing.arrangements.find((a) => a.type === editingRecipe);

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 1100 }} />

      {/* Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: "min(680px, 100vw)",
        background: "#fff", zIndex: 1101, display: "flex", flexDirection: "column",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: "17px" }}>{inquiry.name}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
              {inquiry.eventType} · {inquiry.eventDate
                ? new Date(inquiry.eventDate + (inquiry.eventDate.includes("T") ? "Z" : "")).toLocaleDateString("en-US", { timeZone: "America/Denver", month: "short", day: "numeric", year: "numeric" })
                : "No date"
              }
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#999", lineHeight: 1, padding: "4px 8px" }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #eee", flexShrink: 0 }}>
          {(["pricing", "progress", "details"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              flex: 1, padding: "10px", border: "none", background: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: activeTab === tab ? 700 : 400,
              borderBottom: activeTab === tab ? "2px solid #b85c38" : "2px solid transparent",
              color: activeTab === tab ? "#b85c38" : "#666",
            }}>
              {tab === "pricing" ? "Pricing Calculator" : tab === "progress" ? "Progress" : "Details"}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          {/* ── PRICING CALCULATOR TAB ── */}
          {activeTab === "pricing" && (
            <div>
              {/* Summary bar */}
              {flowerCost > 0 && (
                <div style={{ display: "flex", gap: "24px", background: "#fdf6f0", border: "1px solid #e8cfc0", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px" }}>
                  <div>
                    <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Flower Cost</div>
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>${flowerCost.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Client Price (×3)</div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#b85c38" }}>${bookingAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Tax Reserve (33%)</div>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#c0392b" }}>${(bookingAmount * 0.33).toFixed(2)}</div>
                  </div>
                </div>
              )}

              {/* Arrangement selector */}
              <div style={{ marginBottom: "20px" }}>
                <div style={sectionLabel}>Select Arrangements</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {pricing.arrangements.map((arr) => (
                    <div key={arr.type} style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      padding: "8px 12px", border: `1px solid ${arr.enabled ? "#b85c38" : "#e0e0e0"}`,
                      borderRadius: "6px", background: arr.enabled ? "#fdf6f0" : "#fafafa",
                    }}>
                      <input
                        type="checkbox"
                        checked={arr.enabled}
                        onChange={(e) => updateArrangement(arr.type, "enabled", e.target.checked)}
                        style={{ accentColor: "#b85c38", flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, fontSize: "13px", fontWeight: arr.enabled ? 600 : 400 }}>{arr.type}</div>
                      {arr.enabled && (
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                          <span style={{ fontSize: "12px", color: "#888" }}>×</span>
                          <input
                            type="number"
                            min={1}
                            value={arr.quantity}
                            onChange={(e) => updateArrangement(arr.type, "quantity", parseInt(e.target.value) || 1)}
                            style={{ width: "48px", padding: "2px 6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flower cost table — only shows flowers with stems > 0 */}
              {activeFowers.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <div style={sectionLabel}>Flowers Needed & Pricing</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid #eee" }}>
                        <th style={th}>Flower</th>
                        <th style={{ ...th, textAlign: "center" }}>Stems</th>
                        <th style={{ ...th, textAlign: "center" }}>$ / stem</th>
                        <th style={{ ...th, textAlign: "right" }}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeFowers.map((flower) => {
                        const stems = stemTotals[flower] ?? 0;
                        const price = parseFloat(pricing.flowerPrices[flower] ?? "") || 0;
                        const subtotal = stems * price;
                        return (
                          <tr key={flower} style={{ borderBottom: "1px solid #f5f5f5" }}>
                            <td style={{ padding: "7px 4px" }}>{flower}</td>
                            <td style={{ padding: "7px 4px", textAlign: "center", color: "#555" }}>{stems}</td>
                            <td style={{ padding: "7px 4px" }}>
                              <input
                                type="number"
                                min={0}
                                step="0.01"
                                placeholder="0.00"
                                value={pricing.flowerPrices[flower] ?? ""}
                                onChange={(e) => updateFlowerPrice(flower, e.target.value)}
                                style={{ width: "80px", padding: "3px 6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "12px", textAlign: "right" }}
                              />
                            </td>
                            <td style={{ padding: "7px 4px", textAlign: "right", color: subtotal > 0 ? "#333" : "#bbb" }}>
                              ${subtotal.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                      <tr style={{ borderTop: "2px solid #ddd", fontWeight: 700 }}>
                        <td colSpan={3} style={{ padding: "8px 4px" }}>Total Flower Cost</td>
                        <td style={{ padding: "8px 4px", textAlign: "right", color: "#b85c38" }}>${flowerCost.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Stem recipe editor */}
              <div>
                <div style={sectionLabel}>Edit Stem Recipe <span style={{ fontWeight: 400, color: "#bbb", fontSize: "11px" }}>adjust stems per unit for this inquiry</span></div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {pricing.arrangements.filter((a) => a.enabled).map((arr) => (
                    <button key={arr.type} onClick={() => setEditingRecipe(editingRecipe === arr.type ? null : arr.type)} style={{
                      padding: "4px 10px", border: "1px solid #ddd", borderRadius: "20px", background: editingRecipe === arr.type ? "#fdf6f0" : "#fff",
                      fontSize: "12px", cursor: "pointer", fontWeight: editingRecipe === arr.type ? 600 : 400,
                      borderColor: editingRecipe === arr.type ? "#b85c38" : "#ddd",
                    }}>{arr.type}</button>
                  ))}
                  {pricing.arrangements.every((a) => !a.enabled) && (
                    <span style={{ fontSize: "12px", color: "#bbb" }}>Enable an arrangement above to edit its recipe</span>
                  )}
                </div>

                {editingArr && (
                  <div style={{ border: "1px solid #eee", borderRadius: "6px", padding: "12px" }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>
                      {editingArr.type} — stems per unit
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: "6px 12px", alignItems: "center", fontSize: "13px" }}>
                      {ALL_FLOWERS.map((flower) => (
                        <>
                          <div key={`${flower}-label`} style={{ color: "#555" }}>{flower}</div>
                          <input
                            key={`${flower}-input`}
                            type="number"
                            min={0}
                            value={editingArr.stemsPerUnit[flower] ?? 0}
                            onChange={(e) => updateStemRecipe(editingArr.type, flower, e.target.value)}
                            style={{ padding: "3px 6px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", textAlign: "center" }}
                          />
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROGRESS TAB ── */}
          {activeTab === "progress" && (
            <div>
              <div style={sectionLabel}>Pipeline Stages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {WORKFLOW_STAGES.map((stage, idx) => {
                  const done = workflowSet.has(stage);
                  return (
                    <label key={stage} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "12px 16px", borderRadius: "8px", cursor: "pointer",
                      border: `1px solid ${done ? "#7aab7a" : "#e0e0e0"}`,
                      background: done ? "#f0f7f0" : "#fafafa",
                    }}>
                      <input
                        type="checkbox"
                        checked={done}
                        onChange={(e) => toggleWorkflowStage(stage, e.target.checked)}
                        style={{ accentColor: "#7aab7a", width: "16px", height: "16px" }}
                      />
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: done ? 600 : 400, color: done ? "#3a7a3a" : "#555" }}>
                          {idx + 1}. {stage}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div style={{ marginTop: "24px" }}>
                <div style={sectionLabel}>Internal Notes</div>
                <textarea
                  style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "13px", resize: "vertical", minHeight: "100px", boxSizing: "border-box" }}
                  value={edit.notes}
                  onChange={(e) => updateEdit("notes", e.target.value)}
                  placeholder="Internal notes..."
                />
              </div>
            </div>
          )}

          {/* ── DETAILS TAB ── */}
          {activeTab === "details" && (
            <div>
              <div style={sectionLabel}>Contact</div>
              <div style={grid2}>
                <Field label="Name" value={edit.name} onChange={(v) => updateEdit("name", v)} />
                <Field label="Email" value={edit.email} onChange={(v) => updateEdit("email", v)} />
                <Field label="Phone" value={edit.phoneNumber} onChange={(v) => updateEdit("phoneNumber", v)} />
                <Field label="Instagram" value={edit.instagramHandle} onChange={(v) => updateEdit("instagramHandle", v)} />
              </div>

              <div style={{ ...sectionLabel, marginTop: "20px" }}>Event</div>
              <div style={grid2}>
                <div>
                  <label style={fieldLabel}>Event Type</label>
                  <select style={input} value={edit.eventType} onChange={(e) => updateEdit("eventType", e.target.value)}>
                    <option>Wedding</option><option>Funeral</option><option>Corporate Event</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Booking Stage</label>
                  <select style={input} value={edit.bookingStage} onChange={(e) => updateEdit("bookingStage", e.target.value)}>
                    <option>Ready to book</option><option>Likely to book</option><option>Still looking</option>
                  </select>
                </div>
                <Field label="Event Location" value={edit.eventLocation} onChange={(v) => updateEdit("eventLocation", v)} />
                <div>
                  <label style={fieldLabel}>Event Date</label>
                  <input style={input} type="date" value={edit.eventDate} onChange={(e) => updateEdit("eventDate", e.target.value)} />
                </div>
                <Field label="Color Palette" value={edit.colorPalette} onChange={(v) => updateEdit("colorPalette", v)} />
                <div>
                  <label style={fieldLabel}>Budget</label>
                  <select style={input} value={edit.budget} onChange={(e) => updateEdit("budget", e.target.value)}>
                    {["1000-1500","1500-2000","2000-3000","3000-4000","4000-5000","5000-7000","7000+","other"].map((r) => (
                      <option key={r} value={r}>{r === "other" ? "Other" : `$${r.replace("-","–$")}`}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={fieldLabel}>Interested in Rentals</label>
                  <select style={input} value={edit.rentalsInterest} onChange={(e) => updateEdit("rentalsInterest", e.target.value)}>
                    <option value="">—</option><option value="yes">Yes</option><option value="no">No</option>
                  </select>
                </div>
                <Field label="Referral Source" value={edit.referralSource} onChange={(v) => updateEdit("referralSource", v)} />
              </div>

              <div style={{ marginTop: "12px" }}>
                <label style={fieldLabel}>Wedding Items</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                  {WEDDING_ITEM_OPTIONS.map((item) => (
                    <label key={item} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px" }}>
                      <input type="checkbox" checked={edit.weddingItems.includes(item)} onChange={(e) => toggleWeddingItem(item, e.target.checked)} />
                      {item}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "16px", fontSize: "12px", color: "#aaa" }}>
                Submitted: {new Date(inquiry.createdAt + "Z").toLocaleString("en-US", { timeZone: "America/Denver", dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: "14px 20px", borderTop: "1px solid #eee", display: "flex", gap: "10px", flexShrink: 0, background: "#fafafa" }}>
          <button onClick={handleSave} disabled={saving} style={{ ...btn, background: "#5a8a5a", color: "#fff" }}>
            {saving ? "Saving..." : "Save All"}
          </button>
          <button onClick={onClose} style={{ ...btn, background: "#eee", color: "#333" }}>Cancel</button>
          <button onClick={handleDelete} style={{ ...btn, background: "#c0392b", color: "#fff", marginLeft: "auto" }}>Delete</button>
        </div>
      </div>
    </>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={fieldLabel}>{label}</label>
      <input style={input} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

const sectionLabel: React.CSSProperties = { fontWeight: 700, fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: "11px", fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" };
const input: React.CSSProperties = { width: "100%", padding: "7px 10px", border: "1px solid #ddd", borderRadius: "4px", fontSize: "13px", boxSizing: "border-box" };
const btn: React.CSSProperties = { padding: "8px 18px", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600 };
const grid2: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" };
const th: React.CSSProperties = { padding: "6px 4px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.04em" };
