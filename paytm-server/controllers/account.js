import { Account } from "../models/account.js";

export const createAccount = async (req, res) => {
  try {
    const user = req.user;

    const account = await Account.create({
      user: user._id,
    });

    return res.status(201).json({
      msg: "account created",
      account,
    });
  } catch (error) {
    console.log("error at createAccount", error);
    return res.status(500).json({
      msg: "error creating account",
    });
  }
};

export const fetchUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    return res.status(200).json({
      accounts,
    });
  } catch (error) {
    console.log("error at fetchUserAccounts", error);
    return res.status(500).json({
      msg: "error at fetching user accounts",
    });
  }
};

export const fetchAccountBalance = async (req, res) => {
  try {
    const accountId = req.params.accountId;

    const account = await Account.findOne({
      _id: accountId,
      user: req.user._id,
    });

    if (!account) {
      return res.status(400).json({
        msg: "account not found",
      });
    }

    const balance = await account.getBalance();

    return res.status(200).json({
      balance,
      account : account._id
    });
  } catch (error) {
    console.log("error at fetchAccountBalance", error);
    return res.status(500).json({
      msg: "error at fetching user balance",
    });
  }
};
