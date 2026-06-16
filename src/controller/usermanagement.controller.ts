import { asyncHandler } from "../common/utils/async.handler";
import { Request, Response } from "express";
import { PaginationQueryInputUser } from "../common/validators/user.validation";
import { UserModel } from "../model/user.model";
import FilterQuery, { PipelineStage } from "mongoose";
import { sendSuccess } from "../common/utils/unified.response";
import { RoleModel } from "../model/role.model";

export class UserManagementController {
    getPaginatedUsers = asyncHandler(async (req: Request, res: Response) => {
        const allRoles = await RoleModel.find({isDeleted:false})
        const query = req.query as unknown as PaginationQueryInputUser;
        console.log(query)
        const and_clause: any[] = [{ isDeleted: false }];
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;
        if (query.serach) {
            const regex = new RegExp(query.serach, 'i');
            and_clause.push({
                $or: [{ "firstName": regex }, { "lastName": regex }, { "email": regex }]
            })
        }
        // if (query.isActive !== null && query.isActive !== undefined) {
        //     and_clause.push({ "isActive": query.isActive })
        // }
        if (query.role) {
            const roleId = allRoles.find(r=>r.roleDisplayName.toLowerCase() === query.role?.toLowerCase())
            if(roleId){
                and_clause.push({ "role": roleId._id })
            }
        }
        const condition = { $and: and_clause };
        console.log(condition)
        const filterPipeline: PipelineStage[] = [
            {
                $match: condition
            },
            {
                $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                roleDisplayName: 1,
                                roleGroup: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$role'
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    firstName: 1,
                    lastName: 1,
                    phone: 1,
                    dateOfBirth: 1,
                    role: 1
                }
            }
        ]
        const countPipeline: PipelineStage[] = [
            { $match: condition },
            { $count: 'total' }
        ]
        const [countResult, docs] = await Promise.all([
            UserModel.aggregate(countPipeline),
            UserModel.aggregate([...filterPipeline, { $sort: { createdAt: 1 } }])
        ])
        const totalDocs = countResult.length ? countResult[0].total : 0;
        const remainingDocs = totalDocs - (skip + docs.length);
        const hasNextPage = remainingDocs > 0;
        const hasPrevPage = page > 1;
        let result = {
            meta: {
                totalDocs,
                skip,
                page,
                limit,
                hasPrevPage,
                hasNextPage,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
            },
            docs,
        }
        return sendSuccess(res, "Users fetched successfully", result, 200);
    })
}