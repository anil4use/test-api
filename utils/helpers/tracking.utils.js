const axios = require("axios");
const qs = require("qs");
const {
  FEDEX_API_KEY,
  FEDEX_SECRET_KEY,
  FEDEX_ACCOUNT_NUMBER,
  FEDEX_TEST_URL,
  TRACK_FEDEX_API_KEY,
  TRACK_FEDEX_SECRET_KEY,
} = require("../../configs/server.config");

const {formatDate}=require("./common.utils");
const authFedex = async () => {
  try {
    const inputPayload = qs.stringify({
      grant_type: "client_credentials",
      client_id: FEDEX_API_KEY,
      client_secret: FEDEX_SECRET_KEY,
    });
    const headers = {
      "content-type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/oauth/token`,
      inputPayload,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    throw error;
  }
};

const shippingRate = async (
  vendorAddress,
  recipientAddress,
  requestedPackageLineItems,
  totalWeight,
  shipDate,
) => {
  const authResult = await authFedex();
  const token = authResult.access_token;
  const headers = {
    "content-type": "application/json",
    "x-locale": "en_US",
    "x-customer-transaction-id": "4556dff6dfsg50",
    Authorization: `Bearer ${token}`,
  };

  console.log("packageDetails........", token);
      console.log("formatDate(Date.now())",typeof formatDate(Date.now()));
      console.log();
      const date=formatDate(Date.now())
      console.log(date);

  const inputPayload = {
    accountNumber: {
      value: FEDEX_ACCOUNT_NUMBER,
    },
    rateRequestControlParameters: {
      returnTransitTimes: false,
      servicesNeededOnRateFailure: true,
      variableOptions: "FREIGHT_GUARANTEE",
      rateSortOrder: "SERVICENAMETRADITIONAL",
    },
    requestedShipment: {
      shipper: {
        address: {
          // city: "Beverly Hills",
          // postalCode: "90210",
          // countryCode: "US",
          // residential: false,

          city: vendorAddress.city,
          postalCode: vendorAddress.postalCode,
          countryCode: "US",
          residential: false,
        },
      },
      recipient: {
        address: {
          // city: "Los Angeles",
          // postalCode: "90001",
          // countryCode: "US",
          // residential: true,

          city: recipientAddress.city,
          postalCode: recipientAddress.postalCode,
          countryCode: "US",
          residential: true,
        },
      },
      serviceType: "GROUND_HOME_DELIVERY",
      preferredCurrency: "USD",
      rateRequestType: ["ACCOUNT"],
      shipDateStamp:date,
      pickupType: "DROPOFF_AT_FEDEX_LOCATION",
      requestedPackageLineItems: requestedPackageLineItems,
      //  [
      //   {
      //     weight: {
      //       units: "LB",
      //       value: 10,
      //     },
      //   },
      // ],
      packagingType: "YOUR_PACKAGING",
      totalWeight: totalWeight,
    },
  };

  const response = await axios.post(
    `${FEDEX_TEST_URL}/rate/v1/rates/quotes`,

    inputPayload,
    {
      headers: headers,
    }
  );
  return response?.data?.output?.rateReplyDetails[0]?.ratedShipmentDetails[0]
    ?.totalNetFedExCharge;
};

const createShippingRequest = async (
  vendorAddress,
  recipientAddress,
  requestedPackageLineItems,
  totalWeight
) => {
  try {
    console.log("vendorAddress", vendorAddress);

    console.log("recipientAddress", recipientAddress);

    console.log("requestedPackageLineItems", requestedPackageLineItems);

    console.log("requestedPackageLineItems", totalWeight);

    const authResult = await authFedex();
    const token = authResult.access_token;
    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      "x-customer-transaction-id": "624deea6-b709-470c-8c39-4b5511281492",
      Authorization: `Bearer ${token}`,
    };

    const inputPayload = {
      requestedShipment: {
        shipper: {
          address: {
            //   streetLines: ["123 FedEx Drive"],
            //   stateOrProvinceCode: "NJ",
            //   postalCode: "07716",
            //   city: "New Jersey",

            streetLines: [vendorAddress?.streetLines],
            stateOrProvinceCode: vendorAddress?.stateOrProvinceCode,
            postalCode: vendorAddress?.postalCode,
            city: vendorAddress?.city,
            countryCode: "US",
          },
          contact: {
            personName: vendorAddress?.personName,
            phoneNumber: vendorAddress?.phoneNumber,
          },
        },
        recipients: [
          {
            address: {
              // streetLines: ["456 Elm St"],
              // stateOrProvinceCode: "NM",
              // city: "New Mexico",
              // postalCode: "88201",
              // countryCode: "US",

              streetLines: [recipientAddress?.streetLines],
              stateOrProvinceCode: recipientAddress?.stateOrProvinceCode,
              postalCode: recipientAddress?.postalCode,
              city: recipientAddress?.city,
              countryCode: "US",
              residential: true,
            },
            contact: {
              personName: recipientAddress?.personName,
              phoneNumber: recipientAddress?.phoneNumber,
            },
          },
        ],
        pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
        serviceType: "GROUND_HOME_DELIVERY",
        packagingType: "YOUR_PACKAGING",
        // totalWeight: 10.6,
        totalWeight: totalWeight,
        shippingChargesPayment: {
          paymentType: "SENDER",
          payor: {
            responsibleParty: {
              accountNumber: {
                value: 740561073,
              },
            },
          },
        },
        labelSpecification: {
          labelStockType: "PAPER_4X6",
          imageType: "PDF",
        },
        requestedPackageLineItems: requestedPackageLineItems,
        //  [
        //   {
        //     weight: {
        //       units: "LB",
        //       // value: 10.6,
        //       value: packageDetails?.weightValue,
        //     },
        //   },
        // ],
      },
      labelResponseOptions: "URL_ONLY",
      accountNumber: {
        value: "740561073",
      },
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/ship/v1/shipments`,

      inputPayload,
      {
        headers: headers,
      }
    );
    return response.data.output;
  } catch (error) {
    console.error("FedEx API Error:", error.response?.data || error.message);

    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => {
        console.log("Error Code:", err.code);
        console.log("Error Message:", err.message);
        console.log("Invalid Parameters:", err);
      });
    }
  }
};

//cancel shipment
const cancelShipment = async (trackingId) => {
  try {
    const authResult = await authFedex();
    const token = authResult.access_token;
    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      "x-customer-transaction-id": "624deea6-b709-470c-8c39-4b5511281492",
      Authorization: `Bearer ${token}`,
    };

    const inputPayload = {
      accountNumber: {
        value: "740561073",
      },  
      trackingNumber: trackingId,
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/ship/v1/shipments`,

      inputPayload,
      {
        headers: headers,
      }
    );
    return response.data.output;
  } catch (error) {
    console.error("FedEx API Error:", error.response?.data || error.message);

    if (error.response?.data?.errors) {
      error.response.data.errors.forEach((err) => {
        console.log("Error Code:", err.code);
        console.log("Error Message:", err.message);
        console.log("Invalid Parameters:", err);
      });
    }
  }
};

