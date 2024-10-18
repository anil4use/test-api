// const mongoose = require("mongoose");

// const barnSchema = new mongoose.Schema(
//   {
//     barnId: {
//       type: String,
//       unique: true,
//       trim: true,
//     },
//     barnOwner: {
//       type: String,
//       ref: "Staff",
//       trim: true,
//     },
//     name: {
//       type: String,
//       trim: true,
//     },
//     feature: {
//       type: String,
//       trim: true,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     coverImage: {
//       type: String,
//       trim: true,
//     },
//     images: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//     price: {
//       type: String,
//       trim: true,
//     },
//     contact: {
//       address: {
//         type: String,
//         trim: true,
//       },
//       websiteUrl: {
//         type: String,
//         trim: true,
//       },
//       phoneNumber: {
//         type: String,
//         trim: true,
//       },
//       email: {
//         type: String,
//         trim: true,
//       },
//     },
//     boarding: {
//       stallAvailable: {
//         type: Number,
//         trim: true,
//       },
//       stallSizes: {
//         type: String,
//         trim: true,
//       },
//       stallFeatures: {
//         matted: {
//           type: Boolean,
//           trim: true,
//         },
//         fans: {
//           type: Boolean,
//           trim: true,
//         },
//         automaticWaterers: {
//           type: Boolean,
//           trim: true,
//         },
//         windows: {
//           type: Boolean,
//           trim: true,
//         },
//       },
//       monthlyBoardRates: {
//         type: String,
//         trim: true,
//       },
//     },
//     amenities: {
//       facilities: {
//         indoorArena: {
//           size: {
//             type: String,
//             trim: true,
//           },
//         },
//         outdoorArena: {
//           size: {
//             type: String,
//             trim: true,
//           },
//         },
//         lightedOutdoorArena: {
//           size: {
//             type: String,
//             trim: true,
//           },
//         },
//         roundPen: {
//           type: Boolean,
//           trim: true,
//         },
//         washStalls: {
//           indoor: {
//             type: Boolean,
//             trim: true,
//           },
//           outdoor: {
//             type: Boolean,
//             trim: true,
//           },
//           heated: {
//             type: Boolean,
//             trim: true,
//           },
//           hotWater: {
//             type: Boolean,
//             trim: true,
//           },
//           coldWater: {
//             type: Boolean,
//             trim: true,
//           },
//         },
//         tackRoom: {
//           shared: {
//             type: Boolean,
//             trim: true,
//           },
//           individualLockers: {
//             type: Boolean,
//             trim: true,
//           },
//         },
//         viewingLounge: {
//           type: Boolean,
//           trim: true,
//         },
//         restroom: {
//           type: String,
//           trim: true,
//           enum: ["heated", "outhouse"],
//         },
//         trailerParking: {
//           included: {
//             type: Boolean,
//             trim: true,
//           },
//           fee: {
//             type: Boolean,
//             trim: true,
//           },
//         },
//       },
//       services: {
//         dailyTurnout: {
//           individualTurnout: {
//             type: Boolean,
//             trim: true,
//           },
//           groupTurnout: {
//             type: Boolean,
//             trim: true,
//           },
//         },

