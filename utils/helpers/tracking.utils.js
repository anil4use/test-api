const axios = require("axios");
const qs = require("qs");
const {
  FEDEX_API_KEY,
  FEDEX_SECRET_KEY,
  FEDEX_ACCOUNT_NUMBER,
  FEDEX_TEST_URL,
} = require("../../configs/server.config");

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

const shippingRate = async () => {
  const authResult = await authFedex();
  const token = authResult.access_token;
  const headers = {
    "content-type": "application/json",
    "x-locale": "en_US",
    "x-customer-transaction-id": "4556dff6dfsg50",
    Authorization: `Bearer ${token}`,
  };

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
          streetLines: ["1550 Union Blvd", "Suite 302"],
          city: "Beverly Hills",
          stateOrProvinceCode: "CA",
          postalCode: "90210",
          countryCode: "US",
          residential: false,
        },
      },
      recipient: {
        address: {
          streetLines: ["1550 Union Blvd", "Suite 302"],
          city: "Los Angeles",
          stateOrProvinceCode: "CA",
          postalCode: "90001",
          countryCode: "US",
          residential: true,
        },
      },
      serviceType: "GROUND_HOME_DELIVERY",
      preferredCurrency: "USD",
      rateRequestType: ["ACCOUNT"],
      shipDateStamp: "2024-10-22",
      pickupType: "DROPOFF_AT_FEDEX_LOCATION",
      requestedPackageLineItems: [
        {
          weight: {
            units: "LB",
            value: 10,
          },
          dimensions: {
            length: 12,
            width: 12,
            height: 12,
            units: "IN",
          },

          packagingType: "YOUR_PACKAGING",
        },
        {
          weight: {
            units: "LB",
            value: 5, // Weight of second item
          },
          dimensions: {
            length: 10, // Dimensions of second item
            width: 8,
            height: 6,
            units: "IN",
          },
          packagingType: "YOUR_PACKAGING",
        },
        {
          weight: {
            units: "LB",
            value: 15, // Weight of third item
          },
          dimensions: {
            length: 20, // Dimensions of third item
            width: 16,
            height: 14,
            units: "IN",
          },
          packagingType: "YOUR_PACKAGING",
        },
      ],
    },
  };

  const response = await axios.post(
    `${FEDEX_TEST_URL}/rate/v1/rates/quotes`,

    inputPayload,
    {
      headers: headers,
    }
  );
  return response.data.output.rateReplyDetails[0].ratedShipmentDetails[0]
    .totalNetFedExCharge;
};

