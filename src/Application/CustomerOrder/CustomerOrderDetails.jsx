import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { customerApi } from "../../config/configData";
import { DashBoardContext } from "../../DashBoardContext/DashBoardContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Truck, Upload, X as XIcon } from "lucide-react";

const supplierStatusMap = {
  A: { label: "Accepted", variant: "success", icon: CheckCircle },
  R: { label: "Rejected", variant: "destructive", icon: XCircle },
  P: { label: "Pending", variant: "warning", icon: Clock },
};

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const ImageGallery = ({ images }) => {
  const [current, setCurrent] = useState(0);
  const valid = Array.isArray(images) ? images.filter(Boolean) : [];

  if (!valid.length)
    return <p className="text-xs text-gray-400 italic text-center py-4">No images</p>;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full">
        <img
          src={valid[current]}
          alt={`img-${current}`}
          className="w-full h-44 object-contain rounded-lg border border-gray-200 bg-gray-50"
          onError={(e) => { e.target.alt = "Image not available"; }}
        />
        {valid.length > 1 && (
          <>
            <button
              onClick={() => setCurrent((p) => (p - 1 + valid.length) % valid.length)}
              className="absolute left-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 shadow flex items-center justify-center"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrent((p) => (p + 1) % valid.length)}
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full w-7 h-7 shadow flex items-center justify-center"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </>
        )}
        {valid.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
            {current + 1}/{valid.length}
          </span>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const cfg = supplierStatusMap[status] || { label: status || "Unknown", variant: "default", icon: Clock };
  const Icon = cfg.icon;
  return (
    <Badge variant={cfg.variant} className="flex items-center gap-1 w-fit text-xs">
      <Icon className="w-3 h-3" />
      {cfg.label}
    </Badge>
  );
};

