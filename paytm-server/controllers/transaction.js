import mongoose from "mongoose";
import { sendEmail } from "../config/email.js";
import { Account } from "../models/account.js";
import { Ledger } from "../models/ledger.js";
import { Transaction } from "../models/transaction.js";

export const createTransaction = async (req, res) => {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;
  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      msg: "missing fields",
    });
  }

  // valid user account

  const fromUserAccount = await Account.findOne({
    _id: fromAccount,
  });

  const toUserAccount = await Account.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
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
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(500).json({
      msg: "Both the accounts must be active",
    });
  }

  // sender balance from ledger
  const balance = await fromUserAccount.getBalance();

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

export const createInitialFunds = async (req, res) => {
  try {
    const { toAccount, amount, idempotencyKey } = req.body;

    if (!toAccount || !amount || !idempotencyKey) {
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

    const fromUserAccount = await Account.findOne({
      user: req.user._id,
    });

    if (!fromUserAccount) {
      return res.status(400).json({
        msg: "No system user",
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    const transaction = new Transaction({
      amount,
      toAccount: toUserAccount._id,
      fromAccount: fromUserAccount._id,
      idempotencyKey,
      status: "PENDING",
    });

    await transaction.save({ session });

    const debitLedgerEntry = await Ledger.create(
      [
        {
          amount,
          account: fromUserAccount._id,
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
    console.log("createInitialFunds error:-", error);
    return res.status(500).json({
      msg: error.message,
    });
  }
};
