import React, { useState } from "react";
import type { Order } from "../../types";
import { downloadInvoice } from "../../utils/documents";
import Button from "../atoms/Button";
import Icon from "../atoms/Icon";

export default function InvoiceDownload({ record }: { record: Order }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" disabled={busy} icon={<Icon name="download" size={16} />}
        onClick={async () => {
          setBusy(true); setError("");
          try { await downloadInvoice(record); }
          catch { setError("No se pudo generar el documento. Intenta nuevamente."); }
          finally { setBusy(false); }
        }}>
        {busy ? "Generando PDF…" : "Descargar comprobante PDF"}
      </Button>
      {error && <div role="alert" className="text-xs text-red-700">{error}</div>}
    </div>
  );
}