const OrderCard = ({ order, onAccept, onReject, onDispatch, orderIndex }) => {
  const isPending = order.Supplier_status === "P";
  const isAccepted = order.Supplier_status === "A";



  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Order ID</p>
            <p className="text-sm font-bold text-gray-800">{orderIndex + 1}</p>
          </div>
          <StatusBadge status={order?.Supplier_status===''} />
        </div>
      </CardHeader>

      <CardContent className="px-4 py-0 flex flex-col gap-3 flex-1">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1">
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Product</p>
            <p className="text-sm font-semibold text-gray-800">{order.productname || "—"}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Weight (gm)</p>
            <p className="text-sm font-semibold text-gray-800">
              {order.ho_approx_wt || order.customer_wt || "—"}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Due Date</p>
            <p className="text-sm font-medium text-gray-700">{formatDate(order.ho_approx_date)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-400 uppercase tracking-wide">Metal</p>
            <p className="text-sm font-medium text-gray-700">{order.metaltype || "—"}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Images</p>
          <ImageGallery images={order.images} />
        </div>
      </CardContent>

      {isPending && (
        <CardFooter className="px-4 pt-3 pb-4 flex gap-2">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            size="sm"
            onClick={() => onAccept(order)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Accept
          </Button>
          <Button
            className="flex-1"
            variant="destructive"
            size="sm"
            onClick={() => onReject(order)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Reject
          </Button>
        </CardFooter>
      )}

      {isAccepted ||order?.Supplier_status==='T'&& (
        <CardFooter className="px-4 pt-3 pb-4">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
            onClick={() => onDispatch(order)}
          >
            <Truck className="w-4 h-4 mr-1" />
            Dispatch
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

const ImageUploadSection = ({ label, files, previews, onChange, onRemove, accept = "image/*" }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
      <Upload className="w-4 h-4 text-gray-400 mb-1" />
      <span className="text-xs text-gray-500">Click to upload</span>
      <input type="file" accept={accept} multiple className="hidden" onChange={onChange} />
    </label>
    {previews.length > 0 && (
      <div className="grid grid-cols-3 gap-2">
        {previews.map((src, i) => (
          <div key={i} className="relative group">
            {src.startsWith("blob:") && files[i]?.type === "application/pdf" ? (
              <div className="w-full h-16 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-red-50 gap-1">
                <span className="text-red-500 text-xs font-bold">PDF</span>
                <span className="text-[10px] text-gray-500 truncate w-full text-center px-1">{files[i].name}</span>
              </div>
            ) : (
              <img
                src={src}
                alt={`preview-${i}`}
                className="w-full h-16 object-cover rounded-md border border-gray-200"
              />
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <XIcon className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>
    )}
    {files.length > 0 && (
      <p className="text-xs text-gray-400">{files.length} file{files.length > 1 ? "s" : ""} selected</p>
    )}
  </div>
);

const DispatchDialog = ({ order, open, onClose, onConfirm, loading }) => {
  const [form, setForm] = useState({
    confirmWeight: "",
    confirmDate: "",
    invoice_no: "",
    invoice_date: "",
  });
  const [invoiceImages, setInvoiceImages] = useState([]);
  const [invoicePreviews, setInvoicePreviews] = useState([]);
  const [dispatchImages, setDispatchImages] = useState([]);
  const [dispatchPreviews, setDispatchPreviews] = useState([]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addFiles = (files, setFiles, setPreviews) => {
    setFiles((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (index, files, setFiles, previews, setPreviews) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(files.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setForm({ confirmWeight: "", confirmDate: "", invoice_no: "", invoice_date: "" });
    [...invoicePreviews, ...dispatchPreviews].forEach((p) => URL.revokeObjectURL(p));
    setInvoiceImages([]); setInvoicePreviews([]);
    setDispatchImages([]); setDispatchPreviews([]);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(order, form, invoiceImages, dispatchImages);
  };

  const isValid =
    form.confirmWeight.trim() &&
    form.confirmDate &&
    form.invoice_no.trim() &&
    form.invoice_date;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-blue-700 flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Dispatch Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-gray-500">
            {order?.productname && (
              <>— <span className="font-medium text-gray-700">{order.productname}</span></>
            )}
          </p>

          {/* Confirm Weight & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="confirmWeight">Confirm Weight (gm)</Label>
              <Input
                id="confirmWeight"
                name="confirmWeight"
                type="number"
                placeholder="e.g. 12"
                value={form.confirmWeight}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmDate">Confirm Date</Label>
              <Input
                id="confirmDate"
                name="confirmDate"
                type="date"
                value={form.confirmDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Invoice No & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="invoice_no">Invoice No</Label>
              <Input
                id="invoice_no"
                name="invoice_no"
                placeholder="e.g. INV-001"
                value={form.invoice_no}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="invoice_date">Invoice Date</Label>
              <Input
                id="invoice_date"
                name="invoice_date"
                type="date"
                value={form.invoice_date}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Separator */}
          <div className="border-t border-gray-200" />

          {/* Invoice — PDF or image */}
          <ImageUploadSection
            label="Invoice (PDF / Image)"
            files={invoiceImages}
            previews={invoicePreviews}
            accept="application/pdf,image/*"
            onChange={(e) => addFiles(Array.from(e.target.files), setInvoiceImages, setInvoicePreviews)}
            onRemove={(i) => removeFile(i, invoiceImages, setInvoiceImages, invoicePreviews, setInvoicePreviews)}
          />

          {/* Dispatch Images */}
          <ImageUploadSection
            label="Dispatch Images"
            files={dispatchImages}
            previews={dispatchPreviews}
            onChange={(e) => addFiles(Array.from(e.target.files), setDispatchImages, setDispatchPreviews)}
            onRemove={(i) => removeFile(i, dispatchImages, setDispatchImages, dispatchPreviews, setDispatchPreviews)}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleConfirm}
            disabled={!isValid || loading}
          >
            {loading ? "Dispatching..." : "Confirm Dispatch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const RejectDialog = ({ order, open, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(order, reason);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            Reject Order
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <p className="text-sm text-gray-600">
            Order: <span className="font-semibold text-gray-800">{order?.orderid}</span>
          </p>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Reason for Rejection
            </label>
            <Textarea
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || loading}
          >
            {loading ? "Rejecting..." : "Confirm Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CustomerOrderDetails = () => {
  const { suppCode } = useContext(DashBoardContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [rejectDialog, setRejectDialog] = useState({ open: false, order: null });
  const [dispatchDialog, setDispatchDialog] = useState({ open: false, order: null, orderIndex: null });

  useEffect(() => {
    if (!suppCode) return;
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${customerApi}/verify-supplier-ord?vendorName=${suppCode}`);
        const data = res.data?.orders || res.data || [];
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [suppCode]);

  const updateOrderStatus = (orderid, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderid === orderid ? { ...o, Supplier_status: newStatus } : o
      )
    );
  };

  const handleAccept = async (order) => {
    setActionLoading(true);
    try {
      await axios.post(`${customerApi}/supplier-order/orderaccept`, {
         orderId: order.orderid, companyName: order.supplier_name, confirmedWeight: order.ho_approx_wt, confirmedDate: order.ho_approx_date,
        // supplier_log_id: order.supplier_log_id,
        // status: "A",
      });
      updateOrderStatus(order.orderid, "A");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to accept order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (order) => {
    setRejectDialog({ open: true, order });
  };

  const handleDispatch = (order, index) => {
    setDispatchDialog({ open: true, order, orderIndex: index });
  };

  const handleDispatchConfirm = async (order, form, invoiceImages, dispatchImages) => {
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("orderId", order.orderid);
      formData.append("companyName", order.supplier_name);
      formData.append("confirmWeight", form.confirmWeight);
      formData.append("confirmDate", form.confirmDate);
      formData.append("invoice_no", form.invoice_no);
      formData.append("invoice_date", form.invoice_date);
      invoiceImages.forEach((img) => formData.append("invoice", img));
      dispatchImages.forEach((img) => formData.append("dispatchImages", img));
      await axios.post(`${customerApi}/supplier-order/product-dispatch`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateOrderStatus(order.orderid, "D");
      setDispatchDialog({ open: false, order: null, orderIndex: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to dispatch order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectConfirm = async (order, reason) => {
    setActionLoading(true);
    try {
      await axios.post(`${customerApi}/supplier/order-reject`, {
       orderId: order.orderid, companyName: order.supplier_name, rejectReason : reason,
      });
      updateOrderStatus(order.orderid, "R");
      setRejectDialog({ open: false, order: null });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject order");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.orderid?.toLowerCase().includes(q) ||
      o.customername?.toLowerCase().includes(q) ||
      o.productname?.toLowerCase().includes(q) ||
      o.mobileno?.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Orders</h1>
        {/* {suppCode && (
          <p className="text-sm text-gray-500 mt-1">
            Supplier Code: <span className="font-medium text-gray-700">{suppCode}</span>
          </p>
        )} */}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search by order ID, customer, or product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {!suppCode && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg">No supplier code found. Please log in as a supplier.</p>
        </div>
      )}

      {suppCode && loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      )}

      {suppCode && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 max-w-md">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {suppCode && !loading && !error && filtered.length === 0 && (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg">No orders found</p>
          {search && (
            <button onClick={() => setSearch("")} className="mt-2 text-blue-500 text-sm underline">
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Showing {filtered.length} of {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((order,index) => (
              <OrderCard
                key={order.orderid}
                order={order}
                onAccept={handleAccept}
                onReject={handleReject}
                onDispatch={(o) => handleDispatch(o, index)}
                orderIndex={index}
              />
            ))}
          </div>
        </>
      )}

      <RejectDialog
        order={rejectDialog.order}
        open={rejectDialog.open}
        onClose={() => setRejectDialog({ open: false, order: null })}
        onConfirm={handleRejectConfirm}
        loading={actionLoading}
      />

      <DispatchDialog
        order={dispatchDialog.order}
        orderIndex={dispatchDialog.orderIndex}
        open={dispatchDialog.open}
        onClose={() => setDispatchDialog({ open: false, order: null, orderIndex: null })}
        onConfirm={handleDispatchConfirm}
        loading={actionLoading}
      />
    </div>
  );
};

export default CustomerOrderDetails;
