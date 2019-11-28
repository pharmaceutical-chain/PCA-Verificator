interface ISupplyChain {
  batchCA: string;
  medicine: string;
  batchNumber: string;
  mfg: string;
  exp: string;
  classification: string;
  price: number;
  unit: string;
  madeIn: string;
  madeBy: string;
  supplyChain: Array<ITransfer>;
}

interface ITransfer {
  type: string;
  tenantName: string;
  tenantCA: string;
  tenantPhone?: string;
  transferTime?: string;
  transferCA?: string;
  transferQuantity?: number;
  transferUnit?: string;
}

