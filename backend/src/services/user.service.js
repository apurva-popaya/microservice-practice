import User from "../models/user.models.js";
import { hashContact } from "../utils/encryption.js";
import { normalizePhoneNumber, validatePhoneNumber } from "../utils/phone.js";

class UserService {
  async getUserById(id) {
    try {
      const user = await User.findById(id).select("-contact_hash");

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      return user;
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to get user";
      throw err;
    }
  }

  async updateUser(id, data) {
    try {
      const user = await User.findById(id);

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      if (data.type !== undefined) {
        user.type = data.type;
      }

      if (data.name !== undefined) {
        user.name = data.name;
      }

      if (data.listingId !== undefined) {
        user.listingId = data.listingId;
      }

      if (data.brokerId !== undefined) {
        user.brokerId = data.brokerId;
      }

      if (data.firmId !== undefined) {
        user.firmId = data.firmId;
      }

      if (data.contact !== undefined) {
        const oldContact = normalizePhoneNumber(user.contact);
        const newContact = normalizePhoneNumber(data.contact);

        if (oldContact !== newContact) {
          user.contact = newContact;
          user.contact_hash = hashContact(newContact);
        }
      }

      await user.save();
      user.contact_hash = undefined;
      return user;
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to update user";
      throw err;
    }
  }

  async deleteUser(id) {
    try {
      const existingUser = await User.findById(id);
      if (!existingUser) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      const user = await User.findByIdAndDelete(id);

      return user;
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to delete user";
      throw err;
    }
  }

  async addBulkUsers(payload) {
    try {
      const { data, listingId, brokerId, firmId } = payload;

      const users = await Promise.all(
        data.map(async (user) => {
          const normalizedContact = normalizePhoneNumber(user.contact);
          const contactHash = hashContact(normalizedContact);
          const existingUser = await User.findOne({
            type: user.type,
            contact_hash: contactHash,
            listingId,
          });

          if (existingUser) {
            const err = new Error("User already exists");
            err.statusCode = 409;
            throw err;
          }

          return {
            type: user.type,
            name: user.name,
            contact: normalizedContact,
            contact_hash: contactHash,
            listingId,
            brokerId,
            firmId,
          };
        }),
      );

      return await User.insertMany(users);
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to add users";
      throw err;
    }
  }

  async getAllUsers(page, limit, search) {
    try {
      page = Number(page) || 1;
      limit = Number(limit) || 10;

      if (limit > 10) {
        limit = 10;
      }

      const skip = (page - 1) * limit;

      const searchableFields = [
        //"id",
        "type",
        "name",
        // "org_name",
        // "org_location",
        // "createdAt",
        // "updatedAt"
      ];

      const filter = {};

      if (search) {
        const orConditions = [];

        const searchValue = search.trim();

        const escapedSearch = searchValue.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

        searchableFields.forEach((field) => {
          orConditions.push({
            [field]: {
              $regex: escapedSearch,
              $options: "i",
            },
          });
        });

        if (validatePhoneNumber(searchValue).length === 0) {
          const normalizedContact = normalizePhoneNumber(searchValue);
          const contactHash = hashContact(normalizedContact);

          orConditions.push({
            contact_hash: contactHash,
          });
        }

        filter.$or = orConditions;
      }

      const totalUsers = await User.countDocuments(filter);

      const users = await User.find(filter)
        .select("-contact_hash")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalPages = Math.ceil(totalUsers / limit);

      return {
        totalUsers,
        currentPage: page,
        limit,
        totalPages,
        data: users,
      };
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to get all users";
      throw err;
    }
  }
}

export default new UserService();

// async addUser(data) {
//   try{
//     const contactHash = hashContact(data.contact);

//     const existingUser = await User.findOne({
//       // contact: data.contact,
//       contact_hash: contactHash,
//     });

//     if(existingUser){
//       const err = new Error("User already exixts");
//       err.statusCode = 409;
//       throw err;
//     }

//     const encryptedContact = encryptContact(data.contact);

//     const user = await User.create({
//       type: data.type,
//       name: data.name,
//       contact: encryptedContact,
//       contact_hash: contactHash,
//       org_name: data.org_name,
//       org_location: data.org_location
//     });

//     //user.contact = data.contact;

//     return user;
//   }catch(err){
//     err.statusCode = err.statusCode || 500;
//     err.message = err.message || "unable to add the user";
//     throw err;
//   }
// };

// const uniqueUsers = new Set();
// for(const user of data){
//   const key = `${user.type}-${user.contact}`;

//   if(uniqueUsers.has(key)){
//     const err = new Error("User already exists");
//     err.statusCode = 409;
//     throw err;
//   }
//   uniqueUsers.add(key);
// }
