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
    unavailableDates?: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IBooking extends Document {
    id?: string;
    name: string;
    email: string;
    phone: string;
    pickup: string;
    dropoff: string;
    date: string;
    time: string;
    vehicle: string;
    passengers: number;
    vehicleCount?: number;
    luggage?: number;
    notes?: string;
    status: string;
    paymentStatus: 'paid' | 'unpaid' | 'refunded';
    paymentMethod?: string; // 'cash', 'credit_card', 'agency_wallet', etc.
    userId?: string;
    price?: string;
    originalPrice?: number;
    discountApplied?: number;
    finalPrice?: number;
    discountType?: 'percentage' | 'fixed';
    routeId?: string;

    vehicleId?: string;
    selectedVehicles?: { vehicleId: string; quantity: number; name?: string }[];
    country?: string;
    flightNumber?: string;
    arrivalDate?: string;

    assignedDriverId?: string;
    driverStatus?: 'pending' | 'accepted' | 'en_route' | 'arrived' | 'completed' | 'cancelled';

    rating?: number;
    review?: string;
    reviewEmailSent?: boolean;

    createdAt: Date;
    updatedAt: Date;
    groupId?: string;
    isBulk?: boolean;
}

export interface IUser extends Document {
    id?: string;
    email: string;
    name?: string;
    role: 'user' | 'admin' | 'manager' | 'operational_manager' | 'driver' | 'agency';
    activeContracts?: number;
    creditLimit?: number;
    isOnline?: boolean;
    location?: {
        lat: number;
        lng: number;
        address?: string;
        lastUpdated: Date;
        heading?: number;
    };
    password?: string;
    phone?: string;
    pushSubscription?: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        };
    };
    createdAt: Date;
    updatedAt: Date;
    branding?: {
        logo: string;
        primaryColor: string;
    };
    paymentTerms?: 'Net15' | 'Net30' | 'Prepaid';
    parentId?: string; // For sub-accounts (Employee of Agency)
    permissions?: string[]; // ['BOOKING', 'FINANCE', 'ADMIN']
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



export interface IDriver extends Document {
    name: string;
    photo: string;
    experience: string;
    languages: string[];
    certifications: string[];
    rating: number;
    trips: string;
    quote: string;
    badges: string[];
    isActive: boolean;
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



export interface ISubscriber extends Document {
    email: string;
    source: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// --- Schemas ---

const DriverSchema = new Schema<IDriver>({
    name: { type: String, required: true },
    photo: { type: String, required: true },
    experience: { type: String, required: true },
    languages: { type: [String], required: true },
    certifications: { type: [String], default: [] },
    rating: { type: Number, default: 5 },
    trips: { type: String, default: '0' },
    quote: { type: String },
    badges: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SectionSchema = new Schema<ISection>({
    name: { type: String, required: true, unique: true },
    page: { type: String, required: true },
    type: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    content: { type: String },
    images: [{
        url: { type: String },
        alt: { type: String },
        type: { type: String, enum: ['desktop', 'mobile', 'thumbnail'] }
    }],
    customFields: [{
        key: { type: String },
        label: { type: String },
        value: { type: String },
        type: { type: String, enum: ['text', 'link', 'color', 'boolean'] }
    }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
    lastUpdatedBy: { type: String },
}, { timestamps: true });

const SubscriberSchema = new Schema<ISubscriber>({
    email: { type: String, required: true, unique: true },
    source: { type: String, default: 'website' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

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
    unavailableDates: { type: [String], default: [] },
}, { timestamps: true });

const BookingSchema = new Schema<IBooking>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    pickup: { type: String, required: true },
    dropoff: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    vehicle: { type: String },
    passengers: { type: Number },
    vehicleCount: { type: Number, default: 1 },
    luggage: { type: Number, default: 0 },
    notes: { type: String },
    status: { type: String, default: 'pending' },
    paymentStatus: { type: String, enum: ['paid', 'unpaid', 'refunded'], default: 'unpaid' },
    paymentMethod: { type: String },
    userId: { type: String },
    price: { type: String },
    originalPrice: { type: Number },
    discountApplied: { type: Number },
    finalPrice: { type: Number },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    routeId: { type: String },

    vehicleId: { type: String },
    selectedVehicles: [{
        vehicleId: { type: String },
        quantity: { type: Number },
        name: { type: String }
    }],
    country: { type: String },
    flightNumber: { type: String },
    arrivalDate: { type: String },

    // Driver Assignment
    assignedDriverId: { type: String }, // Links to User._id (role: driver)
    driverStatus: { type: String, enum: ['pending', 'accepted', 'en_route', 'arrived', 'completed', 'cancelled', 'rejected'], default: 'pending' },

    // Rating & Review
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    reviewEmailSent: { type: Boolean, default: false },
    groupId: { type: String, index: true },
    isBulk: { type: Boolean, default: false },
}, { timestamps: true });

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    role: { type: String, enum: ['user', 'admin', 'manager', 'operational_manager', 'driver', 'agency'], default: 'user' },
    activeContracts: { type: Number, default: 0 },
    creditLimit: { type: Number, default: 0 },
    isOnline: { type: Boolean, default: false },
    location: {
        lat: { type: Number },
        lng: { type: Number },
        address: { type: String },
        lastUpdated: { type: Date },
        heading: { type: Number }
    },
    password: { type: String },
    phone: { type: String },
    pushSubscription: {
        endpoint: { type: String },
        keys: {
            p256dh: { type: String },
            auth: { type: String }
        }
    },
    branding: {
        logo: { type: String },
        primaryColor: { type: String }
    },
    paymentTerms: { type: String, enum: ['Net15', 'Net30', 'Prepaid'], default: 'Net30' },
    parentId: { type: String, index: true },
    permissions: { type: [String], default: [] }
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

const NotificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    link: { type: String },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });

export interface IDraftBooking extends Document {
    email?: string;
    phone?: string;
    name?: string;
    step: number;
    data: any; // Flexible JSON for whatever state they were in
    lastActive: Date;
    recoveryEmailSent: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DraftBookingSchema = new Schema<IDraftBooking>({
    email: { type: String, index: true },
    phone: { type: String },
    name: { type: String },
    step: { type: Number, default: 1 },
    data: { type: Schema.Types.Mixed },
    lastActive: { type: Date, default: Date.now },
    recoveryEmailSent: { type: Boolean, default: false },
}, { timestamps: true });

// Revert hack
// Revert hack
export const Driver: Model<IDriver> = mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
export const Section: Model<ISection> = mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);
export const Subscriber = mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const DraftBooking: Model<IDraftBooking> = mongoose.models.DraftBooking || mongoose.model<IDraftBooking>('DraftBooking', DraftBookingSchema);
export const BlogPost: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
export const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
export const Vehicle: Model<IVehicle> = mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema);
export const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
export const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export const Route: Model<IRoute> = mongoose.models.Route || mongoose.model<IRoute>('Route', RouteSchema);
export const RoutePrice: Model<IRoutePrice> = mongoose.models.RoutePrice || mongoose.model<IRoutePrice>('RoutePrice', RoutePriceSchema);
export const GalleryItem: Model<IGalleryItem> = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);