const createShippingRequest = async () => {
  try {
    const authResult = await authFedex();
    const token = authResult.access_token;
    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      "x-customer-transaction-id": "624deea6-b709-470c-8c39-4b5511281492",
      Authorization: `Bearer ${token}`,
    };

    // const inputPayload = {
    //   mergeLabelDocOption: "LABELS_AND_DOCS",
    //   requestedShipment: {
    //     shipDatestamp: "2024-10-17",
    //     totalDeclaredValue: {
    //       amount: 12.45,
    //       currency: "USD",
    //     },
    //   },
    //   shipper: {
    //     address: {
    //       streetLines: ["10 FedEx Parkway", "Suite 302"],
    //       city: "Beverly Hills",
    //       stateOrProvinceCode: "CA",
    //       postalCode: "90210",
    //       countryCode: "US",
    //       residential: false,
    //     },
    //     contact: {
    //       personName: "John Taylor",
    //       emailAddress: "sample@company.com",
    //       phoneExtension: "91",
    //       phoneNumber: "7856567890",
    //       companyName: "Fedex",
    //     },
    //     tins: [
    //       {
    //         number: "85961056701404100",
    //         tinType: "FEDERAL",
    //         usage: "usage",
    //         effectiveDate: "2024-10-13",
    //         expirationDate: "2024-10-13",
    //       },
    //     ],
    //   },
    //   soldTo: {
    //     address: {
    //       streetLines: ["10 FedEx Parkway", "Suite 302"],
    //       city: "Beverly Hills",
    //       stateOrProvinceCode: "CA",
    //       postalCode: "90210",
    //       countryCode: "US",
    //       residential: false,
    //     },
    //     contact: {
    //       personName: "John Taylor",
    //       emailAddress: "sample@company.com",
    //       phoneExtension: "91",
    //       phoneNumber: "1234567890",
    //       companyName: "Fedex",
    //     },
    //     tins: [
    //       {
    //         number: "123567",
    //         tinType: "FEDERAL",
    //         usage: "usage",
    //         effectiveDate: "2000-10-10",
    //         expirationDate: "2000-10-13",
    //       },
    //     ],
    //     accountNumber: {
    //       value: FEDEX_ACCOUNT_NUMBER,
    //     },
    //   },
    //   recipients: [
    //     {
    //       address: {
    //         streetLines: ["10 FedEx Parkway", "Suite 302"],
    //         city: "Beverly Hills",
    //         stateOrProvinceCode: "CA",
    //         postalCode: "90210",
    //         countryCode: "US",
    //         residential: false,
    //       },
    //       contact: {
    //         personName: "John Taylor",
    //         emailAddress: "sample@company.com",
    //         phoneExtension: "91",
    //         phoneNumber: "8953456710",
    //         companyName: "FedEx",
    //       },
    //       tins: [
    //         {
    //           number: "123567",
    //           tinType: "FEDERAL",
    //           usage: "usage",
    //           effectiveDate: "2024-10-10",
    //           expirationDate: "2000-01-13",
    //         },
    //       ],
    //       deliveryInstructions: "Delivery Instructions",
    //     },
    //   ],
    //   recipientLocationNumber: "1234567",
    //   pickupType: "CONTACT_FEDEX_TO_SCHEDULE",
    //   serviceType: "FEDEX_GROUND",
    //   packagingType: "YOUR_PACKAGING",
    //   totalWeight: 20.6,
    //   shippingChargesPayment: {
    //     paymentType: "SENDER",
    //     payor: {
    //       responsibleParty: {
    //         address: {
    //           streetLines: ["10 FedEx Parkway", "Suite 302"],
    //           city: "Beverly Hills",
    //           stateOrProvinceCode: "CA",
    //           postalCode: "90210",
    //           countryCode: "US",
    //           residential: false,
    //         },
    //         contact: {
    //           personName: "John Taylor",
    //           emailAddress: "sample@company.com",
    //           phoneExtension: "000",
    //           phoneNumber: "5895345671",
    //           companyName: "FedEx",
    //         },
    //         accountNumber: {
    //           value: FEDEX_ACCOUNT_NUMBER,
    //         },
    //       },
    //     },
    //   },
    //   labelSpecification: {
    //     labelFormatType: "COMMON2D",
    //     labelStockType: "PAPER_4X6",
    //     imageType: "PDF",
    //     labelPrintingOrientation: "BOTTOM_EDGE_OF_TEXT_FIRST",
    //     requestedPackageLineItems: [
    //       {
    //         weight: {
    //           units: "LB",
    //           value: 68.25,
    //         },
    //       },
    //     ],
    //   },
    //   labelResponseOptions: "URL_ONLY",
    //   accountNumber: {
    //     value: FEDEX_ACCOUNT_NUMBER,
    //   },
    //   shipAction: "CONFIRM",
    //   processingOptionType: "ALLOW_ASYNCHRONOUS",
    //   oneLabelAtATime: true,
    // };

    const inputPayload = {
      requestedShipment: {
        shipper: {
          contact: {
            personName: "John Doe",
            companyName: "Example Corp",
            phoneNumber: "1234567890",
            emailAddress: "john@example.com",
          },
          address: {
            streetLines: ["123 Main St", "Suite 100"],
            city: "Los Angeles",
            stateOrProvinceCode: "CA",
            postalCode: "90001",
            countryCode: "US",
            residential: false,
          },
        },
        recipients: [
          {
            address: {
              streetLines: ["10 FedEx Parkway", "Suite 302"],
              city: "Beverly Hills",
              stateOrProvinceCode: "CA",
              postalCode: "90210",
              countryCode: "US",
              residential: false,
            },
            contact: {
              personName: "John Taylor",
              emailAddress: "sample@company.com",
              phoneExtension: "000",
              phoneNumber: "8975813456", // Ensure this is a valid phone number
              companyName: "FedEx",
            },
            tins: [
              {
                number: "123567",
                tinType: "FEDERAL",
                usage: "usage",
                effectiveDate: "2000-01-23T04:56:07.000+00:00",
                expirationDate: "2000-01-23T04:56:07.000+00:00",
              },
            ],
            deliveryInstructions: "Delivery Instructions",
          },
        ],
        serviceType: "PRIORITY_OVERNIGHT", // Added service type
        packagingType: "YOUR_PACKAGING", // Add appropriate packaging type
        pickupType: "USE_SCHEDULED_PICKUP", // Added pickup type
        shippingChargesPayment: {
          // Added shipping charges payment
          paymentType: "SENDER", // or "RECIPIENT" based on your requirement
          payor: {
            accountNumber: FEDEX_ACCOUNT_NUMBER,
            countryCode: "US",
          },
        },
        labelSpecification: {
          labelFormatType: "COMMON2D",
          labelStockType: "PAPER_7X475",
          imageType: "PDF",
          labelRotation: "UPSIDE_DOWN",
          labelPrintingOrientation: "TOP_EDGE_OF_TEXT_FIRST",
        },
        shippingDocumentSpecification: {
          shippingDocumentTypes: ["INVOICE","RETURN_INSTRUCTIONS"], // Added document types
          generalAgencyAgreementDetail: {
            documentFormat: {
              provideInstructions: true,
              optionsRequested: {
                options: [
                  "SUPPRESS_ADDITIONAL_LANGUAGES",
                  "SHIPPING_LABEL_LAST",
                ],
              },
              stockType: "PAPER_LETTER",
              dispositions: [
                {
                  eMailDetail: {
                    eMailRecipients: [
                      {
                        emailAddress: "email@fedex.com",
                        recipientType: "THIRD_PARTY",
                      },
                    ],
                    locale: "en_US",
                    grouping: "NONE",
                  },
                  dispositionType: "CONFIRMED",
                },
              ],
              locale: "en_US",
              docType: "PDF",
            },
          },
        },
        rateRequestType: ["LIST", "PREFERRED"],
        preferredCurrency: "USD",
        totalPackageCount: 1,
        requestedPackageLineItems: [
          {
            sequenceNumber: "1",
            weight: {
              units: "LB",
              value: 3.3,
            },
            dimensions: {
              length: 12,
              width: 8,
              height: 4,
              units: "IN",
            },
            itemDescription: "Sample Item",
          },
        ],
      },
      labelResponseOptions: "URL_ONLY",
      accountNumber: {
        value: FEDEX_ACCOUNT_NUMBER,
      },
      shipAction: "CONFIRM",
      processingOptionType: "ALLOW_ASYNCHRONOUS",
      oneLabelAtATime: true,
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
        console.log("Invalid Parameters:", err.parameterList);
      });
    }
  }
};
const tracking = async () => {
  try {
    const result = await authFedex();
    const inputPayload = {
      includeDetailedScans: true,
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: "122816215025810",
          },
        },
      ],
    };

    const headers = {
      "content-type": "application/json",
      "x-locale": "en_US",
      Authorization: `Bearer ${result.access_token}`,
    };

    const response = await axios.post(
      `${FEDEX_TEST_URL}/track/v1/trackingnumbers`,
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
};
