const log = require("../../configs/logger.config");
const adminDao = require("../../daos/admin.dao");
const barnDao = require("../../daos/barn.dao");
const serviceDao = require("../../daos/service.dao");
const serviceCategoryDao = require("../../daos/serviceCategory.dao");
const serviceProviderDao = require("../../daos/serviceProvider.dao");
const { deleteS3Object } = require("../../utils/helpers/files.helper");
const { validateEmail } = require("../../utils/helpers/validator.utils");

class ServiceServices {
  async addServiceServices(req, res) {
    try {
      const adminId = req.userId;
      console.log(adminId);
      const {
        serviceCategoryId,
        name,
        feature,
        description,
        discount,
        discountPrice,
        streetName,
        latitude,
        longitude,
        city,
        country,
        price,
        timeSlot,
        barnId,
      } = req.body;
      console.log(req.body);
      console.log(req.body.timeSlot);
      let timeslot = JSON.parse(timeSlot);
      console.log(typeof timeslot);

      if (
        !req.files.images ||
        !req.files.image[0].location ||
        !adminId ||
        !serviceCategoryId ||
        !name ||
        !feature ||
        !description ||
        !discount ||
        !discountPrice ||
        !streetName ||
        !latitude ||
        !longitude ||
        !city ||
        !country ||
        !price ||
        !timeslot
      ) {
        log.error("Error from [SERVICE SERVICES]: invalid Request");
        return res.status(400).json({
          message: "something went wrong",
          status: "failed",
          data: null,
          code: 201,
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

      let providedBy = null;
      let ownedByBarn = null;
      let createdBy = "";

      const isAdmin = await adminDao.getById(adminId);
      console.log("sssssssssssss", isAdmin);
      if (
        isAdmin.data?.adminType !== "BarnOwner" &&
        isAdmin.data?.adminType !== "serviceProvider" && !isAdmin.data.parentId
      ) {
        if (isAdmin.data) {
          providedBy = adminId;
          createdBy = "superAdmin";
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      } else if (isAdmin.data?.adminType === "serviceProvider") {
        let serviceProvider = await serviceProviderDao.getServiceProviderById(
          adminId
        );

        if (!serviceProvider.data) {
          //create service provider
          const data = {
            serviceProvider: adminId,
            services: [],
          };
          var newServiceProvider =
            await serviceProviderDao.createServiceProvider(data);
          providedBy = newServiceProvider.data.serviceProvider;
          createdBy = "serviceProvider";
        }
      } else {
        let parent = null;
        if (isAdmin.data) {
          if (isAdmin?.data?.parentId) {
            parent = isAdmin.data.parentId;
          } else {
            parent = adminId;
          }
        }
        const parentInfo = await barnDao.getBarnByBarnOwner(parent);
        if (parentInfo.data) {
          ownedByBarn = parentInfo?.data?.barnId;
          createdBy = "barn";
        } else {
          return res.status(404).json({
            message: "admin not found",
            status: "fail",
            code: 201,
          });
        }
      }

      const isCatExist = await serviceCategoryDao.getServiceCategoryById(
        serviceCategoryId
      );

      if (!isCatExist.data) {
        return res.status(201).json({
          message: "category not exist",
          success: "fail",
          code: 201,
        });
      }

      const data = {
        serviceCategoryId,
        images: imageArray,
        coverImage: req.files.image[0].location,
        name,
        feature,
        description,
        discount,
        discountPrice,
        streetName,
        location: {
          latitude,
          longitude,
        },
        city,
        country,
        price,
        timeSlot: timeslot,
        providedBy,
        ownedByBarn,
        createdBy,
      };

      const result = await serviceDao.addService(data);
      if (result.data) {
        if (result.data.createdBy === "serviceProvider") {
          const updateServiceProvider =
            await serviceProviderDao.updateServiceProvider(
              newServiceProvider.data._id,
              result.data.serviceId
            );
        } else if (result.data.ownedByBarn) {
          const data = {
            service: result.data.serviceId,
          };
          const updateBarn = await barnDao.pushNewServiceInBarn(
            ownedByBarn,
            data
          );
        }

        return res.status(200).json({
          message: "service created successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "service creation failed",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE SERVICES]: ", error);
      throw error;
    }
  }
  //getAllBarn

  async getAllServiceServices(req, res) {
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

      const result = await serviceDao.getAllService();
      if (result) {
        return res.status(200).json({
          message: "services retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "services not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICE SERVICE]: ", error);
      throw error;
    }
  }

  async getServiceByIdService(req, res) {
    try {
      const adminId = req.userId;
      const { serviceId } = req.body;
      console.log(adminId);
      if (!adminId || !serviceId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await serviceDao.getServiceById(serviceId);
      if (result.data) {
        return res.status(200).json({
          message: "service retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "service not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }
  //updateServiceServices
  async updateServiceServices(req, res) {
    try {
      const admin = req.userId;

      const {
        serviceId,
        serviceCategoryId,
        name,
        feature,
        description,
        discount,
        discountPrice,
        streetName,
        latitude,
        longitude,
        city,
        country,
        price,
        timeSlot,
        isActive,
        barnId,
      } = req.body;
      console.log(req.body);

      if (!admin || !serviceId) {
        log.error("Error from [SERVICES SERVICES]: invalid Request");
        return res.status(400).json({
          message: "Invalid request",
          status: "failed",
          data: null,
          code: 201,
        });
      }

      let timeslot = null;

      if (timeSlot) {
        timeslot = JSON.parse(timeSlot);
        console.log(typeof timeslot);
      }

      const isExistService = await serviceDao.getServiceById(serviceId);
      if (!isExistService.data) {
        return res.status(404).json({
          message: "service not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      if (serviceCategoryId) {
        const result = await serviceCategoryDao.getServiceCategoryById(
          serviceCategoryId
        );
        if (!result.data) {
          return res.status(201).json({
            message: "category not found",
            success: "fail",
            code: 201,
            data: null,
          });
        }
      }
      if (barnId) {
        const isExistBarn = await barnDao.getBarnById(barnId);
        if (!isExistBarn.data) {
          return res.status(404).json({
            message: "barn not found",
            success: "success",
            code: 201,
            data: null,
          });
        }
      }

      console.log(isExistService.data.images);
      let imageArray = [];
      if (req.files.images && req.files.images.length > 0) {
        if (
          isExistService &&
          isExistService.images &&
          isExistService.images.length > 0
        )
          isExistService.data.images.map(
            async (img) => await deleteS3Object(img)
          );
        await Promise.all(
          req.files.images.map((img) => {
            imageArray.push(img.location);
          })
        );
      } else {
        imageArray = isExistService?.data?.images;
      }

      let newCoverImage;
      if (req.files.image && req.files.image[0].location) {
        let del = await deleteS3Object(isExistService.data.coverImage);
        newCoverImage = req.files.image[0].location;
      } else {
        newCoverImage = isExistService.data.coverImage;
      }

      const data = {
        serviceId,
        serviceCategoryId,
        images: imageArray,
        coverImage: newCoverImage,
        name,
        feature,
        description,
        discount,
        discountPrice,
        streetName,
        location: {
          latitude,
          longitude,
        },
        city,
        country,
        price,
        timeSlot: timeslot,
        isActive,
        barnId,
      };
      const result = await serviceDao.updateService(serviceId, data);
      console.log(result);
      if (result.data) {
        return res.status(200).json({
          message: "service update successfully",
          success: "success",
          data: result.data,
          code: 200,
        });
      } else {
        return res.status(201).json({
          message: "service update failed",
          success: "fail",
          data: null,
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }
  //deleteServiceServices
  async deleteServiceServices(req, res) {
    try {
      const adminId = req.userId;
      const { serviceId } = req.body;
      console.log(adminId, serviceId);

      if (!adminId || !serviceId) {
        return res.status(200).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const isExistService = await serviceDao.getServiceById(serviceId);
      console.log(isExistService);
      if (isExistService.code === 201) {
        return res.status(200).json({
          message: "service not found",
          success: "fail",
          code: 201,
        });
      }

      const serviceData = isExistService.data;

      if (
        serviceData.createdBy === "serviceProvider" &&
        serviceData.providedBy
      ) {
        await serviceProviderDao.updateServiceProvider(
          serviceData.providedBy,
          serviceId,
          "remove"
        );
      }
      const result = await serviceDao.deleteService(serviceId);
      if (result.data) {
        return res.status(200).json({
          message: "service deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "service delete fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }

  //getAllServiceEnquiryServices
  async getAllServiceEnquiryServices(req, res) {
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
      const result = await serviceDao.getAllServiceEnquiry();
      if (result.data) {
        return res.status(200).json({
          message: "service retrieved successfully",
          success: "success",
          code: 200,
          data: result.data,
        });
      } else {
        return res.status(404).json({
          message: "service not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }
  //delete enquiry
  async deleteServiceEnquiryByIdServices(req, res) {
    try {
      const adminId = req.userId;
      const { serviceEnquiryId } = req.body;

      if (!adminId || !serviceEnquiryId) {
        return res.status(400).json({
          message: "invalid request",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const isExist = await serviceDao.getServiceEnquiryById(serviceEnquiryId);
      if (!isExist.data) {
        return res.status(400).json({
          message: "service enquiry not found",
          success: "fail",
          code: 201,
          data: null,
        });
      }
      const result = await serviceDao.deleteServiceEnquiryById(
        serviceEnquiryId
      );
      if (result.data) {
        return res.status(200).json({
          message: "enquiry deleted successfully",
          success: "success",
          code: 200,
        });
      } else {
        return res.status(404).json({
          message: "enquiry deletion fail",
          success: "fail",
          code: 201,
        });
      }
    } catch (error) {
      log.error("error from [SERVICES SERVICE]: ", error);
      throw error;
    }
  }
}
module.exports = new ServiceServices();
