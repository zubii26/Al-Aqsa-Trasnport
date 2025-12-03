import mongoose, { Schema, Document, Model } from 'mongoose';

// --- Interfaces ---

export interface IVehicle extends Document {
    id?: string;
    name: string;
    image: string;
    passengers: number;
    luggage: number;
    features: string[];
    price: string;
    hourlyRate?: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IBooking extends Document {
    name: string;
    email: string;
    phone: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    vehicle: string;
    passengers: number;
    status: string;
    userId?: string;
    price?: string;
    originalPrice?: number;
    discountApplied?: number;
    finalPrice?: number;
    discountType?: 'percentage' | 'fixed';
    routeId?: string;
    vehicleId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IUser extends Document {
    id?: string;
    email: string;
    name?: string;
    role: 'user' | 'admin' | 'manager' | 'operational_manager';
    password?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReview extends Document {
    name: string;
    rating: number;
    comment: string;
    date: string;
    source: 'google' | 'website';
    avatar?: string;
    isActive: boolean;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

export interface ISettings extends Document {
    key: string;
    value: string;
    type: string;
    updatedAt: Date;
}

export interface IRoute extends Document {
    origin: string;
    destination: string;
    distance?: string;
    duration?: string;
    category: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRoutePrice extends Document {
    route: string; // Reference to Route
    vehicle: string; // Reference to Vehicle
    price: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IGalleryItem extends Document {
    image: string;
    caption: string;
    location: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
}



export interface ISection extends Document {
    name: string; // Unique key
    page: string; // e.g., 'home', 'fleet', 'about'
    type: string; // e.g., 'hero', 'content', 'cta'
    title: string;
    subtitle?: string;
    content: string; // HTML content
    images: {
        url: string;
        alt: string;
        type: 'desktop' | 'mobile' | 'thumbnail';
    }[];
    customFields?: {
        key: string;
        label: string;
        value: string;
        type: 'text' | 'link' | 'color' | 'boolean';
    }[];
    metaTitle?: string;
    metaDescription?: string;
    isActive: boolean;
    lastUpdatedBy: string; // User ID
    createdAt: Date;
    updatedAt: Date;
}

// --- Schemas ---

const VehicleSchema = new Schema<IVehicle>({
    name: { type: String, required: true },
    image: { type: String, required: true },
    passengers: { type: Number, required: true },
    luggage: { type: Number, required: true },
    features: { type: [String], required: true },
    price: { type: String, required: true },
    hourlyRate: { type: String },
    category: { type: String, default: 'Standard' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const BookingSchema = new Schema<IBooking>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicle: { type: String, required: true },
    passengers: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    userId: { type: String },
    price: { type: String },
    originalPrice: { type: Number },
    discountApplied: { type: Number },
    finalPrice: { type: Number },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    routeId: { type: String },
    vehicleId: { type: String },
}, { timestamps: true });

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin', 'manager', 'operational_manager'], default: 'user' },
    password: { type: String },
}, { timestamps: true });

const ReviewSchema = new Schema<IReview>({
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    date: { type: String, required: true },
    source: { type: String, enum: ['google', 'website'], default: 'website' },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

const SettingsSchema = new Schema<ISettings>({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
    type: { type: String, default: 'text' },
}, { timestamps: true });

const RouteSchema = new Schema<IRoute>({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    distance: { type: String },
    duration: { type: String },
    category: { type: String, default: 'Intercity' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const RoutePriceSchema = new Schema<IRoutePrice>({
    route: { type: String, required: true }, // Storing ID as string for now, or ObjectId if we migrate IDs
    vehicle: { type: String, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

// Add indexes for performance
RoutePriceSchema.index({ route: 1, vehicle: 1 }, { unique: true });
RoutePriceSchema.index({ route: 1 });

const GalleryItemSchema = new Schema<IGalleryItem>({
    image: { type: String, required: true },
    caption: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

export interface IBlogPost extends Document {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: Date;
    readTime: string;
    image: string;
    alt: string;
    author: string;
    tags: string[];
    isPublished: boolean;
    metaTitle?: string;
    metaDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    readTime: { type: String, required: true },
    image: { type: String, required: true },
    alt: { type: String, required: true },
    author: { type: String, required: true },
    tags: { type: [String], default: [] },
    isPublished: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
}, { timestamps: true });

// ... (other schemas)

export interface IAuditLog extends Document {
    action: string;
    entity: string;
    entityId?: string;
    details?: string;
    user: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
    action: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String },
    details: { type: String },
    user: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export const Route: Model<IRoute> = mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);
export const RoutePrice: Model<IRoutePrice> = mongoose.models.RoutePrice || mongoose.model<IRoutePrice>('RoutePrice', RoutePriceSchema);
export const GalleryItem: Model<IGalleryItem> = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

const SectionSchema = new Schema<ISection>({
    name: { type: String, required: true, unique: true },
    page: { type: String, required: true, index: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String },
    images: [{
        url: { type: String, required: true },
        alt: { type: String },
        type: { type: String, enum: ['desktop', 'mobile', 'thumbnail'], default: 'desktop' }
    }],
    customFields: [{
        key: { type: String, required: true },
        label: { type: String, required: true },
        value: { type: String },
        type: { type: String, enum: ['text', 'link', 'color', 'boolean'], default: 'text' }
    }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
    lastUpdatedBy: { type: String },
}, { timestamps: true });

export const Section: Model<ISection> = mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);
