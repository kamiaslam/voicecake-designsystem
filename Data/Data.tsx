import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bell, User, Settings, Plus, Search, Download, Filter, Pencil, Calculator, History,
  Shield, KeyRound, Bug, Eye, Lock, Copy, Trash2, LayoutGrid, FileDown
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/*****************************************
 * MOCK API LAYER + TYPES
 *****************************************/
const mockDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Global pricing shape
export type Pricing = {
  conversaPerMin: number; // $/min
  empathPerMin: number; // $/min
  automationsPack: number; // $ per 10k automations
  premiumVoiceSurcharge: number; // $/min
};

// Per-account pricing override
export type AccountPricing = Pricing & { enabled: boolean };

export type AuditEvent = {
  at: string; // ISO time
  actor: string; // email or name
  scope: "global" | "account";
  account?: string; // when scope=account
  from: Partial<Pricing>;
  to: Partial<Pricing>;
  note?: string;
};

// Permissions
export type Role = "owner" | "admin" | "subadmin" | "support";
export type PermissionKey =
  | "users_view" | "agents_view" | "billing_view" | "workflows_view" | "telephony_view" | "security_view" | "support_view" | "insights_view"
  | "pricing_edit" | "account_pricing_edit" | "agents_deploy" | "workflows_edit" | "numbers_manage"
  | "logs_view" | "logs_manage" | "refunds_manage" | "team_manage";

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastActive: string; // ISO
  permissions: Record<PermissionKey, boolean>;
};

export type LogItem = {
  id: string;
  time: string; // ISO
  tenant: string;
  client: string;
  severity: "error" | "warn" | "info";
  source: "Agent" | "Workflow" | "Telephony" | "Billing" | "API";
  code: string;
  message: string;
  correlationId: string;
  requestId?: string;
  httpStatus?: number;
  meta?: Record<string, any>;
  stack?: string;
};

// In-memory mock DB
let GLOBAL_PRICING: Pricing = {
  conversaPerMin: 0.12,
  empathPerMin: 0.13,
  automationsPack: 10,
  premiumVoiceSurcharge: 0.015,
};

const ACCOUNT_PRICING: Record<string, AccountPricing> = {
  "ZenCare Homes": { ...GLOBAL_PRICING, empathPerMin: 0.11, enabled: true },
};

const AUDIT_LOG: AuditEvent[] = [];

// Role presets
const PERMISSION_LIST: PermissionKey[] = [
  "users_view","agents_view","billing_view","workflows_view","telephony_view","security_view","support_view","insights_view",
  "pricing_edit","account_pricing_edit","agents_deploy","workflows_edit","numbers_manage",
  "logs_view","logs_manage","refunds_manage","team_manage",
];

function presetFor(role: Role): Record<PermissionKey, boolean> {
  const all = Object.fromEntries(PERMISSION_LIST.map(k=>[k,false])) as Record<PermissionKey, boolean>;
  if(role === "owner") PERMISSION_LIST.forEach(k=>all[k]=true);
  if(role === "admin") Object.assign(all, {
    users_view:true, agents_view:true, billing_view:true, workflows_view:true, telephony_view:true, security_view:true, support_view:true, insights_view:true,
    pricing_edit:true, account_pricing_edit:true, agents_deploy:true, workflows_edit:true, numbers_manage:true,
    logs_view:true, logs_manage:true, refunds_manage:true, team_manage:true,
  });
  if(role === "subadmin") Object.assign(all, {
    users_view:true, agents_view:true, billing_view:true, workflows_view:true, telephony_view:true, security_view:true, support_view:true, insights_view:true,
    account_pricing_edit:true, agents_deploy:true, workflows_edit:true, numbers_manage:true,
    logs_view:true,
  });
  if(role === "support") Object.assign(all, {
    users_view:true, agents_view:true, support_view:true, telephony_view:true, logs_view:true, insights_view:true,
  });
  return all;
}

// Mock staff
let STAFF: StaffMember[] = [
  { id: "u1", name: "Kam Aslam", email: "kam@voicecake.io", role: "owner", active: true, lastActive: new Date().toISOString(), permissions: presetFor("owner") },
  { id: "u2", name: "Aisha Khan", email: "aisha@voicecake.io", role: "admin", active: true, lastActive: new Date(Date.now()-3600e3).toISOString(), permissions: presetFor("admin") },
  { id: "u3", name: "Tom Green", email: "tom@voicecake.io", role: "support", active: true, lastActive: new Date(Date.now()-86400e3*2).toISOString(), permissions: presetFor("support") },
];

// Simulated logs
let LOGS: LogItem[] = [
  {
    id: "lg_1007",
    time: new Date(Date.now()-5*60e3).toISOString(),
    tenant: "t_zencare",
    client: "ZenCare Homes",
    severity: "error",
    source: "Workflow",
    code: "WEBHOOK_429",
    message: "CRM upsert lead rate limited",
    correlationId: "corr-2c9f-7a11",
    requestId: "run_98765:node_4",
    httpStatus: 429,
    meta: {
      endpoint: "https://api.hubspot.com/crm/v3/objects/contacts",
      retryCount: 2,
      xvcSignature: "sha256=ab83e...",
      xvcTimestamp: Math.floor(Date.now()/1000),
      idempotencyKey: "idmp-0a2b-ff34",
      workflowId: "wf_12345",
      stepId: "node_4"
    },
    stack: `Error: 429 Too Many Requests
    at HTTP.post (...)`,
  },
  {
    id: "lg_1008",
    time: new Date(Date.now()-17*60e3).toISOString(),
    tenant: "t_acme",
    client: "Acme Health",
    severity: "warn",
    source: "Telephony",
    code: "SIP_QUALITY_DROP",
    message: "MOS score dipped below 3.2 for +44 20 7123 9876",
    correlationId: "corr-a1b2-c3d4",
    meta: { number: "+44 20 7123 9876", callId: "call_abc" },
  },
  {
    id: "lg_1009",
    time: new Date(Date.now()-30*60e3).toISOString(),
    tenant: "t_nimbus",
    client: "Nimbus Retail",
    severity: "error",
    source: "Agent",
    code: "LLM_TIMEOUT",
    message: "Conversa planning tool timed out at 15s",
    correlationId: "corr-9f21-zz77",
    meta: { agent: "Sales SDR-1", latencyMs: 15023 },
    stack: "TimeoutError: operation exceeded 15000ms"
  },
  {
    id: "lg_1010",
    time: new Date(Date.now()-55*60e3).toISOString(),
    tenant: "t_delta",
    client: "Delta Realty",
    severity: "error",
    source: "API",
    code: "AUTH_HMAC_INVALID",
    message: "Invalid X-VC-Signature on inbound webhook",
    correlationId: "corr-5f5e-1212",
    httpStatus: 401,
    meta: { header: "X-VC-Signature", expected: "sha256=...", received: "sha256=bad..." }
  }
];

// Simulated usage for invoice preview
type UsageInputs = { minutesConversa: number; minutesEmpath: number; automations: number; premiumMinutes: number };
const DEFAULT_USAGE: UsageInputs = { minutesConversa: 1200, minutesEmpath: 800, automations: 18000, premiumMinutes: 150 };
const nowIso = () => new Date().toISOString();

