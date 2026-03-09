import mongoose from "mongoose";

const ledgerSchema = new mongoose.Schema(
  {
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Ledger must be associated with an account"],
      index: true,
      immutable: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required for ledger entry"],
      immutable: true,
    },
    transaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transaction",
      required: [true, "Ledger must be associated with transaction"],
      index: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: {
        values: ["CREDIT", "DEBIT"],
        message: "Type can be either CREDIT or DEBIT",
      },
      immutable: true,
      required: [true, "Ledger must be associated with a type"],
    },
  },
  {
    timestamps: true,
  },
);

ledgerSchema.index({
  account: 1,
  createdAt: 1,
});

function preventLedgerModification() {
  throw new Error(
    "Ledger entries are immutable and cannot be modified or deleted ",
  );
}

// ledgerSchema.pre("updateOne", preventLedgerModification);
// ledgerSchema.pre("updateMany", preventLedgerModification);
// ledgerSchema.pre("deleteOne", preventLedgerModification);
// ledgerSchema.pre("deleteMany", preventLedgerModification);
// ledgerSchema.pre("remove", preventLedgerModification);
// ledgerSchema.pre("findOneAndUpdate", preventLedgerModification);
// ledgerSchema.pre("findOneAndDelete", preventLedgerModification);
// ledgerSchema.pre("findOneAndReplace", preventLedgerModification);

[
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
  "findOneAndReplace",
  "remove",
].forEach((state) => ledgerSchema.pre(state, preventLedgerModification));

export const Ledger = mongoose.model("ledger", ledgerSchema);
