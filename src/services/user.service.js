import User from "../models/user.models.js";

class UserService {
  async addUser(data) {
    try{
      const existingUser = await User.findOne({
      contact: data.contact,
    });

    if(existingUser){
      const err = new Error("User already exixts");
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create(data);

    return user;
    }catch(err){
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "unable to add the user";
      throw err;
    }
  };

  async getUserByContact(contact){
    try{
      const user = await User.findOne({ contact });
      
      if(!user){
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      
      return user;
    }catch(err){
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to get user";
      throw err;
    }
  };

  async updateUser(contact, data){
    try{
      const existingUser = await User.findOne({contact})
      if(!existingUser){
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const user = await User.findOneAndUpdate(
        { contact: contact },
        data,
        { new: true }
      );

      return user;

    }catch(err){
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to update user";
      throw err;
    }
  };

  async deleteUser(contact){
    try{
      const existingUser = await User.findOne({contact})
      if(!existingUser){
        const err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      
      const user = await User.findOneAndDelete({
        contact,
      });

    return user;

    }catch(err){
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to delete user";
      throw err;
    }
  };


  async addBulkUsers(payload){
    try{
      const { data, org_name, org_location } = payload;

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

      const users = await Promise.all(
        data.map(async (user) =>{
            const existingUser = await User.findOne({
            type: user.type,
            contact: user.contact, 
          });

          if(existingUser){
            const err = new Error("User already exists");
            err.statusCode = 409;
            throw err;
          }

          return {
            type: user.type,
            name: user.name,
            contact: user.contact,
            org_name,
            org_location,
          };
        })
      )

      // const users = data.map((user)=>{
      //   return {
      //      type: user.type, name: user.name, contact: user.contact, org_name: org_name, org_location: org_location,
      //   };
      // });

      return await User.insertMany(users);
      
    }catch(err){
      err.statusCode = err.statusCode || 500;
      err.message = err.message || "failed to add users";
      throw err;
    }
  }
};

export default new UserService();