//         blanketingService: {
//           included: {
//             frequency: {
//               type: String,
//               trim: true,
//             },
//             blanketWeight: {
//               type: String,
//               trim: true,
//             },
//           },
//           fee: {
//             frequency: {
//               type: String,
//               trim: true,
//             },
//             blanketWeight: {
//               type: String,
//               trim: true,
//             },
//           },
//         },
//         grooming: {
//           offered: {
//             type: Boolean,
//             trim: true,
//           },
//           cost: {
//             type: String,
//             trim: true,
//           },
//         },
//         flySprayApplication: {
//           offered: {
//             type: Boolean,
//             trim: true,
//           },
//           cost: {
//             type: String,
//             trim: true,
//           },
//         },
//         hoofPicking: {
//           offered: {
//             type: Boolean,
//             trim: true,
//           },
//           cost: {
//             type: String,
//             trim: true,
//           },
//         },
//         dailyWoundCare: {
//           offered: {
//             type: Boolean,
//             trim: true,
//           },
//           cost: {
//             type: String,
//             trim: true,
//           },
//         },
//         dewormerOptions: {
//           type: String,
//           trim: true,
//           enum: [
//             "providedByBarn",
//             "providedByBarnFee",
//             "providedByBoarder",
//           ],
//         },
//         holdingVetFarrierServices: {
//           offered: {
//             type: Boolean,
//             trim: true,
//           },
//           cost: {
//             type: String,
//             trim: true,
//           },
//         },
//         laundryFacilities: {
//           type: Boolean,
//           trim: true,
//         },
//         guestWiFi: {
//           type: Boolean,
//           trim: true,
//         },
//         vendingMachines: {
//           type: Boolean,
//           trim: true,
//         },
//       },
//       horseCare: {
//         hayProvidedBy: {
//           type: String,
//           trim: true,
//           enum: ["barn", "boarder"],
//         },
//         grainProvidedBy: {
//           type: String,
//           trim: true,
//           enum: ["barn", "boarder"],
//         },
//         amountIncluded: {
//           type: String,
//           trim: true,
//         },
//         feedingSchedule: {
//           type: String,
//           trim: true,
//         },
//         stallCleaningFrequency: {
//           type: String,
//           trim: true,
//         },
//         beddingType: {
//           type: String,
//           trim: true,
//           enum: ["included", "notIncluded"],
//         },
//         pastureDetails: {
//           numberOfPastures: {
//             type: Number,
//             trim: true,
//           },
//           sizeOfPastures: {
//             type: String,
//             trim: true,
//           },
//           pasturesDragged: {
//             type: Boolean,
//             trim: true,
//           },
//           draggingFrequency: {
//             type: String,
//             trim: true,
//           },
//           troughs: {
//             type: String,
//             trim: true,
//           },
//           troughMaintenanceFrequency: {
//             type: String,
//             trim: true,
//           },
//         },
//         turnoutOptions: {
//           singleTurnout: {
//             type: Boolean,
//             trim: true,
//           },
//           dryPaddocks: {
//             type: Boolean,
//             trim: true,
//           },
//         },
//       },
//     },
//     disciplines: [
//       {
//         type: String,
//         trim: true,
//       },
//     ],
//     additionalInfo: {
//       barnOwnerBio: {
//         type: String,
//         trim: true,
//       },
//       employeeInfo: {
//         numberOfEmployees: {
//           type: Number,
//           trim: true,
//         },
//         barnManagerContactDetails: {
//           type: String,
//           trim: true,
//         },
//       },
//       otherServices: {
//         type: String,
//         trim: true,
//       },
//       fees: {
//         type: String,
//         trim: true,
//       },
//       policies: {
//         type: String,
//         trim: true,
//       },
//     },
//     location: {
//       latitude: {
//         type: String,
//         trim: true,
//       },
//       longitude: {
//         type: String,
//         trim: true,
//       },
//     },
//     status: {
//       type: String,
//       trim: true,
//       default: "pending",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Barn", barnSchema);

const mongoose = require("mongoose");

