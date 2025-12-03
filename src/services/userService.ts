import dbConnect from '@/lib/mongodb';
import { User, IUser } from '@/models';

export const userService = {
    async getUsers() {
        await dbConnect();
        const users = await User.find({}).sort({ createdAt: -1 }).lean();
        return users.map(u => ({ ...u, id: u._id.toString() }));
    },

    async getUser(id: string) {
        await dbConnect();
        const user = await User.findById(id).lean();
        if (!user) return null;
        return { ...user, id: user._id.toString() };
    },

    async createUser(id: string, data: Partial<IUser>) {
        await dbConnect();
        // Ignoring the passed 'id' as MongoDB generates its own _id, or we can use it if we really want to force it but usually not recommended for ObjectIds.
        // If 'id' is a string from external auth, we might store it in a separate field.
        // But here we are just creating a user.
        const newUser = await User.create(data);
        return { ...newUser.toObject(), id: newUser._id.toString() };
    },

    async updateUser(id: string, data: Partial<IUser>) {
        await dbConnect();
        const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).lean();
        if (!updatedUser) return null;
        return { ...updatedUser, id: updatedUser._id.toString() };
    },

    async deleteUser(id: string) {
        await dbConnect();
        await User.findByIdAndDelete(id);
    },
};