export interface IMessage extends Document {
    senderId: string;
    receiverId?: string; // If 1:1 chat (optional if group)
    senderRole: 'admin' | 'driver' | 'user';
    content: string;
    isRead: boolean;
    channelId: string; // Helper to group conversations (e.g. `chat_${driverId}`)
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    senderId: { type: String, required: true },
    receiverId: { type: String },
    senderRole: { type: String, enum: ['admin', 'driver', 'user', 'agency'], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    channelId: { type: String, required: true, index: true },
}, { timestamps: true });

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export interface IPayment extends Document {
    userId: string; // The Agency or User who paid
    amount: number;
    currency: string;
    method: 'bank_transfer' | 'cash' | 'credit_card' | 'other';
    reference?: string; // e.g. Transaction ID, Check #
    notes?: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    recordedBy: string; // Admin ID
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>({
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'SAR' },
    method: { type: String, enum: ['bank_transfer', 'cash', 'credit_card', 'other'], required: true },
    reference: { type: String },
    notes: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
    recordedBy: { type: String, required: true },
}, { timestamps: true });

export const Payment: Model<IPayment> = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

// --- Agency Wallet System ---

export interface IAgencyWallet extends Document {
    agencyId: string; // Links to User._id (role: agency)
    // Example: Agency given 10k Limit. Balance 0. Available 10k.
    // Book 1k ride -> Balance -1k. Available 9k.
    // Pay 1k -> Balance 0.


    balance: number;
    creditLimit: number;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AgencyWalletSchema = new Schema<IAgencyWallet>({
    agencyId: { type: String, required: true, unique: true, index: true },
    balance: { type: Number, default: 0 }, // Negative means debt, Positive means prepaid credit
    creditLimit: { type: Number, default: 0 },
    currency: { type: String, default: 'SAR' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export interface IWalletTransaction extends Document {
    walletId: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT'; // DEBIT = Booking (Increases debt/Lowers balance), CREDIT = Payment (Reduces debt/increases balance)
    referenceType: 'BOOKING' | 'PAYMENT' | 'ADJUSTMENT' | 'REFUND';
    referenceId: string;
    description: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    performedBy: string; // User ID
    createdAt: Date;
    updatedAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>({
    walletId: { type: String, required: true, index: true },
    amount: { type: Number, required: true }, // Always positive magnitude
    type: { type: String, enum: ['DEBIT', 'CREDIT'], required: true },
    referenceType: { type: String, enum: ['BOOKING', 'PAYMENT', 'ADJUSTMENT', 'REFUND'], required: true },
    referenceId: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], default: 'COMPLETED' },
    performedBy: { type: String, required: true },
}, { timestamps: true });

export const AgencyWallet: Model<IAgencyWallet> = mongoose.models.AgencyWallet || mongoose.model<IAgencyWallet>('AgencyWallet', AgencyWalletSchema);
export const WalletTransaction: Model<IWalletTransaction> = mongoose.models.WalletTransaction || mongoose.model<IWalletTransaction>('WalletTransaction', WalletTransactionSchema);

export interface IInvoice extends Document {
    agencyId: string;
    invoiceNumber: string;
    periodStart: Date;
    periodEnd: Date;
    dueDate: Date;
    totalAmount: number;
    status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIAL' | 'OVERDUE';
    items: {
        description: string;
        amount: number;
        referenceId?: string; // Booking ID or Transaction ID
        date: Date;
    }[];
    paidAmount: number;
    pdfUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
    agencyId: { type: String, required: true, index: true },
    invoiceNumber: { type: String, required: true, unique: true },
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['DRAFT', 'ISSUED', 'PAID', 'PARTIAL', 'OVERDUE'], default: 'DRAFT' },
    items: [{
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        referenceId: { type: String },
        date: { type: Date, required: true }
    }],
    paidAmount: { type: Number, default: 0 },
    pdfUrl: { type: String }
}, { timestamps: true });

export const Invoice: Model<IInvoice> = mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);

