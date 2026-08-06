import User from "../models/user.models.js";
import {
  encryptContact,
  decryptContact,
  hashContact,
} from "../utils/encryption.js";

class UserService {
  
  async getUserById(id) {
    try {
      const user = await User.findById(id).select("-contact_hash");

      if (!user) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      user.contact = decryptContact(user.contact);

      return user;
    } catch (err) {
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to get user";
      throw err;
    }
  }

  async updateUser(id, data) {
    try {
      const existingUser = await User.findById(id);

      if (!existingUser) {
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }

      const updateData = {
        type: data.type,
        name: data.name,
        contact: existingUser.contact,
        contact_hash: existingUser.contact_hash,
        org_name: data.org_name,
        org_location: data.org_location,
      };

      const oldContact = decryptContact(existingUser.contact);

      if (oldContact !== data.contact) {
        const newContactHash = hashContact(data.contact);
        updateData.contact = encryptContact(data.contact);
        updateData.contact_hash = newContactHash;
      }

      const updatedUser = await User.findByIdAndUpdate(
        id , 
        updateData, 
        {new: true,}
      );

      //updatedUser.contact = decryptContact(updatedUser.contact);

      return updatedUser;
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
          const contactHash = hashContact(user.contact);
          const existingUser = await User.findOne({
            type: user.type,
            contact_hash: contactHash,
          });

          if (existingUser) {
            const err = new Error("User already exists");
            err.statusCode = 409;
            throw err;
          }

          const encryptedContact = encryptContact(user.contact);

          return {
            type: user.type,
            name: user.name,
            country_code: user.country_code,
            contact: encryptedContact,
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

  async getAllUsers(page, limit){
    try{
      const skip = (page - 1) * limit;
      const users = await User.find().select("-contact_hash").skip(skip).limit(limit);
      // users.contact = decryptContact(users.contact);
      users.forEach((user)=>{
        user.contact = decryptContact(user.contact);
      });
      return users;

    }catch(err){
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
