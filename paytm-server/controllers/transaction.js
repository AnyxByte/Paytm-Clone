import mongoose from "mongoose";
import { sendEmail } from "../config/email.js";
import { Account } from "../models/account.js";
import { Ledger } from "../models/ledger.js";
import { Transaction } from "../models/transaction.js";
import crypto from "crypto";

export const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      msg: "missing fields",
    });
  }

  // valid user account

  const fromSystemAccount = await Account.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await Account.findOne({
    _id: toAccount,
  });

  if (!fromSystemAccount || !toUserAccount) {
    return res.status(400).json({
      msg: "No user account",
    });
  }

  //valid idempotencyKey

  const isTransactionAlreadyExists = await Transaction.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        msg: "transaction completed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        msg: "transaction is pending",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        msg: "transaction has failed",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        msg: "transaction has reversed , please try again",
      });
    }
  }

  //check account status
  if (
    fromSystemAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(500).json({
      msg: "Both the accounts must be active",
    });
  }

  // sender balance from ledger
  const balance = await fromSystemAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      msg: `insufficient amount . Current balance is ${balance}`,
    });
  }

  // create transaction
  let transaction;
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    transaction = (
      await Transaction.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    const debitLedgerEntry = await Ledger.create(
      [
        {
          account: fromAccount,
          amount,
          type: "DEBIT",
          transaction: transaction._id,
        },
      ],
      { session },
    );

    const creditLedgerEntry = await Ledger.create(
      [
        {
          account: toAccount,
          amount,
          type: "CREDIT",
          transaction: transaction._id,
        },
      ],
      { session },
    );

    transaction = await Transaction.findOneAndUpdate(
      { _id: transaction._id },
      { status: "COMPLETED" },
      { session, new: true },
    );

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    console.log("createTransaction error:-", error);
    return res.status(400).json({
      msg: "Transaction is Pending due to some issue, please retry after sometime",
    });
  }

  return res.status(201).json({
    msg: "transaction completed successfully",
    transaction: transaction,
  });
};

export const depositFundsToWallet = async (req, res) => {
  try {
    const {
      toAccount,
      amount,
      idempotencyKey,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !toAccount ||
      !amount ||
      !idempotencyKey ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        msg: "missing fields",
      });
    }

    // validity of toAccount
    const toUserAccount = await Account.findById(toAccount);
    if (!toUserAccount) {
      return res.status(400).json({
        msg: "No such account",
      });
    }

    const fromSystemAccount = new mongoose.Types.ObjectId(
      process.env.ADMIN_ACCOUNTID,
    );

    if (!process.env.ADMIN_ACCOUNTID) {
      return res.status(400).json({
        msg: "No system account configured",
      });
    }

    // razorpay validation starts
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        msg: "Invalid payment",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new Transaction({
      amount,
      toAccount: toUserAccount._id,
      fromAccount: fromSystemAccount,
      idempotencyKey,
      status: "PENDING",
    });

    await transaction.save({ session });

    const debitLedgerEntry = await Ledger.create(
      [
        {
          amount,
          account: fromSystemAccount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session },
    );

    const creditLedgerEntry = await Ledger.create(
      [
        {
          amount,
          account: toUserAccount._id,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      msg: "deposited successfully",
      transaction,
    });
  } catch (error) {
    console.log("depositFundsToWallet error:-", error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};
