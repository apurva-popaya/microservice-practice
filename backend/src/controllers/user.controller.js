import UserService from "../services/user.service.js";
import { userSchema, contactSchema } from "../validation/user.validation.js";
import { bulkUserSchema, updateUserSchema } from "../validation/bulkUser.validation.js";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const result = updateUserSchema.safeParse(req.body);
    if (!result.success) {
      const err = new Error();
      err.statusCode = 400;
      err.message = result.error.issues.map((issue) => issue.message);
      throw err;
    }

    const { id } = req.params;

    const user = await UserService.updateUser(id, req.body);

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      // data: user
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || [],
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;

    const user = await UserService.deleteUser(id);

    return res.status(200).json({
      success: true,
      message: "Data deleted successfully",
      // data: user,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const addBulkUsers = async (req, res) => {
  try {
    const result = bulkUserSchema.safeParse(req.body);

    if (!result.success) {
      const err = new Error("Validation failed");
      err.statusCode = 400;
      err.message = result.error.issues.map((issue) => issue.message);
      throw err;
    }

    const users = await UserService.addBulkUsers(req.body);

    return res.status(201).json({
      success: true,
      message: "Users added successfully",
      // data: users,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getAllUsers = async(req,res) => {
  try{
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const search = req.query.search;

    const users = await UserService.getAllUsers(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });

  }catch(err){
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};








// export const addUser = async (req, res) => {
//   try {
//     const result = userSchema.safeParse(req.body);
//     if (!result.success) {
//       return res.status(400).json({
//         success: false,
//         message: result.error.issues.map((err) => err.message),
//         // message: result.error.issues[0].message,
//       });
//     }

//     const user = await UserService.addUser(req.body);

//     return res.status(201).json({
//       success: true,
//       message: "Data added successfully",
//       //data: user,
//     });
//   } catch (err) {
//     return res.status(err.statusCode || 500).json({
//       success: false,
//       message: err.message || "Internal Server Error",
//     });
//   }
// };













// if (!result.success) {
//   // Group errors by field name
//   const fieldErrors = {};
//   for (const issue of result.error.issues) {
//     const field = issue.path[0]; // e.g., "name", "contact"
//     if (!fieldErrors[field]) {
//       fieldErrors[field] = issue.message; // Take only the first error for that field
//     }
//   }

//   return res.status(400).json({
//     success: false,
//     errors: fieldErrors, // { name: "Name is required!", contact: "Contact number is required!" }
//   });
// }





//Code for validation of contact in url

    // const result = contactSchema.safeParse(req.params);
    // if (!result.success) {
    //   return res.status(400).json({
    //     success: false,
    //     message: result.error.issues.map((err) => err.message),
    //   });
    // }