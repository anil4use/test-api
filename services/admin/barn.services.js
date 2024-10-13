const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
const barnServiceProviderDao = require("../../daos/barnServiceProvider.dao");
const staffDao = require("../../daos/staff.dao");
const barnServiceProvider = require("../../models/barnServiceProvider");
const staffModel = require("../../models/staff/staff.model");
const {
  removeNullUndefined,
  randomString,
} = require("../../utils/helpers/common.utils");
const { sendMail } = require("../../utils/helpers/email.utils");
const { deleteS3Object } = require("../../utils/helpers/files.helper");
const {
  validateEmail,
  validateUSAMobileNumber,
} = require("../../utils/helpers/validator.utils");
class BarnService {
  async addBarnService(req, res) {
    try {
      const adminId = req.userId;
      const {
        name,
        feature,
        description,
        price,
        address,
        websiteUrl,
        phoneNumber,
        email,
        stallAvailable,
        stallSizes,
        matted,
        fans,
        automaticWaterers,
        windows,
        monthlyBoardRates,
        indoorArena,
        outdoorArena,
        lightedOutdoorArena,
        roundPen,
        indoor,
        outdoor,
        heated,
        hotWater,
        coldWater,
        shared,
        individualLockers,
        viewingLounge,
        restroom,
        trailerParkingIncluded,
        trailerParkingFee,
        individualTurnout,
        groupTurnout,
        blanketFrequency,
        blanketWeight,
        feeFrequency,
        feeBlanketWeight,
        groomingOffered,
        groomingCost,
        flySprayApplicationOffered,
        flySprayApplicationCost,
        hoofPickingOffered,
        hoofPickingCost,
        dailyWoundCareOffered,
        dailyWoundCareCost,
        dewormerOptions,
        vetOffered,
        vetCost,
        laundryFacilities,
        guestWiFi,
        vendingMachines,
        hayProvidedBy,
        grainProvidedBy,
        amountIncluded,
        feedingSchedule,
        stallCleaningFrequency,
        beddingType,
        numberOfPastures,
        sizeOfPastures,
        pasturesDragged,
        draggingFrequency,
        troughs,
        troughMaintenanceFrequency,
        singleTurnout,
        dryPaddocks,
        disciplines,
        barnOwnerBio,
        numberOfEmployees,
        barnManagerContactDetails,
        otherServices,
        fees,
        policies,
        latitude,
        longitude,
      } = req.body;
      console.log(req.body);
      console.log(req.files);
      if (
        !req.files.images ||
        !req.files.image[0].location ||
        !name ||
        !feature ||
        !description ||
        !adminId ||
        !price ||
        // !address ||
        // !websiteUrl ||
        // !phoneNumber ||
        // !email ||
        // !stallAvailable ||
        // !stallSizes ||
        // !matted ||
        // !fans ||
        // !automaticWaterers ||
        // !windows ||
        // !monthlyBoardRates ||
        // !indoorArena ||
        // !outdoorArena ||
        // !lightedOutdoorArena ||
        // !roundPen ||
        // !indoor ||
        // !outdoor ||
        // !heated ||
        // !hotWater ||
        // !coldWater ||
        // !shared ||
        // !individualLockers ||
        // !viewingLounge ||
        // !restroom ||
        // !trailerParkingIncluded ||
        // !trailerParkingFee ||
        // !groupTurnout ||
        // !blanketFrequency ||
        // !blanketWeight ||
        // !feeFrequency ||
        // !feeBlanketWeight ||
        // !groomingOffered ||
        // !groomingCost ||
        // !flySprayApplicationOffered ||
        // !flySprayApplicationCost ||
        // !hoofPickingOffered ||
        // !hoofPickingCost ||
        // !dailyWoundCareOffered ||
        // !dailyWoundCareCost ||
        // !dewormerOptions ||
        // !vetOffered ||
        // !vetCost ||
        // !hayProvidedBy ||
        // !grainProvidedBy ||
        // !amountIncluded ||
        // !feedingSchedule ||
        // !stallCleaningFrequency ||
        // !beddingType ||
        // !numberOfPastures ||
        // !sizeOfPastures ||
        // !draggingFrequency ||
        // !troughs ||
        // !troughMaintenanceFrequency ||
        // !disciplines ||
        !latitude ||
        !longitude
      ) {
        log.error("Error from [BARN SERVICES]: invalid Request");
        return res.status(400).json({
          message: "something went wrong",
          status: "fail",
          data: null,
          code: 201,
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }
      const isExistEmail = await barnDao.getBarnByEmail(email);
      console.log(isExistEmail.data);
      if (isExistEmail.data) {
        return res.status(400).json({
          message: "email already in use please enter another one",
          code: 201,
          status: "fail",
        });
      }

      if (!validateUSAMobileNumber(phoneNumber)) {
        return res.status(400).json({
          message: "please enter valid email",
          code: 201,
          status: "fail",
        });
      }

      const isExistNumber = await barnDao.getBarnByContact(phoneNumber);

      if (isExistNumber.data) {
        return res.status(400).json({
          message: "this number is already in use please try another one",
          code: 201,
          status: "fail",
        });
      }

      let imageArray = [];

      if (req.files.images.length > 0) {
        await Promise.all(
          req.files.images.map((img) => {
            imageArray.push(img.location);
          })
        );
      }

      const data = {
        name,
        feature,
        description,
        images: imageArray,
        coverImage: req.files.image[0].location,
        price,
        contact: {
          address,
          websiteUrl,
          phoneNumber,
          email,
        },

        boarding: {
          stallAvailable,
          stallSizes,
          stallFeatures: {
            matted,
            fans,
            automaticWaterers,
            windows,
          },
          monthlyBoardRates,
        },

        amenities: {
          facilities: {
            indoorArena: {
              size: indoorArena,
            },
            outdoorArena: {
              size: outdoorArena,
            },
            lightedOutdoorArena: {
              size: lightedOutdoorArena,
            },
            roundPen,
            washStalls: {
              indoor,
              outdoor,
              heated,
              hotWater,
              coldWater,
            },
            tackRoom: {
              shared,
              individualLockers,
            },
            viewingLounge,
            restroom,
            trailerParking: {
              included: trailerParkingIncluded,
              fee: trailerParkingFee,
            },
          },
          services: {
            dailyTurnout: {
              individualTurnout,
              groupTurnout,
            },
            blanketingService: {
              included: {
                frequency: blanketFrequency,
                blanketWeight: blanketWeight,
              },
            },
            fee: {
              frequency: feeFrequency,
              blanketWeight: feeBlanketWeight,
            },
            grooming: {
              offered: groomingOffered,
              cost: groomingCost,
            },
            flySprayApplication: {
              offered: flySprayApplicationOffered,
              cost: flySprayApplicationCost,
            },
            hoofPicking: {
              offered: hoofPickingOffered,
              cost: hoofPickingCost,
            },
            dailyWoundCare: {
              offered: dailyWoundCareOffered,
              cost: dailyWoundCareCost,
            },
            dewormerOptions,
            holdingVetFarrierServices: {
              offered: vetOffered,
              cost: vetCost,
            },
            laundryFacilities,
            guestWiFi,
            vendingMachines,
          },
          horseCare: {
            hayProvidedBy,
            grainProvidedBy,
            amountIncluded,
            feedingSchedule,
            stallCleaningFrequency,
            beddingType,
            pastureDetails: {
              numberOfPastures,
              sizeOfPastures,
              pasturesDragged,
              draggingFrequency,
              troughs,
              troughMaintenanceFrequency,
            },
            turnoutOptions: {
              singleTurnout,
              dryPaddocks,
            },
          },
        },
        disciplines,
        additionalInfo: {
          barnOwnerBio,
          employeeInfo: {
            numberOfEmployees,
            barnManagerContactDetails,
          },
          otherServices,
          fees,
          policies,
        },
        location: {
          latitude,
          longitude,
        },
        barnOwner: adminId,
      };

      const result = await barnDao.addBarn(data);
      if (result.data) {
        return res.status(200).json({
          message: "barn creation successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(201).json({
          message: "barn creation failed",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //getAllBarn

  async getAllBarnService(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await barnDao.getAllBarn();
      if (result) {
        return res.status(200).json({
          message: "barns retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "barns not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  async getBarnByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { barnId } = req.body;
      console.log(adminId);
      if (!adminId || !barnId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await barnDao.getBarnById(barnId);
      if (result.data) {
        return res.status(200).json({
          message: "barn retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "barn not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //updateBarnService
  async updateBarnService(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const {
        barnId,
        // name,
        // feature,
        // description,
        // price,
        // address,
        // houseNumber,
        // streetName,
        // city,
        // country,
        // websiteUrl,
        // phoneNumber,
        // email,
        // stallAvailable,
        // stallSizes,
        // matted,
        // fans,
        // automaticWaterers,
        // windows,
        // monthlyBoardRates,
        // indoorArena,
        // outdoorArena,
        // lightedOutdoorArena,
        // roundPen,
        // indoor,
        // outdoor,
        // heated,
        // hotWater,
        // coldWater,
        // shared,
        // individualLockers,
        // viewingLounge,
        // restroom,
        // trailerParkingIncluded,
        // trailerParkingFee,
        // individualTurnout,
        // groupTurnout,
        // blanketFrequency,
        // blanketWeight,
        // feeFrequency,
        // feeBlanketWeight,
        // groomingOffered,
        // groomingCost,
        // flySprayApplicationOffered,
        // flySprayApplicationCost,
        // hoofPickingOffered,
        // hoofPickingCost,
        // dailyWoundCareOffered,
        // dailyWoundCareCost,
        // dewormerOptions,
        // vetOffered,
        // vetCost,
        // laundryFacilities,
        // guestWiFi,
        // vendingMachines,
        // hayProvidedBy,
        // grainProvidedBy,
        // amountIncluded,
        // feedingSchedule,
        // stallCleaningFrequency,
        // beddingType,
        // numberOfPastures,
        // sizeOfPastures,
        // pasturesDragged,
        // draggingFrequency,
        // troughs,
        // troughMaintenanceFrequency,
        // singleTurnout,
        // dryPaddocks,
        // disciplines,
        // barnOwnerBio,
        // numberOfEmployees,
        // barnManagerContactDetails,
        // otherServices,
        // fees,
        // policies,
        // latitude,
        // longitude,

        name,
        feature,
        description,
        price,
        address,
        websiteUrl,
        phoneNumber,
        email,
        stallAvailable,
        stallSizes,
        matted,
        fans,
        automaticWaterers,
        windows,
        monthlyBoardRates,
        indoorArena,
        outdoorArena,
        lightedOutdoorArena,
        roundPen,
        indoor,
        outdoor,
        heated,
        hotWater,
        coldWater,
        shared,
        individualLockers,
        viewingLounge,
        restroom,
        trailerParkingIncluded,
        trailerParkingFee,
        individualTurnout,
        groupTurnout,
        blanketFrequency,
        blanketWeight,
        feeFrequency,
        feeBlanketWeight,
        groomingOffered,
        groomingCost,
        flySprayApplicationOffered,
        flySprayApplicationCost,
        hoofPickingOffered,
        hoofPickingCost,
        dailyWoundCareOffered,
        dailyWoundCareCost,
        dewormerOptions,
        vetOffered,
        vetCost,
        laundryFacilities,
        guestWiFi,
        vendingMachines,
        hayProvidedBy,
        grainProvidedBy,
        amountIncluded,
        feedingSchedule,
        stallCleaningFrequency,
        beddingType,
        numberOfPastures,
        sizeOfPastures,
        pasturesDragged,
        draggingFrequency,
        troughs,
        troughMaintenanceFrequency,
        singleTurnout,
        dryPaddocks,
        disciplines,
        barnOwnerBio,
        numberOfEmployees,
        barnManagerContactDetails,
        otherServices,
        fees,
        policies,
        latitude,
        longitude,
        isActive,
      } = req.body;
      if (!adminId || !barnId) {
        log.error("Error from [BARN SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      if (email) {
        if (!validateEmail(email)) {
          return res.status(400).json({
            message: "please enter valid email",
            code: 201,
            status: "fail",
          });
        }
      }

      if (phoneNumber) {
        if (!validateUSAMobileNumber(phoneNumber)) {
          return res.status(400).json({
            message: "please enter valid phone number",
            code: 201,
            status: "fail",
          });
        }
      }

      const isExistBarn = await barnDao.getBarnById(barnId);
      if (!isExistBarn.data) {
        return res.status(404).json({
          message: "barn not found",
          success: "success",
          code: 201,
          data: null,
        });
      }

      let newCoverImage;
      if (req.files.image && req.files.image[0].location) {
        let del = await deleteS3Object(isExistBarn.data.coverImage);
        newCoverImage = req.files.image[0].location;
      } else {
        newCoverImage = isExistBarn.data.coverImage;
      }

      let imageArray = [];
      if (req.files.images && req.files.images.length > 0) {
        if (
          isExistBarn &&
          isExistBarn.data.images &&
          isExistBarn.data.images.length > 0
        )
          isExistBarn.data.images.map(async (img) => await deleteS3Object(img));
        await Promise.all(
          req.files.images.map((img) => {
            imageArray.push(img.location);
          })
        );
      } else {
        imageArray = isExistBarn.data.images || [];
      }
      // const data = {
      //   name,
      //   feature,
      //   description,
      //   images: imageArray,
      //   coverImage: newCoverImage,
      //   price,
      //   contact: {
      //     address: {
      //       houseNumber,
      //       streetName,
      //       city,
      //       country,
      //     },
      //     websiteUrl,
      //     phoneNumber,
      //     email,
      //   },

      //   boarding: {
      //     stallAvailable,
      //     stallSizes,
      //     stallFeatures: {
      //       matted,
      //       fans,
      //       automaticWaterers,
      //       windows,
      //     },
      //     monthlyBoardRates,
      //   },

      //   amenities: {
      //     facilities: {
      //       indoorArena: {
      //         size: indoorArena,
      //       },
      //       outdoorArena: {
      //         size: outdoorArena,
      //       },
      //       lightedOutdoorArena: {
      //         size: lightedOutdoorArena,
      //       },
      //       roundPen,
      //       washStalls: {
      //         indoor,
      //         outdoor,
      //         heated,
      //         hotWater,
      //         coldWater,
      //       },
      //       tackRoom: {
      //         shared,
      //         individualLockers,
      //       },
      //       viewingLounge,
      //       restroom,
      //       trailerParking: {
      //         included: trailerParkingIncluded,
      //         fee: trailerParkingFee,
      //       },
      //     },
      //     services: {
      //       dailyTurnout: {
      //         individualTurnout,
      //         groupTurnout,
      //       },
      //       blanketingService: {
      //         included: {
      //           frequency: blanketFrequency,
      //           blanketWeight: blanketWeight,
      //         },
      //       },
      //       fee: {
      //         frequency: feeFrequency,
      //         blanketWeight: feeBlanketWeight,
      //       },
      //       grooming: {
      //         offered: groomingOffered,
      //         cost: groomingCost,
      //       },
      //       flySprayApplication: {
      //         offered: flySprayApplicationOffered,
      //         cost: flySprayApplicationCost,
      //       },
      //       hoofPicking: {
      //         offered: hoofPickingOffered,
      //         cost: hoofPickingCost,
      //       },
      //       dailyWoundCare: {
      //         offered: dailyWoundCareOffered,
      //         cost: dailyWoundCareCost,
      //       },
      //       dewormerOptions,
      //       holdingVetFarrierServices: {
      //         offered: vetOffered,
      //         cost: vetCost,
      //       },
      //       laundryFacilities,
      //       guestWiFi,
      //       vendingMachines,
      //     },
      //     horseCare: {
      //       hayProvidedBy,
      //       grainProvidedBy,
      //       amountIncluded,
      //       feedingSchedule,
      //       stallCleaningFrequency,
      //       beddingType,
      //       pastureDetails: {
      //         numberOfPastures,
      //         sizeOfPastures,
      //         pasturesDragged,
      //         draggingFrequency,
      //         troughs,
      //         troughMaintenanceFrequency,
      //       },
      //       turnoutOptions: {
      //         singleTurnout,
      //         dryPaddocks,
      //       },
      //     },
      //   },
      //   disciplines,
      //   additionalInfo: {
      //     barnOwnerBio,
      //     employeeInfo: {
      //       numberOfEmployees,
      //       barnManagerContactDetails,
      //     },
      //     otherServices,
      //     fees,
      //     policies,
      //   },
      //   location: {
      //     latitude,
      //     longitude,
      //   },
      //   isActive,
      // };

      const data = {
        name,
        feature,
        description,
        images: imageArray,
        coverImage: newCoverImage,
        price,
        contact: {
          address,
          websiteUrl,
          phoneNumber,
          email,
        },

        boarding: {
          stallAvailable,
          stallSizes,
          stallFeatures: {
            matted,
            fans,
            automaticWaterers,
            windows,
          },
          monthlyBoardRates,
        },

        amenities: {
          facilities: {
            indoorArena: {
              size: indoorArena,
            },
            outdoorArena: {
              size: outdoorArena,
            },
            lightedOutdoorArena: {
              size: lightedOutdoorArena,
            },
            roundPen,
            washStalls: {
              indoor,
              outdoor,
              heated,
              hotWater,
              coldWater,
            },
            tackRoom: {
              shared,
              individualLockers,
            },
            viewingLounge,
            restroom,
            trailerParking: {
              included: trailerParkingIncluded,
              fee: trailerParkingFee,
            },
          },
          services: {
            dailyTurnout: {
              individualTurnout,
              groupTurnout,
            },
            blanketingService: {
              included: {
                frequency: blanketFrequency,
                blanketWeight: blanketWeight,
              },
            },
            fee: {
              frequency: feeFrequency,
              blanketWeight: feeBlanketWeight,
            },
            grooming: {
              offered: groomingOffered,
              cost: groomingCost,
            },
            flySprayApplication: {
              offered: flySprayApplicationOffered,
              cost: flySprayApplicationCost,
            },
            hoofPicking: {
              offered: hoofPickingOffered,
              cost: hoofPickingCost,
            },
            dailyWoundCare: {
              offered: dailyWoundCareOffered,
              cost: dailyWoundCareCost,
            },
            dewormerOptions,
            holdingVetFarrierServices: {
              offered: vetOffered,
              cost: vetCost,
            },
            laundryFacilities,
            guestWiFi,
            vendingMachines,
          },
          horseCare: {
            hayProvidedBy,
            grainProvidedBy,
            amountIncluded,
            feedingSchedule,
            stallCleaningFrequency,
            beddingType,
            pastureDetails: {
              numberOfPastures,
              sizeOfPastures,
              pasturesDragged,
              draggingFrequency,
              troughs,
              troughMaintenanceFrequency,
            },
            turnoutOptions: {
              singleTurnout,
              dryPaddocks,
            },
          },
        },
        disciplines,
        additionalInfo: {
          barnOwnerBio,
          employeeInfo: {
            numberOfEmployees,
            barnManagerContactDetails,
          },
          otherServices,
          fees,
          policies,
        },
        location: {
          latitude,
          longitude,
        },
      };

      const result = await barnDao.updateBarn(barnId, data);
      console.log(result);
      if (result) {
        return res.status(200).json({
          message: "barn update successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "barn update failed",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //deleteBarnService
  async deleteBarnService(req, res) {
    try {
      const adminId = req.userId;
      const { barnId } = req.body;
      console.log(adminId, barnId);

      if (!adminId || !barnId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const isExistBarn = await barnDao.getBarnById(barnId);
      console.log(isExistBarn);
      if (!isExistBarn) {
        return res.status(200).json({
          message: "barn not found",
          success: "fail",
          code: 201,
        });
      }
      const result = await barnDao.deleteBarn(barnId);
      if (result) {
        return res.status(200).json({
          message: "barn deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "barn delete fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //getHorseDetailsService
  async getHorseDetailsService(req, res) {
    try {
      const adminId = req.userId;
      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await barnDao.getAllRentalSpaceHorse();
      if (result) {
        return res.status(200).json({
          message: "horse details get successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "horse detail not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
  //addServiceWithBarnService
  async addServiceWithBarnService(req, res) {
    try {
      const adminId = req.userId;
      const { barnId, serviceId, role, phoneNumber, email } = req.body;
      if (!adminId || !barnId || !phoneNumber || !email) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      if (email) {
        if (!validateEmail(email)) {
          return res.status(400).json({
            message: "please enter valid email",
            code: 201,
            status: "fail",
          });
        }
      }

      if (phoneNumber) {
        if (!validateUSAMobileNumber(phoneNumber)) {
          return res.status(400).json({
            message: "please enter valid phoneNumber",
            status: "fail",
            code: 201,
          });
        }
      }

      const data = {
        barnId,
        serviceProvider: adminId,
        status: "active",
      };
      const newAssociate =
        await barnServiceProviderDao.createBarnServiceProvider(data);
      const contact = {
        phoneNumber,
        email,
      };
      const updatedBarn = await barnDao.updateProviderDetail(
        barnId,
        serviceId,
        adminId,
        role,
        contact
      );

      if (updatedBarn.data) {
        return res.status(200).json({
          message: "Service provider associated with barn successfully.",
          code: 200,
          data: {
            barn: updatedBarn.data.contact,
            association: newAssociate.data,
          },
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //leaveServiceFromBarnService
  async leaveServiceFromBarnService(req, res) {
    try {
      const adminId = req.userId;
      const { barnId, serviceId } = req.body;

      if (!adminId || !barnId || !serviceId) {
        return res.status(400).json({
          message: "Invalid request. Please provide all required fields.",
          success: "fail",
          code: 400,
          data: null,
        });
      }

      const result = await barnServiceProviderDao.removeBarnServiceProvider(
        adminId,
        barnId
      );
      const updatedBarn = await barnDao.removeProviderDetail(
        barnId,
        serviceId,
        adminId
      );

      if (result.data) {
        return res.status(200).json({
          message: "Service provider removed from barn successfully.",
          code: 200,
          status: "success",
        });
      } else {
        return res.status(201).json({
          message: "Service provider removed from barn fail",
          code: 201,
          status: "fail",
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //getAllAssociatedBarnsService
  async getAllAssociatedBarnsService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const result = await barnServiceProviderDao.getAllBarn(adminId);
      if (result.data) {
        return res.status(200).json({
          message: "Barn List get Successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //allServiceProviderAssociateByBarnService
  async allServiceProviderAssociateByBarnService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }


      const getAdmin=await adminDao.getById(adminId);
      console.log("dsffffffffff",getAdmin);
      let parent=null;
      if(getAdmin.data){
        if(getAdmin?.data?.parentId){
          parent=getAdmin.data.parentId;
        }else{
          parent=adminId;
        }
      }



      const result = await barnDao.allServiceProviderAssociateByBarn(parent);
      if (result.data) {
        return res.status(200).json({
          message: "service providers list get Successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }

  //getAllBarnProductsService
  async getAllBarnProductsService(req, res) {
    try {
      const adminId = req.userId;

      if (!adminId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }

      const getAdmin=await adminDao.getById(adminId);
      console.log("dsffffffffff",getAdmin);
      let parent=null;
      if(getAdmin.data){
        if(getAdmin?.data?.parentId){
          parent=getAdmin.data.parentId;
        }else{
          parent=adminId;
        }
      }
      
      const result = await barnDao.getAllBarnProducts(parent);
      if (result.data) {
        return res.status(200).json({
          message: "products get Successfully",
          status: "success",
          code: 200,
          data: result.data,
        });
      }
    } catch (error) {
      log.error("error from [BARN SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new BarnService();