const trackAuthFedex = async () => {
  try {
    console.log("ddddddddd", TRACK_FEDEX_API_KEY, TRACK_FEDEX_SECRET_KEY);
    const inputPayload = qs.stringify({
      grant_type: "client_credentials",
      client_id: TRACK_FEDEX_API_KEY,
      client_secret: TRACK_FEDEX_SECRET_KEY,
    });

    const headers = {
      "content-type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/oauth/token`,
      inputPayload,
      {
        headers: headers,
      }
    );

    return response.data;
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    throw error;
  }
};

const tracking = async (trackingId) => {
  try {
    const authResult = await trackAuthFedex();
    const token = authResult.access_token;
    console.log("token", token);
    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      "x-customer-transaction-id": "624deea6-b709-470c-8c39-4b5511281492",
      Authorization: `Bearer ${token}`,
    };

    const inputPayload = {
      includeDetailedScans: true,
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: trackingId,
          },
        },
      ],
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/track/v1/trackingnumbers`,
      inputPayload,
      {
        headers: headers,
      }
    );
    return response.data.output;
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    throw error;
  }
};

const validateAddress = async (recipientAddress) => {
  try {
    const result = await authFedex();

    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      Authorization: `Bearer ${result.access_token}`,
    };

    const inputPayload = {
      includeDetailedScans: true,
      addressesToValidate: [
        {
          address: {
            streetLines: [recipientAddress.streetLines],
            city: recipientAddress.city,
            postalCode: recipientAddress.postalCode,
            countryCode: "US",
          },
          clientReferenceId: "None",
        },
      ],
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/address/v1/addresses/resolve`,
      inputPayload,
      {
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    console.log(error.response ? error.response.data : error.message);
    throw error;
  }
};

module.exports = {
  tracking,
  shippingRate,
  createShippingRequest,
  validateAddress,
  cancelShipment
};