const API = {
  async getGlobalPricing(): Promise<Pricing> { await mockDelay(200); return { ...GLOBAL_PRICING }; },
  async updateGlobalPricing(p: Pricing, actor: string, note?: string): Promise<Pricing> {
    await mockDelay(400);
    const from = { ...GLOBAL_PRICING };
    GLOBAL_PRICING = { ...p };
    AUDIT_LOG.unshift({ at: nowIso(), actor, scope: "global", from, to: p, note });
    return { ...GLOBAL_PRICING };
  },
  async getAccountPricing(company: string): Promise<AccountPricing> { await mockDelay(180); return ACCOUNT_PRICING[company] || { ...GLOBAL_PRICING, enabled: false }; },
  async upsertAccountPricing(company: string, override: AccountPricing, actor: string, note?: string): Promise<AccountPricing> {
    await mockDelay(400);
    const from = ACCOUNT_PRICING[company] || { ...GLOBAL_PRICING, enabled: false };
    ACCOUNT_PRICING[company] = { ...override };
    AUDIT_LOG.unshift({ at: nowIso(), actor, scope: "account", account: company, from, to: override, note });
    return ACCOUNT_PRICING[company];
  },
  async getAudit(): Promise<AuditEvent[]> { await mockDelay(120); return [...AUDIT_LOG]; },
  async listStaff(): Promise<StaffMember[]> { await mockDelay(150); return STAFF.map(s=>({ ...s })); },
  async upsertStaff(member: StaffMember): Promise<StaffMember> {
    await mockDelay(250);
    const idx = STAFF.findIndex(s=>s.id===member.id);
    if(idx>=0) STAFF[idx] = { ...member }; else STAFF.unshift({ ...member });
    return { ...member };
  },
  async createStaff(name: string, email: string, role: Role): Promise<StaffMember> {
    await mockDelay(250);
    const m: StaffMember = { id: `u${Date.now()}`, name, email, role, active: true, lastActive: nowIso(), permissions: presetFor(role) };
    STAFF.unshift(m);
    return { ...m };
  },
  async listLogs(): Promise<LogItem[]> { await mockDelay(220); return LOGS.slice().sort((a,b)=>+new Date(b.time)-+new Date(a.time)); },
  async deleteLog(id: string): Promise<void> { await mockDelay(120); LOGS = LOGS.filter(l=>l.id!==id); },
};

/*****************************************
 * DASHBOARD DATA (MOCK)
 *****************************************/
const revenueData = [
  { month: "Jan", mrr: 5200, payg: 1800 },
  { month: "Feb", mrr: 6400, payg: 2200 },
  { month: "Mar", mrr: 7100, payg: 2600 },
  { month: "Apr", mrr: 7600, payg: 2800 },
];

const usageSplit = [ { name: "Conversa", value: 62 }, { name: "Empath", value: 38 } ];
const churnData = [ { month: "Jan", churn: 5 }, { month: "Feb", churn: 4 }, { month: "Mar", churn: 6 }, { month: "Apr", churn: 3 } ];

// Geo usage mock, totals by country
const countryUsage = [
  { country: "United Kingdom", code: "GB", calls: 2120, minutes: 3800, revenue: 9200 },
  { country: "United States", code: "US", calls: 1580, minutes: 3400, revenue: 8400 },
  { country: "Belgium", code: "BE", calls: 420, minutes: 760, revenue: 1800 },
  { country: "United Arab Emirates", code: "AE", calls: 260, minutes: 610, revenue: 1550 },
  { country: "Pakistan", code: "PK", calls: 300, minutes: 540, revenue: 1300 },
];

const users = [
  { company: "Acme Health", plan: "Pro", seats: 12, status: "active", mrr: 899, autoRenew: true },
  { company: "Delta Realty", plan: "Starter", seats: 5, status: "trial", mrr: 129, autoRenew: false },
  { company: "Nimbus Retail", plan: "Business", seats: 24, status: "active", mrr: 1899, autoRenew: true },
  { company: "ZenCare Homes", plan: "Enterprise", seats: 64, status: "active", mrr: 7499, autoRenew: true },
];

const agents = [
  { name: "Receptionist UK", type: "Conversa", client: "Acme Health", latency: 480, csat: 4.6, calls: 812 },
  { name: "Wellness Check", type: "Empath", client: "ZenCare Homes", latency: 540, csat: 4.8, calls: 1093 },
  { name: "Sales SDR-1", type: "Conversa", client: "Nimbus Retail", latency: 410, csat: 4.2, calls: 640 },
];

const INITIAL_INVOICES = [
  { id: "INV-1042", client: "Acme Health", amount: 1249, status: "paid", period: "Apr 2025" },
  { id: "INV-1043", client: "Delta Realty", amount: 89, status: "due", period: "Apr 2025" },
  { id: "INV-1044", client: "ZenCare Homes", amount: 9860, status: "paid", period: "Apr 2025" },
];

const workflows = [
  { name: "Lead Capture → HubSpot", client: "Nimbus Retail", runs: 1432, fails: 6, lastRun: "10m ago" },
  { name: "Missed Call → SMS", client: "Acme Health", runs: 932, fails: 0, lastRun: "2m ago" },
  { name: "Care Alert → Webhook", client: "ZenCare Homes", runs: 2204, fails: 3, lastRun: "1m ago" },
];

const numbers = [
  { number: "+44 20 7123 9876", client: "Acme Health", mappedTo: "Receptionist UK", inbound: 812, outbound: 102, health: "ok" },
  { number: "+1 415 555 0199", client: "Nimbus Retail", mappedTo: "Sales SDR-1", inbound: 211, outbound: 540, health: "ok" },
  { number: "+44 161 555 0102", client: "ZenCare Homes", mappedTo: "Wellness Check", inbound: 1203, outbound: 36, health: "warning" },
];

const securityEvents = [
  { time: "12:41", actor: "admin@zencare", action: "API key created", risk: "low" },
  { time: "11:22", actor: "dev@nimbus", action: "Rate limit exceeded", risk: "med" },
  { time: "09:03", actor: "system", action: "Login from new device", risk: "high" },
];

const tickets = [
  { id: "#4921", client: "Delta Realty", subject: "Workflow failed", priority: "high", sla: "3h", status: "open" },
  { id: "#4922", client: "Acme Health", subject: "Change plan", priority: "low", sla: "24h", status: "pending" },
  { id: "#4923", client: "ZenCare Homes", subject: "Latency spike", priority: "med", sla: "8h", status: "open" },
];

/*****************************************
 * UTILITIES & SMALL COMPONENTS
 *****************************************/
const RiskBadge = ({ level }: { level: "low" | "med" | "high" }) => (
  <Badge variant={level === "high" ? "destructive" : level === "med" ? "default" : "secondary"}>{level}</Badge>
);

// Current user with RBAC
const currentUser: StaffMember = {
  id: "u1",
  name: "Kam Aslam",
  email: "kam@voicecake.io",
  role: "owner",
  active: true,
  lastActive: new Date().toISOString(),
  permissions: presetFor("owner"),
};

