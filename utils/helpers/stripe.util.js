const log = require("../../configs/logger.config");
const {
  STRIPE_SECRET_KEY,
  WEB_HOOK_SECRET,
  successUrl,
  cancelUrl,
} = require("../../configs/server.config");
const adminDao = require("../../daos/admin.dao");
const stripe = require("stripe")(STRIPE_SECRET_KEY);

const createVendorAccount = async (vendorId, email) => {
  const isUserBankDetailExist = await adminDao.getById(vendorId);
  if (!isUserBankDetailExist.data) {
    return {
      message: "not found",
      status: "fail",
      code: 201,
    };
  }

  let vendor = await adminDao.getVendorStripeAccountId(vendorId);

  if (vendor.data.stripeAccountId) {  
    const account = await stripe.accounts.retrieve(
      vendor?.data?.stripeAccountId
    );
    console.log("dddddddddddddddddddddddddd",account);
    const data = {
      stripeAccountId: account.id,
    };
     console.log("dsffffffffffffffff",vendorId,data);
    vendor = await adminDao.updateAdmin(vendorId, data);
    return account.id;
  } else {
    console.log("new acccointttttttttttttttttttttt",email);
    const account = await stripe.accounts.create({
      type: "custom",
      country: "US",
      
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: "individual",
      external_account: {
        object: "bank_account",
        country: "US",
        currency: "usd",
        account_number: isUserBankDetailExist?.data?.bank?.accountNumber,
        routing_number:
          isUserBankDetailExist?.data?.bank?.ACHOrWireRoutingNumber,
      },
    });
    console.log("sddddddddddddddddddddddddddddddddddddd",account);

    const data = {
      stripeAccountId: account.id,
    };
     console.log("dsffffffffffffffff",data);
    vendor = await adminDao.updateAdmin(vendorId, data);
    return account.id;
  }
};

const transferToVendorAccount = async (
  amount,
  connectedAccountId,
  currency = "usd"
) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: amount,
      currency: currency,
      destination: connectedAccountId,
      description: `Payout to vendor ${connectedAccountId}`,
    });
    console.log("Transfer successful: ", transfer.id);
    return transfer;
  } catch (error) {
    console.error("Error creating transfer: ", error);
    return null;
  }
};

const payoutToVendorBank = async (
  connectedAccountId,
  amount,
  currency = "usd"
) => {
  try {
    const payout = await stripe.payouts.create(
      {
        amount: amount,
        currency: currency,
        source_type: "bank_account",
        description: "Vendor payout",
      },
      { stripeAccount: connectedAccountId }
    );
    console.log("Payout successful: ", payout.id);
    return payout;
  } catch (error) {
    console.error("Error creating payout: ", error);
    return null;
  }
};

module.exports = {
  createVendorAccount,
  transferToVendorAccount,
  payoutToVendorBank,
};
