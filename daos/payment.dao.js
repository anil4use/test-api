const wallet = require("../models/Wallet.model");
const payout = require("../models/Payout.model");
const log = require("../configs/logger.config");
const mongoose = require("mongoose");

const {
  createVendorAccount,
  transferToVendorAccount,
  payoutToVendorBank,
} = require("../utils/helpers/stripe.util");
const barnDao = require("./barn.dao");

class Payment {
  async getOrCreateVendorWallet(
    vendorId,
    amount,
    description = "Payment credited"
  ) {
    try {
      let vendorWallet = await wallet.findOne({ vendorId });

      if (vendorWallet) {
        vendorWallet.balance += amount;
        vendorWallet.credits.push({
          amount,
          date: new Date(),
          description,
        });
        await vendorWallet.save();
      } else {
        vendorWallet = await wallet.create({
          vendorId,
          balance: amount,
          credits: [
            {
              amount,
              date: new Date(),
              description,
            },
          ],
        });
      }
      return {
        message: "payment credited successfully",
        status: "success",
        data: vendorWallet,
        code: 200,
      };
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  //payout
  async createPayout(orderId, vendorId, amount, vendorType) {
    try {
      const payoutRecord = await payout.create({
        orderId,
        vendorId,
        vendorType,
        amount,
        status: "pending",
        payoutDate: new Date(),
      });

      return {
        message: "payment credited successfully",
        status: "success",
        data: payoutRecord,
        code: 200,
      };
    } catch (error) {
      log.error("Error from [PRODUCT DAO] : ", error);
      throw error;
    }
  }

  async processVendorPayout(vendorId, vendorEmail, amount) {
    console.log("dsffffffffffffffffffffffffffffffff");

    try {
      const connectedAccountId = await createVendorAccount(
        vendorId,
        vendorEmail
      );
      console.log("ssssssss", connectedAccountId);
      if (!connectedAccountId) {
        return;
      }
      console.log("sssssssssss", amount);
      console.log("ssssssssssssssssssssssss", vendorId);
      let barn = null;
      let wallett = null;

      barn = await barnDao.getBarnByBarnOwner(vendorId);
      console.log("dddddddddddd", barn);
      if (barn.data) {
        const barnId = barn.data.barnId;
        console.log("barn");
        wallett = await wallet.findOne({ vendorId: barnId });
      } else {
        console.log("parn");
        wallett = await wallet.findOne({ vendorId: vendorId });
      }

      console.log("wallettttttttttttttttttttt", wallett);
      if (!wallett || wallett.balance < amount) {
        log.error(`Insufficient wallet balance for Vendor ID: ${vendorId}`);
        return;
      }
      wallett.balance -= amount;
      wallett.debits.push({
        amount,
        date: new Date(),
        description: `Payout to Vendor ${vendorId}`,
      });
      await wallett.save();

      const transfer = await transferToVendorAccount(
        amount,
        connectedAccountId
      );

      if (!transfer) {
        console.log(`faild to paid out to vendor: ${connectedAccountId}`);
      }

      // if (!transfer)
      //    return;

      // const payout = await payoutToVendorBank(connectedAccountId, amount);

      // if (!payout) {
      //   console.error(`Failed to pay out to vendor ${connectedAccountId}`);
      // }
      // else {

      await payout.findOneAndUpdate(
        { vendorId },
        { status: "completed", completedAt: new Date() },
        {
          new: true,
        }
      );

      console.log(`Successfully paid out to vendor: ${connectedAccountId}`);
      //  }
    } catch (error) {
      log.error("Error from [PAYMENT DAO] : ", error);
      throw error;
    }
  }
}
module.exports = new Payment();
