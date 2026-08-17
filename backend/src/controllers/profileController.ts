import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { profileSchema } from "@ecommerce/shared";

export async function initProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.userId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const profile = await prisma.profile.upsert({
            where: {
                id: req.userId,
            },

            update: {},

            create: {
                id: req.userId,
            },
        });

        return res.status(200).json({
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}
export async function getProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const profile = await prisma.profile.findUnique({
            where: {
                id: req.userId,
            },
        });

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        return res.status(200).json({
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}
export async function updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const result = profileSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                error: "Invalid profile data",
                issues: result.error.issues,
            });
        }


        const data = result.data;
        const profile = await prisma.profile.update({
            where: {
                id: req.userId,
            },

            data: {
                firstName: data.firstName || null,
                lastName: data.lastName || null,
                phone: data.phone || null,

                addressLine1: data.addressLine1 || null,
                addressLine2: data.addressLine2 || null,

                city: data.city || null,
                state: data.state || null,
                postalCode: data.postalCode || null,

                country: data.country,
            },
        });


        return res.status(200).json({
            data: profile,
        });
    } catch (error) {
        next(error);
    }
}