const barnSchema = new mongoose.Schema(
  {
    barnId: {
      type: String,
      unique: true,
      trim: true,
    },
    barnOwner: {
      type: String,
      ref: "Staff",
      required: true,
    },
    barnServices: [
      {
        service: {
          type: String,
          trim: true,
        },
      },
    ],
    providerServices: [
      {
        service: {
          type: String,
          ref: "Service",
        },
        providedBy: {
          type: String,
          ref: "ServiceProvider",
        },
        role: {
          type: String,
          trim: true,
        },
        contact: {
          phoneNumber: {
            type: String,
            trim: true,
          },
          email: {
            type: String,
            trim: true,
          },
        },
      },
    ],
    name: {
      type: String,
      trim: true,
      required: true,
    },
    feature: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    price: {
      type: String,
      trim: true,
    },
    contact: {
      address: {
        type: String,
        trim: true,
      },
      stateOrProvinceCode: {
        type: String,
        trim: true,
      },
      websiteUrl: {
        type: String,
        trim: true,
      },
      phoneNumber: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        trim: true,
      },
    },
    boarding: {
      stallAvailable: {
        type: Number,
        trim: true,
      },
      stallSizes: {
        type: String,
        trim: true,
      },
      stallFeatures: {
        matted: {
          type: Boolean,
          trim: true,
        },
        fans: {
          type: Boolean,
          trim: true,
        },
        automaticWaterers: {
          type: Boolean,
          trim: true,
        },
        windows: {
          type: Boolean,
          trim: true,
        },
      },
      monthlyBoardRates: {
        type: String,
        trim: true,
      },
    },
    amenities: {
      facilities: {
        indoorArena: {
          size: {
            type: String,
            trim: true,
          },
        },
        outdoorArena: {
          size: {
            type: String,
            trim: true,
          },
        },
        lightedOutdoorArena: {
          size: {
            type: String,
            trim: true,
          },
        },
        roundPen: {
          type: Boolean,
          trim: true,
        },
        washStalls: {
          indoor: {
            type: Boolean,
            trim: true,
          },
          outdoor: {
            type: Boolean,
            trim: true,
          },
          heated: {
            type: Boolean,
            trim: true,
          },
          hotWater: {
            type: Boolean,
            trim: true,
          },
          coldWater: {
            type: Boolean,
            trim: true,
          },
        },
        tackRoom: {
          shared: {
            type: Boolean,
            trim: true,
          },
          individualLockers: {
            type: Boolean,
            trim: true,
          },
        },
        viewingLounge: {
          type: Boolean,
          trim: true,
        },
        restroom: {
          type: String,
          trim: true,
          enum: ["heated", "outhouse"],
        },
        trailerParking: {
          included: {
            type: Boolean,
            trim: true,
          },
          fee: {
            type: Boolean,
            trim: true,
          },
        },
      },
      services: {
        dailyTurnout: {
          individualTurnout: {
            type: Boolean,
            trim: true,
          },
          groupTurnout: {
            type: Boolean,
            trim: true,
          },
        },
        blanketingService: {
          included: {
            frequency: {
              type: String,
              trim: true,
            },
            blanketWeight: {
              type: String,
              trim: true,
            },
          },
          fee: {
            frequency: {
              type: String,
              trim: true,
            },
            blanketWeight: {
              type: String,
              trim: true,
            },
          },
        },
        grooming: {
          offered: {
            type: Boolean,
            trim: true,
          },
          cost: {
            type: String,
            trim: true,
          },
        },
        flySprayApplication: {
          offered: {
            type: Boolean,
            trim: true,
          },
          cost: {
            type: String,
            trim: true,
          },
        },
        hoofPicking: {
          offered: {
            type: Boolean,
            trim: true,
          },
          cost: {
            type: String,
            trim: true,
          },
        },
        dailyWoundCare: {
          offered: {
            type: Boolean,
            trim: true,
          },
          cost: {
            type: String,
            trim: true,
          },
        },
        dewormerOptions: {
          type: String,
          trim: true,
          enum: ["providedByBarn", "providedByBarnFee", "providedByBoarder"],
        },
        holdingVetFarrierServices: {
          offered: {
            type: Boolean,
            trim: true,
          },
          cost: {
            type: String,
            trim: true,
          },
        },
        laundryFacilities: {
          type: Boolean,
          trim: true,
        },
        guestWiFi: {
          type: Boolean,
          trim: true,
        },
        vendingMachines: {
          type: Boolean,
          trim: true,
        },
      },
      horseCare: {
        hayProvidedBy: {
          type: String,
          trim: true,
          enum: ["barn", "boarder"],
        },
        grainProvidedBy: {
          type: String,
          trim: true,
          enum: ["barn", "boarder"],
        },
        amountIncluded: {
          type: String,
          trim: true,
        },
        feedingSchedule: {
          type: String,
          trim: true,
        },
        stallCleaningFrequency: {
          type: String,
          trim: true,
        },
        beddingType: {
          type: String,
          trim: true,
          enum: ["included", "notIncluded"],
        },
        pastureDetails: {
          numberOfPastures: {
            type: Number,
            trim: true,
          },
          sizeOfPastures: {
            type: String,
            trim: true,
          },
          pasturesDragged: {
            type: Boolean,
            trim: true,
          },
          draggingFrequency: {
            type: String,
            trim: true,
          },
          troughs: {
            type: String,
            trim: true,
          },
          troughMaintenanceFrequency: {
            type: String,
            trim: true,
          },
        },
        turnoutOptions: {
          singleTurnout: {
            type: Boolean,
            trim: true,
          },
          dryPaddocks: {
            type: Boolean,
            trim: true,
          },
        },
      },
    },
    disciplines: [
      {
        type: String,
        trim: true,
      },
    ],
    additionalInfo: {
      barnOwnerBio: {
        type: String,
        trim: true,
      },
      employeeInfo: {
        numberOfEmployees: {
          type: Number,
          trim: true,
        },
        barnManagerContactDetails: {
          type: String,
          trim: true,
        },
      },
      otherServices: {
        type: String,
        trim: true,
      },
      fees: {
        type: String,
        trim: true,
      },
      policies: {
        type: String,
        trim: true,
      },
    },
    location: {
      latitude: {
        type: String,
        trim: true,
      },
      longitude: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      trim: true,
      default: "pending",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Barn", barnSchema);
