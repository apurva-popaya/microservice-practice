import User from "../models/user.models.js";
import { hashContact } from "../utils/encryption.js";
import { normalizePhoneNumber } from "../utils/phone.js";

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

      user.type = data.type;
      user.name = data.name;
      user.org_name = data.org_name;
      user.org_location = data.org_location;

      const oldContact = normalizePhoneNumber(user.contact);
      const newContact = normalizePhoneNumber(data.contact);

      if (oldContact !== newContact) {
        user.contact = newContact; 
        user.contact_hash = hashContact(newContact);
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
      const { data, org_name, org_location } = payload;

      const users = await Promise.all(
        data.map(async (user) => {
          const normalizedContact = normalizePhoneNumber(user.contact);
          const contactHash = hashContact(normalizedContact);
          const existingUser = await User.findOne({
            type: user.type,
            contact_hash: contactHash,
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
            org_name,
            org_location,
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

  async getAllUsers(page, limit) {
    try {
      page = Number(page) || 1;
      limit = Number(limit) || 10;
      if (limit > 10) {
        limit = 10;
      }
      //limit = Math.min(limit, 10);
      const skip = (page - 1) * limit;
      const totalUsers = await User.countDocuments();
      const users = await User.find()
        .select("-contact_hash")
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