const hasPerm = (perm: PermissionKey) => !!currentUser.permissions[perm];

/*****************************************
 * BILLING HELPERS
 *****************************************/
function calcInvoice(p: Pricing, u: UsageInputs) {
  const conversa = u.minutesConversa * p.conversaPerMin;
  const empath = u.minutesEmpath * p.empathPerMin;
  const premium = u.premiumMinutes * p.premiumVoiceSurcharge;
  const packs = Math.ceil(Math.max(u.automations, 0) / 10000);
  const automations = packs * p.automationsPack;
  const total = Number((conversa + empath + premium + automations).toFixed(2));
  return { conversa, empath, premium, automations, total };
}

function fmtMoney(n: number) { return `$${n.toFixed(2)}`; }

/*****************************************
 * PDF EXPORT HELPERS
 *****************************************/
const sleep = (ms: number) => new Promise(r=>setTimeout(r, ms));

async function exportElementToPDF(element: HTMLElement, filename: string) {
  const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const imgHeight = canvas.height * (imgWidth / canvas.width);

  let y = 0;
  let remaining = imgHeight;
  const imgCanvasHeight = canvas.height;
  const imgCanvasWidth = canvas.width;

  while (remaining > 0) {
    const srcY = (imgHeight - remaining) * (imgCanvasHeight / imgHeight);
    const sliceHeight = Math.min(pageHeight, remaining);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = imgCanvasWidth;
    sliceCanvas.height = sliceHeight * (imgCanvasHeight / imgHeight);
    const ctx = sliceCanvas.getContext("2d");
    if (ctx) ctx.drawImage(canvas, 0, srcY, imgCanvasWidth, sliceCanvas.height, 0, 0, imgCanvasWidth, sliceCanvas.height);
    const sliceData = sliceCanvas.toDataURL("image/png");
    if (y > 0) pdf.addPage();
    pdf.addImage(sliceData, "PNG", 0, 0, imgWidth, sliceHeight);
    remaining -= sliceHeight;
    y += sliceHeight;
  }
  pdf.save(filename);
}

/*****************************************
 * MAIN COMPONENT
 *****************************************/
export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  // Pricing states
  const [globalPricing, setGlobalPricing] = useState<Pricing | null>(null);
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false);
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [accountCompany, setAccountCompany] = useState<string | null>(null);
  const [accountPricing, setAccountPricing] = useState<AccountPricing | null>(null);
  const [saving, setSaving] = useState(false);

  // Confirm impact dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState<{ scope: "global" | "account"; oldP: Pricing | AccountPricing; newP: Pricing | AccountPricing; company?: string } | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);

  // Simulate invoice
  const [simModalOpen, setSimModalOpen] = useState(false);
  const [simCompany, setSimCompany] = useState<string | null>(null);
  const [simUsage, setSimUsage] = useState<UsageInputs>({ minutesConversa: 1200, minutesEmpath: 800, automations: 18000, premiumMinutes: 150 });

  // Invoices state
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [newInvOpen, setNewInvOpen] = useState(false);
  const [newInvClient, setNewInvClient] = useState<string>(users[0]?.company || "");
  const [newInvPeriod, setNewInvPeriod] = useState<string>("Aug 2025");
  const [newInvCurrency, setNewInvCurrency] = useState<string>("USD");
  const [newInvItems, setNewInvItems] = useState<{ desc: string; qty: number; unit: number }[]>([
    { desc: "Conversa minutes", qty: 1000, unit: 0.12 },
    { desc: "Empath minutes", qty: 500, unit: 0.13 },
  ]);

  // Team & permissions
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editMember, setEditMember] = useState<StaffMember | null>(null);

  // Logs
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [logSearch, setLogSearch] = useState("");
  const [logSeverity, setLogSeverity] = useState<"all" | "error" | "warn" | "info">("all");
  const [logSource, setLogSource] = useState<"all" | LogItem["source"]>("all");
  const [viewLog, setViewLog] = useState<LogItem | null>(null);

  useEffect(() => {
    API.getGlobalPricing().then(setGlobalPricing);
    API.getAudit().then(setAudit);
    API.listStaff().then(setTeam);
    API.listLogs().then(setLogs);
  }, []);

  const filteredUsers = useMemo(
    () => users.filter(u => u.company.toLowerCase().includes(searchTerm.toLowerCase())),
    [searchTerm]
  );

  const filteredLogs = useMemo(()=>{
    return logs.filter(l=>{
      const sevOk = logSeverity === "all" || l.severity === logSeverity;
      const srcOk = logSource === "all" || l.source === logSource;
      const q = logSearch.toLowerCase();
      const text = `${l.code} ${l.message} ${l.client} ${l.correlationId}`.toLowerCase();
      return sevOk && srcOk && (!q || text.includes(q));
    });
  }, [logs, logSeverity, logSource, logSearch]);

  /*****************************************
   * PDF EXPORT ACTIONS
   *****************************************/
  const PAGE_DEFS: { key: string; title: string; domId: string }[] = [
    { key: "dashboard", title: "Dashboard", domId: "page-dashboard" },
    { key: "users", title: "Users & Accounts", domId: "page-users" },
    { key: "agents", title: "Agents & Bots", domId: "page-agents" },
    { key: "billing", title: "Billing & Financials", domId: "page-billing" },
    { key: "workflows", title: "Automation & Workflows", domId: "page-workflows" },
    { key: "telephony", title: "Telephony & Infrastructure", domId: "page-telephony" },
    { key: "security", title: "Security & Compliance", domId: "page-security" },
    { key: "support", title: "Support & Ticketing", domId: "page-support" },
    { key: "insights", title: "Strategic Insights", domId: "page-insights" },
    { key: "team", title: "Team & Permissions", domId: "page-team" },
    { key: "logs", title: "Error & Event Logs", domId: "page-logs" },
    { key: "devnotes", title: "Developer Notes", domId: "page-devnotes" },
  ];

  async function exportCurrentPagePDF() {
    const def = PAGE_DEFS.find(d=>d.key===activePage);
    if(!def) return alert("Unknown page");
    const el = document.getElementById(def.domId);
    if(!el) return alert("Nothing to export on this view");
    await exportElementToPDF(el, `voicecake-admin-${def.key}.pdf`);
  }

  async function exportAllPagesPDFs() {
    for (const def of PAGE_DEFS) {
      setActivePage(def.key);
      await sleep(450);
      const el = document.getElementById(def.domId);
      if (el) {
        await exportElementToPDF(el, `voicecake-admin-${def.key}.pdf`);
      }
    }
    alert("All page PDFs saved");
  }

  /*****************************************
   * PRICING & INVOICING DIALOGS
   *****************************************/
  const GlobalPricingDialog = () => (
    <Dialog open={globalDialogOpen} onOpenChange={setGlobalDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Global Pricing</DialogTitle>
          <DialogDescription>These rates apply platform-wide unless an account has an override.</DialogDescription>
        </DialogHeader>
        {globalPricing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            <div>
              <Label>Conversa, $/min</Label>
              <Input type="number" step="0.001" value={globalPricing.conversaPerMin}
                onChange={e=>setGlobalPricing({ ...globalPricing, conversaPerMin: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Empath, $/min</Label>
              <Input type="number" step="0.001" value={globalPricing.empathPerMin}
                onChange={e=>setGlobalPricing({ ...globalPricing, empathPerMin: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Automations pack (10k)</Label>
              <Input type="number" step="0.01" value={globalPricing.automationsPack}
                onChange={e=>setGlobalPricing({ ...globalPricing, automationsPack: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Premium voice surcharge, $/min</Label>
              <Input type="number" step="0.001" value={globalPricing.premiumVoiceSurcharge}
                onChange={e=>setGlobalPricing({ ...globalPricing, premiumVoiceSurcharge: Number(e.target.value) })} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={()=>setGlobalDialogOpen(false)}>Cancel</Button>
          <Button disabled={saving} onClick={async ()=>{
            if(!globalPricing) return;
            setConfirmContext({ scope: "global", oldP: await API.getGlobalPricing(), newP: globalPricing });
            setConfirmOpen(true);
          }}>Review Impact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const AccountPricingDialog = () => (
    <Dialog open={accountDialogOpen} onOpenChange={(open)=>{ setAccountDialogOpen(open); if(!open){ setAccountPricing(null); setAccountCompany(null);} }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Account Pricing Override</DialogTitle>
          <DialogDescription>{accountCompany || ""}</DialogDescription>
        </DialogHeader>
        {accountPricing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable override</Label>
                <p className="text-xs text-gray-500">If disabled, this account inherits global pricing.</p>
              </div>
              <Switch checked={accountPricing.enabled} onCheckedChange={(v)=>setAccountPricing({...accountPricing, enabled: v})} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Conversa, $/min</Label>
                <Input type="number" step="0.001" value={accountPricing.conversaPerMin}
                  onChange={e=>setAccountPricing({ ...accountPricing, conversaPerMin: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Empath, $/min</Label>
                <Input type="number" step="0.001" value={accountPricing.empathPerMin}
                  onChange={e=>setAccountPricing({ ...accountPricing, empathPerMin: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Automations pack (10k)</Label>
                <Input type="number" step="0.01" value={accountPricing.automationsPack}
                  onChange={e=>setAccountPricing({ ...accountPricing, automationsPack: Number(e.target.value) })} />
              </div>
              <div>
                <Label>Premium voice surcharge, $/min</Label>
                <Input type="number" step="0.001" value={accountPricing.premiumVoiceSurcharge}
                  onChange={e=>setAccountPricing({ ...accountPricing, premiumVoiceSurcharge: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="secondary" onClick={()=>setAccountDialogOpen(false)}>Cancel</Button>
          <Button disabled={saving} onClick={async ()=>{
            if(!accountCompany || !accountPricing) return;
            const current = await API.getAccountPricing(accountCompany);
            setConfirmContext({ scope: "account", oldP: current, newP: accountPricing, company: accountCompany });
            setConfirmOpen(true);
          }}>Review Impact</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const ConfirmImpactDialog = () => {
    if(!confirmContext) return null;
    const usage = { minutesConversa: 1200, minutesEmpath: 800, automations: 18000, premiumMinutes: 150 };
    const oldBill = calcInvoice(confirmContext.oldP as Pricing, usage);
    const newBill = calcInvoice(confirmContext.newP as Pricing, usage);
    const delta = Number((newBill.total - oldBill.total).toFixed(2));
    const up = delta >= 0;

    return (
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm {confirmContext.scope === "global" ? "Global" : `${confirmContext.company} Override`} Change</DialogTitle>
            <DialogDescription>This preview estimates the monthly impact based on typical usage.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 text-sm">
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="font-semibold">Old bill</p>
              <p>{fmtMoney(oldBill.total)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="font-semibold">New bill</p>
              <p>{fmtMoney(newBill.total)}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              <p className="font-semibold">Change</p>
              <p className={up ? "text-green-600" : "text-red-600"}>{up ? "+" : ""}{fmtMoney(delta)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold mb-1">Before</p>
              <ul className="text-xs space-y-1 list-disc pl-4">
                <li>Conversa: {fmtMoney((confirmContext.oldP as Pricing).conversaPerMin)} / min</li>
                <li>Empath: {fmtMoney((confirmContext.oldP as Pricing).empathPerMin)} / min</li>
                <li>Automations: {fmtMoney((confirmContext.oldP as Pricing).automationsPack)} per 10k</li>
                <li>Premium: {fmtMoney((confirmContext.oldP as Pricing).premiumVoiceSurcharge)} / min</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-1">After</p>
              <ul className="text-xs space-y-1 list-disc pl-4">
                <li>Conversa: {fmtMoney((confirmContext.newP as Pricing).conversaPerMin)} / min</li>
                <li>Empath: {fmtMoney((confirmContext.newP as Pricing).empathPerMin)} / min</li>
                <li>Automations: {fmtMoney((confirmContext.newP as Pricing).automationsPack)} per 10k</li>
                <li>Premium: {fmtMoney((confirmContext.newP as Pricing).premiumVoiceSurcharge)} / min</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={()=>setConfirmOpen(false)}>Back</Button>
            <Button disabled={saving} onClick={async ()=>{
              if(!confirmContext) return;
              setSaving(true);
              if(confirmContext.scope === "global"){
                const updated = await API.updateGlobalPricing(confirmContext.newP as Pricing, currentUser.name, "Changed via Admin UI");
                setGlobalPricing(updated);
                setGlobalDialogOpen(false);
              } else {
                await API.upsertAccountPricing(confirmContext.company!, confirmContext.newP as AccountPricing, currentUser.name, "Account override changed");
                setAccountDialogOpen(false);
              }
              const log = await API.getAudit();
              setAudit(log);
              setSaving(false);
              setConfirmOpen(false);
              alert("Pricing saved");
            }}>Confirm & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const SimulatedBreakdown = ({ company, usage }: { company: string | null; usage: UsageInputs }) => {
    const [accPricing, setAccPricing] = useState<AccountPricing | null>(null);
    const [gPricing, setGPricing] = useState<Pricing | null>(null);

    useEffect(()=>{ API.getGlobalPricing().then(setGPricing); if(company){ API.getAccountPricing(company).then(setAccPricing);} }, [company]);

    if(!gPricing) return null;
    const effective = company && accPricing?.enabled ? accPricing! : gPricing;
    const bill = calcInvoice(effective, usage);

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>Conversa</div><div className="text-right">{fmtMoney(bill.conversa)}</div>
          <div>Empath</div><div className="text-right">{fmtMoney(bill.empath)}</div>
          <div>Premium voices</div><div className="text-right">{fmtMoney(bill.premium)}</div>
          <div>Automations</div><div className="text-right">{fmtMoney(bill.automations)}</div>
          <div className="font-semibold">Total</div><div className="text-right font-semibold">{fmtMoney(bill.total)}</div>
        </div>
      </div>
    );
  };

  const SimulateInvoiceDialog = () => (
    <Dialog open={simModalOpen} onOpenChange={setSimModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulate Invoice {simCompany ? `– ${simCompany}` : "(Global)"}</DialogTitle>
          <DialogDescription>Adjust usage inputs to preview cost under current or overridden rates.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Conversa minutes</Label>
            <Input type="number" value={simUsage.minutesConversa} onChange={e=>setSimUsage({ ...simUsage, minutesConversa: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Empath minutes</Label>
            <Input type="number" value={simUsage.minutesEmpath} onChange={e=>setSimUsage({ ...simUsage, minutesEmpath: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Premium voice minutes</Label>
            <Input type="number" value={simUsage.premiumMinutes} onChange={e=>setSimUsage({ ...simUsage, premiumMinutes: Number(e.target.value) })} />
          </div>
          <div>
            <Label>Automations count</Label>
            <Input type="number" value={simUsage.automations} onChange={e=>setSimUsage({ ...simUsage, automations: Number(e.target.value) })} />
          </div>
        </div>
        <SimulatedBreakdown company={simCompany} usage={simUsage} />
        <DialogFooter>
          <Button variant="secondary" onClick={()=>setSimModalOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const NewInvoiceDialog = () => {
    const total = newInvItems.reduce((s,i)=> s + (Number(i.qty)||0) * (Number(i.unit)||0), 0);
    return (
      <Dialog open={newInvOpen} onOpenChange={setNewInvOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Invoice</DialogTitle>
            <DialogDescription>Raise a manual invoice for a client.</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div>
              <Label>Client</Label>
              <Select value={newInvClient} onValueChange={setNewInvClient}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {users.map(u=> (<SelectItem key={u.company} value={u.company}>{u.company}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Input value={newInvPeriod} onChange={e=>setNewInvPeriod(e.target.value)} placeholder="Aug 2025" />
            </div>
            <div>
              <Label>Currency</Label>
              <Select value={newInvCurrency} onValueChange={setNewInvCurrency}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-3">
            <Label>Line items</Label>
            <div className="space-y-2 mt-2">
              {newInvItems.map((it,idx)=> (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-6" placeholder="Description" value={it.desc}
                    onChange={e=>{ const arr=[...newInvItems]; arr[idx]={...it, desc:e.target.value}; setNewInvItems(arr); }} />
                  <Input className="col-span-2" type="number" placeholder="Qty" value={it.qty}
                    onChange={e=>{ const arr=[...newInvItems]; arr[idx]={...it, qty:Number(e.target.value)}; setNewInvItems(arr); }} />
                  <Input className="col-span-2" type="number" step="0.01" placeholder="Unit" value={it.unit}
                    onChange={e=>{ const arr=[...newInvItems]; arr[idx]={...it, unit:Number(e.target.value)}; setNewInvItems(arr); }} />
                  <div className="col-span-2 text-right">{fmtMoney((Number(it.qty)||0)*(Number(it.unit)||0))}</div>
                </div>
              ))}
              <div className="flex justify-between mt-2">
                <Button variant="outline" onClick={()=> setNewInvItems([...newInvItems, { desc:"", qty:1, unit:0 }])}>+ Add line</Button>
                <div className="text-right font-semibold">Total {fmtMoney(total)}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="secondary" onClick={()=>setNewInvOpen(false)}>Cancel</Button>
            <Button onClick={()=>{
              const id = `INV-${Math.floor(1000 + Math.random()*8999)}`;
              setInvoices([{ id, client: newInvClient, amount: Number(total.toFixed(2)), status: "due", period: newInvPeriod }, ...invoices]);
              setNewInvOpen(false);
            }}>Create Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  /*****************************************
   * SECTIONS
   *****************************************/
  const PageHeader = ({ title, cta }: { title: string; cta?: React.ReactNode }) => (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="flex items-center gap-2">{cta}</div>
    </div>
  );

  const DashboardCards = () => (
    <div id="page-dashboard">
      <main className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">MRR vs PAYG</h3>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="mrr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#4caf50" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="payg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2196f3" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2196f3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="mrr" stroke="#4caf50" fillOpacity={1} fill="url(#mrr)" />
                  <Area type="monotone" dataKey="payg" stroke="#2196f3" fillOpacity={1} fill="url(#payg)" />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">Usage Split</h3>
              <div className="flex items-center justify-center">
                <PieChart width={220} height={160}>
                  <Pie data={usageSplit} dataKey="value" cx="50%" cy="50%" outerRadius={60} label>
                    {usageSplit.map((_, i) => (
                      <Cell key={i} fill={i % 2 ? "#2196f3" : "#4caf50"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-1">Churn Predictor</h3>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={churnData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="churn" stroke="#e91e63" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Usage by Country */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 xl:col-span-3">
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Usage by Country</h3>
                <div className="text-xs text-gray-500">{countryUsage.length} countries active</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={countryUsage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="code" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#2196f3" name="Calls" />
                  <Bar dataKey="minutes" fill="#4caf50" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2 xl:col-span-3">
          <Card className="rounded-2xl shadow">
            <CardContent className="p-4">
              <PageHeader title="Recent Activity" cta={<Button variant="secondary"><Download className="w-4 h-4 mr-2"/>Export</Button>} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Invoice paid</TableCell>
                    <TableCell>Acme Health</TableCell>
                    <TableCell>5m ago</TableCell>
                    <TableCell><Badge>ok</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>New agent created</TableCell>
                    <TableCell>Nimbus Retail</TableCell>
                    <TableCell>18m ago</TableCell>
                    <TableCell><Badge variant="secondary">info</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );

  const UsersPage = () => (
    <div id="page-users" className="p-6">
      <PageHeader
        title="Users & Accounts"
        cta={
          <>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-500" />
                <Input placeholder="Search company" className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <Select>
                <SelectTrigger className="w-40"><SelectValue placeholder="Plan" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="starter">Starter</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Button><Plus className="w-4 h-4 mr-2" /> New Client</Button>
              <Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
            </div>
          </>
        }
      />

      <Card className="rounded-2xl shadow">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Auto-renew</TableHead>
                {hasPerm("account_pricing_edit") && <TableHead>Pricing</TableHead>}
                <TableHead className="text-right">MRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(u => (
                <TableRow key={u.company}>
                  <TableCell className="font-medium">{u.company}</TableCell>
                  <TableCell>{u.plan}</TableCell>
                  <TableCell>{u.seats}</TableCell>
                  <TableCell>
                    <Badge variant={u.status === "active" ? "default" : "secondary"}>{u.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Switch checked={u.autoRenew} onCheckedChange={() => alert("Toggle auto-renew (mock)")} />
                  </TableCell>
                  {hasPerm("account_pricing_edit") && (
                    <TableCell className="space-x-2">
                      <Button size="sm" variant="secondary" onClick={async ()=>{
                        setAccountCompany(u.company);
                        const data = await API.getAccountPricing(u.company);
                        setAccountPricing(data);
                        setAccountDialogOpen(true);
                      }}><Pencil className="w-4 h-4 mr-1"/>Override</Button>
                      <Button size="sm" variant="outline" onClick={()=>{ setSimCompany(u.company); setSimModalOpen(true); }}><Calculator className="w-4 h-4 mr-1"/>Simulate</Button>
                    </TableCell>
                  )}
                  <TableCell className="text-right">${u.mrr}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const AgentsPage = () => (
    <div id="page-agents" className="p-6">
      <PageHeader title="Agents & Bots" cta={hasPerm("agents_deploy") && <Button><Plus className="w-4 h-4 mr-2"/>New Agent</Button>} />
      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card className="rounded-2xl shadow">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Latency, ms</TableHead>
                    <TableHead>CSAT</TableHead>
                    <TableHead>Calls</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map(a => (
                    <TableRow key={a.name}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.type}</TableCell>
                      <TableCell>{a.client}</TableCell>
                      <TableCell>{a.latency}</TableCell>
                      <TableCell>{a.csat}</TableCell>
                      <TableCell>{a.calls}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl shadow"><CardContent className="p-4">
              <h4 className="font-semibold mb-2">Latency Distribution</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={agents.map(a=>({name:a.name, latency:a.latency}))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="latency" fill="#2196f3" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
            <Card className="rounded-2xl shadow"><CardContent className="p-4">
              <h4 className="font-semibold mb-2">CSAT by Agent</h4>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={agents.map(a=>({name:a.name, csat:a.csat}))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="csat" fill="#4caf50" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const BillingPage = () => (
    <div id="page-billing" className="p-6">
      <PageHeader
        title="Billing & Financials"
        cta={
          <div className="flex gap-2">
            <Button onClick={()=>setNewInvOpen(true)}><Plus className="w-4 h-4 mr-2"/>Create Invoice</Button>
            {hasPerm("pricing_edit") && (
              <>
                <Button onClick={()=>setGlobalDialogOpen(true)}><Pencil className="w-4 h-4 mr-2"/>Edit Global Pricing</Button>
                <Button variant="outline" onClick={()=>{ setSimCompany(null); setSimModalOpen(true); }}><Calculator className="w-4 h-4 mr-2"/>Simulate Invoice</Button>
              </>
            )}
            <Button variant="secondary" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
            <Button><Filter className="w-4 h-4 mr-2"/>Filters</Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow lg:col-span-2"><CardContent className="p-4">
          <h4 className="font-semibold mb-2">Revenue</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="mrr" stroke="#4caf50" strokeWidth={2} />
              <Line type="monotone" dataKey="payg" stroke="#2196f3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Invoices</h4>
            <div className="text-xs text-gray-500 flex items-center gap-1"><History className="w-3 h-3"/> audit</div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map(inv=> (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.client}</TableCell>
                  <TableCell>{inv.period}</TableCell>
                  <TableCell>${inv.amount}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "paid" ? "default" : inv.status === "due" ? "destructive" : "secondary"}>{inv.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>

      {/* Revenue by Country */}
      <div className="mt-6">
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Revenue by Country</h4>
            <span className="text-xs text-gray-500">last 30 days</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryUsage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="code" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#4caf50" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
      </div>

      {/* Audit log table */}
      <div className="mt-6">
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold">Pricing Change History</h4>
            <span className="text-xs text-gray-500">{audit.length} events</span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {audit.map((e,i)=> (
                <TableRow key={i}>
                  <TableCell>{new Date(e.at).toLocaleString()}</TableCell>
                  <TableCell>{e.actor}</TableCell>
                  <TableCell><Badge variant={e.scope === "global" ? "default" : "secondary"}>{e.scope}</Badge></TableCell>
                  <TableCell>{e.account || "-"}</TableCell>
                  <TableCell className="text-xs">
                    {Object.keys(e.to).map(k=>{
                      const key = k as keyof Pricing;
                      // @ts-ignore
                      const before = e.from[key];
                      // @ts-ignore
                      const after = e.to[key];
                      if(before === after) return null;
                      return <div key={k}><span className="uppercase">{k}</span>: {fmtMoney(Number(before))} → {fmtMoney(Number(after))}</div>;
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </div>
  );

  const WorkflowsPage = () => (
    <div id="page-workflows" className="p-6">
      <PageHeader
        title="Automation & Workflows"
        cta={hasPerm("workflows_edit") && <Button><Plus className="w-4 h-4 mr-2"/>New Workflow</Button>}
      />
      <Card className="rounded-2xl shadow"><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Workflow</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Runs</TableHead>
              <TableHead>Failures</TableHead>
              <TableHead>Last Run</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workflows.map(w => (
              <TableRow key={w.name}>
                <TableCell className="font-medium">{w.name}</TableCell>
                <TableCell>{w.client}</TableCell>
                <TableCell>{w.runs}</TableCell>
                <TableCell>{w.fails}</TableCell>
                <TableCell>{w.lastRun}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );

  const TelephonyPage = () => (
    <div id="page-telephony" className="p-6">
      <PageHeader title="Telephony & Infrastructure" cta={<Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <h4 className="font-semibold mb-2">Call Traffic (today)</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={numbers.map(n=>({name:n.client, inbound:n.inbound, outbound:n.outbound}))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="inbound" fill="#4caf50" />
              <Bar dataKey="outbound" fill="#2196f3" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="rounded-2xl shadow"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Inbound</TableHead>
                <TableHead>Outbound</TableHead>
                <TableHead>Health</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {numbers.map(n => (
                <TableRow key={n.number}>
                  <TableCell className="font-medium">{n.number}</TableCell>
                  <TableCell>{n.client}</TableCell>
                  <TableCell>{n.mappedTo}</TableCell>
                  <TableCell>{n.inbound}</TableCell>
                  <TableCell>{n.outbound}</TableCell>
                  <TableCell><Badge variant={n.health === "ok" ? "default" : "destructive"}>{n.health}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </div>
  );

  const SecurityPage = () => (
    <div id="page-security" className="p-6">
      <PageHeader title="Security & Compliance" cta={<Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityEvents.map(e => (
                <TableRow key={e.time + e.actor}>
                  <TableCell>{e.time}</TableCell>
                  <TableCell>{e.actor}</TableCell>
                  <TableCell>{e.action}</TableCell>
                  <TableCell><RiskBadge level={e.risk as any} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <h4 className="font-semibold mb-2">Policy Checks</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>GDPR data deletion window: <Badge>30 days</Badge></li>
            <li>Encryption at rest: <Badge>enabled</Badge></li>
            <li>Audit log retention: <Badge>180 days</Badge></li>
          </ul>
        </CardContent></Card>
      </div>
    </div>
  );

  const SupportPage = () => (
    <div id="page-support" className="p-6">
      <PageHeader title="Support & Ticketing" cta={<Button variant="secondary" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>} />
      <Card className="rounded-2xl shadow"><CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.id}</TableCell>
                <TableCell>{t.client}</TableCell>
                <TableCell>{t.subject}</TableCell>
                <TableCell><Badge variant={t.priority === "high" ? "destructive" : t.priority === "med" ? "default" : "secondary"}>{t.priority}</Badge></TableCell>
                <TableCell>{t.sla}</TableCell>
                <TableCell>{t.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );

  const InsightsPage = () => (
    <div id="page-insights" className="p-6">
      <PageHeader title="Strategic Insights" cta={<Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-2xl shadow lg:col-span-2"><CardContent className="p-4">
          <h4 className="font-semibold mb-2">Cohort Retention</h4>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#4caf50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent></Card>
        <Card className="rounded-2xl shadow"><CardContent className="p-4">
          <h4 className="font-semibold mb-2">Top Voice Types</h4>
          <PieChart width={260} height={220}>
            <Pie data={usageSplit} dataKey="value" cx="50%" cy="50%" outerRadius={70}>
              {usageSplit.map((_, i) => (<Cell key={i} fill={i % 2 ? "#2196f3" : "#4caf50"} />))}
            </Pie>
            <Tooltip />
          </PieChart>
        </CardContent></Card>
      </div>
    </div>
  );

  // Team & Permissions page
  const TeamPage = () => {
    const [inviteName, setInviteName] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState<Role>("subadmin");

    return (
      <div id="page-team" className="p-6">
        <PageHeader
          title="Team & Permissions"
          cta={hasPerm("team_manage") && (
            <div className="flex gap-2">
              <Button onClick={()=>setInviteOpen(true)}><Plus className="w-4 h-4 mr-2"/>Invite Member</Button>
              <Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
            </div>
          )}
        />
        <Card className="rounded-2xl shadow"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Active</TableHead>
                {hasPerm("team_manage") && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell className="capitalize">{m.role}</TableCell>
                  <TableCell>{m.active ? <Badge>active</Badge> : <Badge variant="secondary">disabled</Badge>}</TableCell>
                  <TableCell>{new Date(m.lastActive).toLocaleString()}</TableCell>
                  {hasPerm("team_manage") && (
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>setEditMember(m)}><KeyRound className="w-4 h-4 mr-1"/>Permissions</Button>
                      <Button size="sm" variant="destructive" onClick={()=>alert("Disable user (mock)")}><Lock className="w-4 h-4 mr-1"/>Disable</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>

        {/* Invite modal */}
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Team Member</DialogTitle>
              <DialogDescription>They will receive an email with a link to set a password.</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={inviteName} onChange={e=>setInviteName(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)} />
              </div>
              <div className="md:col-span-2">
                <Label>Role preset</Label>
                <Select value={inviteRole} onValueChange={(v:any)=>setInviteRole(v)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="subadmin">Subadmin</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={()=>setInviteOpen(false)}>Cancel</Button>
              <Button onClick={async()=>{
                const m = await API.createStaff(inviteName, inviteEmail, inviteRole);
                setTeam([m, ...team]);
                setInviteOpen(false);
                setInviteName(""); setInviteEmail(""); setInviteRole("subadmin");
              }}>Send Invite</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit member permissions */}
        <Dialog open={!!editMember} onOpenChange={(open)=>{ if(!open) setEditMember(null); }}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Permissions</DialogTitle>
              <DialogDescription>{editMember?.name} · {editMember?.email}</DialogDescription>
            </DialogHeader>
            {editMember && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-2">
                  <Label>Role preset</Label>
                  <Select value={editMember.role} onValueChange={(v:any)=> setEditMember({ ...editMember, role: v, permissions: presetFor(v) })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="subadmin">Subadmin</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" onClick={()=> setEditMember({ ...editMember, permissions: presetFor(editMember.role) })}><Shield className="w-4 h-4 mr-1"/>Reset to preset</Button>
                  </div>
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-3 text-sm">
                  {PERMISSION_LIST.map(key=> (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-lg border bg-white">
                      <Checkbox checked={!!editMember.permissions[key]} onCheckedChange={(v)=> setEditMember({ ...editMember, permissions: { ...editMember.permissions, [key]: !!v } })} />
                      <span className="uppercase tracking-wide text-xs">{key.replace(/_/g," ")}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="secondary" onClick={()=>setEditMember(null)}>Cancel</Button>
              <Button onClick={async()=>{
                if(!editMember) return;
                const saved = await API.upsertStaff(editMember);
                setTeam(prev=> prev.map(m=> m.id===saved.id ? saved : m));
                setEditMember(null);
              }}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  // Error Logs page
  const LogsPage = () => (
    <div id="page-logs" className="p-6">
      <PageHeader
        title="Error & Event Logs"
        cta={
          <div className="flex gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-gray-500" />
              <Input placeholder="Search code, message, correlation id" className="pl-8 w-72" value={logSearch} onChange={e=>setLogSearch(e.target.value)} />
            </div>
            <Select value={logSeverity} onValueChange={(v:any)=>setLogSeverity(v)}>
              <SelectTrigger className="w-32"><SelectValue placeholder="Severity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warn">Warn</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={logSource} onValueChange={(v:any)=>setLogSource(v)}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Source" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Agent">Agent</SelectItem>
                <SelectItem value="Workflow">Workflow</SelectItem>
                <SelectItem value="Telephony">Telephony</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="API">API</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
          </div>
        }
      />

      {!hasPerm("logs_view") ? (
        <div className="p-6 rounded-xl bg-yellow-50 text-yellow-900">Your role cannot view logs. Ask an admin to grant <b>logs_view</b>.</div>
      ) : (
        <Card className="rounded-2xl shadow"><CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Correlation</TableHead>
                {hasPerm("logs_manage") && <TableHead className="text-right">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(l=> (
                <TableRow key={l.id} className="hover:bg-gray-50">
                  <TableCell>{new Date(l.time).toLocaleString()}</TableCell>
                  <TableCell>{l.client}</TableCell>
                  <TableCell>{l.source}</TableCell>
                  <TableCell>
                    <Badge variant={l.severity === "error" ? "destructive" : l.severity === "warn" ? "default" : "secondary"}>{l.severity}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.code}</TableCell>
                  <TableCell className="truncate max-w-[320px]">{l.message}</TableCell>
                  <TableCell className="font-mono text-xs">{l.correlationId}</TableCell>
                  {hasPerm("logs_manage") && (
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={()=>{ navigator.clipboard?.writeText(l.correlationId); }}><Copy className="w-4 h-4 mr-1"/>Copy ID</Button>
                      <Button size="sm" variant="secondary" onClick={()=>setViewLog(l)}><Eye className="w-4 h-4 mr-1"/>Details</Button>
                      <Button size="sm" variant="destructive" onClick={async()=>{ await API.deleteLog(l.id); setLogs(await API.listLogs()); }}><Trash2 className="w-4 h-4 mr-1"/>Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      )}

      {/* Log details */}
      <Dialog open={!!viewLog} onOpenChange={(open)=>{ if(!open) setViewLog(null); }}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>{viewLog?.client} · {viewLog?.source} · {viewLog?.severity}</DialogDescription>
          </DialogHeader>
          {viewLog && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Time</Label><div>{new Date(viewLog.time).toLocaleString()}</div></div>
                <div><Label>Correlation ID</Label><div className="font-mono">{viewLog.correlationId}</div></div>
                {viewLog.requestId && <div><Label>Request/Run</Label><div className="font-mono">{viewLog.requestId}</div></div>}
                {typeof viewLog.httpStatus !== 'undefined' && <div><Label>HTTP Status</Label><div>{viewLog.httpStatus}</div></div>}
              </div>
              <div>
                <Label>Message</Label>
                <div className="p-2 rounded-md bg-gray-50">{viewLog.message}</div>
              </div>
              {viewLog.meta && (
                <div>
                  <Label>Metadata</Label>
                  <pre className="p-2 rounded-md bg-gray-50 overflow-auto max-h-48 text-xs">{JSON.stringify(viewLog.meta, null, 2)}</pre>
                </div>
              )}
              {viewLog.stack && (
                <div>
                  <Label>Stack</Label>
                  <pre className="p-2 rounded-md bg-gray-50 overflow-auto max-h-48 text-xs">{viewLog.stack}</pre>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" onClick={()=> navigator.clipboard?.writeText(viewLog.correlationId)}><Copy className="w-4 h-4 mr-2"/>Copy Correlation</Button>
                <Button onClick={()=> alert("Create support ticket with log attached (mock)")}>Create Ticket</Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={()=>setViewLog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  const DevNotesPage = () => (
    <div id="page-devnotes" className="p-6">
      <PageHeader title="Developer Notes" cta={<Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>} />
      <Card className="rounded-2xl shadow"><CardContent className="p-4 space-y-4 text-sm">
        <section>
          <h4 className="font-semibold">Geo Usage</h4>
          <ul className="list-disc pl-5">
            <li>Endpoint: <code>/api/metrics/geo-usage?from&to</code> returns <code>{`[{ country, code, calls, minutes, revenue }]`}</code></li>
            <li>Used on Dashboard and Billing pages. Cache for 15 minutes.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold">Invoicing</h4>
          <ul className="list-disc pl-5">
            <li>POST <code>/api/invoices</code> body <code>{`{ client, period, currency, items:[{ desc, qty, unit }] }`}</code>, returns <code>{`{ id, status, amount }`}</code></li>
            <li>GET <code>/api/invoices?client=&period=</code> list with pagination.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold">Pricing</h4>
          <ul className="list-disc pl-5">
            <li>GET/PUT <code>/v1/admin/pricing</code> for global.
            </li>
            <li>GET/PUT <code>/v1/accounts/:id/pricing</code> for overrides.</li>
            <li>Audit stream: <code>/v1/admin/audit</code> with actor, scope, before/after.</li>
          </ul>
        </section>
        <section>
          <h4 className="font-semibold">Permissions</h4>
          <ul className="list-disc pl-5">
            <li>RBAC flags inline as booleans, tie to JWT claims.</li>
            <li>Gate sensitive actions, eg <code>pricing_edit</code>, <code>logs_manage</code>.</li>
          </ul>
        </section>
      </CardContent></Card>
    </div>
  );

  // Gallery Page to preview all pages in one place
  const PreviewFrame = ({ title, onOpen, children }: { title: string; onOpen: () => void; children: React.ReactNode }) => (
    <Card className="rounded-2xl shadow">
      <CardContent className="p-0">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <h4 className="font-semibold">{title}</h4>
          <Button size="sm" onClick={onOpen}>Open</Button>
        </div>
        <div className="p-3 bg-gray-100">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm transform scale-[0.9] origin-top-left pointer-events-none">
            {children}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const GalleryPage = () => (
    <div className="p-6">
      <PageHeader title="Pages Gallery" cta={<div className="flex items-center gap-2"><Button variant="outline" onClick={exportAllPagesPDFs}><FileDown className="w-4 h-4 mr-2"/>Export All PDFs</Button></div>} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PreviewFrame title="Dashboard" onOpen={()=>setActivePage("dashboard")}><DashboardCards/></PreviewFrame>
        <PreviewFrame title="Users & Accounts" onOpen={()=>setActivePage("users")}><UsersPage/></PreviewFrame>
        <PreviewFrame title="Agents & Bots" onOpen={()=>setActivePage("agents")}><AgentsPage/></PreviewFrame>
        <PreviewFrame title="Billing & Financials" onOpen={()=>setActivePage("billing")}><BillingPage/></PreviewFrame>
        <PreviewFrame title="Automation & Workflows" onOpen={()=>setActivePage("workflows")}><WorkflowsPage/></PreviewFrame>
        <PreviewFrame title="Telephony & Infrastructure" onOpen={()=>setActivePage("telephony")}><TelephonyPage/></PreviewFrame>
        <PreviewFrame title="Security & Compliance" onOpen={()=>setActivePage("security")}><SecurityPage/></PreviewFrame>
        <PreviewFrame title="Support & Ticketing" onOpen={()=>setActivePage("support")}><SupportPage/></PreviewFrame>
        <PreviewFrame title="Strategic Insights" onOpen={()=>setActivePage("insights")}><InsightsPage/></PreviewFrame>
        <PreviewFrame title="Team & Permissions" onOpen={()=>setActivePage("team")}><TeamPage/></PreviewFrame>
        <PreviewFrame title="Error & Event Logs" onOpen={()=>setActivePage("logs")}><LogsPage/></PreviewFrame>
        <PreviewFrame title="Developer Notes" onOpen={()=>setActivePage("devnotes")}><DevNotesPage/></PreviewFrame>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case "users": return <UsersPage/>;
      case "agents": return <AgentsPage/>;
      case "billing": return <BillingPage/>;
      case "workflows": return <WorkflowsPage/>;
      case "telephony": return <TelephonyPage/>;
      case "security": return <SecurityPage/>;
      case "support": return <SupportPage/>;
      case "insights": return <InsightsPage/>;
      case "team": return <TeamPage/>;
      case "logs": return <LogsPage/>;
      case "gallery": return <GalleryPage/>;
      case "devnotes": return <DevNotesPage/>;
      default: return <DashboardCards/>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-4 flex flex-col">
        <h1 className="text-xl font-bold mb-6">VoiceCake Admin</h1>
        <nav className="flex flex-col space-y-2">
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("dashboard")}>Dashboard</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("gallery")}><LayoutGrid className="w-4 h-4 mr-2"/>Pages Gallery</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("users")}>Users & Accounts</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("agents")}>Agents & Bots</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("billing")}>Billing</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("workflows")}>Workflows</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("telephony")}>Telephony</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("security")}>Security</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("support")}>Support</Button>
          <Button variant="ghost" className="justify-start" onClick={() => setActivePage("insights")}>Insights</Button>
          <div className="mt-3 pt-3 border-t">
            <Button variant="ghost" className="justify-start" onClick={() => setActivePage("team")}><KeyRound className="w-4 h-4 mr-2"/>Team & Permissions</Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActivePage("logs")}><Bug className="w-4 h-4 mr-2"/>Error Logs</Button>
            <Button variant="ghost" className="justify-start" onClick={() => setActivePage("devnotes")}>Developer Notes</Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h2 className="text-lg font-semibold capitalize">{activePage} Overview</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={exportCurrentPagePDF}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
            <Button variant="secondary" onClick={exportAllPagesPDFs}><FileDown className="w-4 h-4 mr-2"/>Export All</Button>
            <Button variant="ghost"><Bell className="w-5 h-5" /></Button>
            <Button variant="ghost"><Settings className="w-5 h-5" /></Button>
            <Button variant="outline"><User className="w-5 h-5 mr-2" /> {currentUser.name}</Button>
          </div>
        </header>

        {renderPage()}
      </div>

      {/* Global modals */}
      <GlobalPricingDialog />
      <AccountPricingDialog />
      <ConfirmImpactDialog />
      <SimulateInvoiceDialog />
      <NewInvoiceDialog />
    </div>
  );
}
