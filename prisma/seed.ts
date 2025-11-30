import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const VEHICLES = [
    {
        id: 'camry',
        name: 'Toyota Camry',
        passengers: 4,
        luggage: 2,
        features: ['Air Conditioning', 'Comfortable Seating', 'USB Charging'],
        price: 'Start from 120 SAR',
        category: 'Standard',
        isActive: true,
        image: '/images/fleet/camry.png' // Placeholder
    },
    {
        id: 'starex',
        name: 'Hyundai Starex',
        passengers: 7,
        luggage: 4,
        features: ['Spacious Interior', 'AC Vents for Rear', 'Sliding Doors'],
        price: 'Start from 180 SAR',
        category: 'Standard',
        isActive: true,
        image: '/images/fleet/starex.png'
    },
    {
        id: 'staria',
        name: 'Hyundai Staria',
        passengers: 7,
        luggage: 4,
        features: ['Modern Design', 'Panoramic Windows', 'Premium Comfort'],
        price: 'Start from 200 SAR',
        category: 'Premium',
        isActive: true,
        image: '/images/fleet/staria.png'
    },
    {
        id: 'gmc',
        name: 'GMC Yukon',
        passengers: 7,
        luggage: 5,
        features: ['Luxury Leather Seats', 'Premium Sound', 'Extra Legroom'],
        price: 'Start from 350 SAR',
        category: 'VIP',
        isActive: true,
        image: '/images/fleet/gmc.png'
    },
    {
        id: 'hiace',
        name: 'Toyota Hiace',
        passengers: 11,
        luggage: 8,
        features: ['High Roof', 'Individual Seats', 'Ample Luggage Space'],
        price: 'Start from 250 SAR',
        category: 'Standard',
        isActive: true,
        image: '/images/fleet/hiace.png'
    },
    {
        id: 'coaster',
        name: 'Toyota Coaster',
        passengers: 21,
        luggage: 15,
        features: ['Microphone System', 'Curtains', 'Reclining Seats'],
        price: 'Start from 400 SAR',
        category: 'Standard',
        isActive: true,
        image: '/images/fleet/coaster.png'
    },
]

const ROUTES = [
    {
        id: 'jed-mak',
        origin: 'Jeddah Airport',
        destination: 'Makkah Hotel',
        distance: '100 km',
        duration: '1 hr 30 min',
        baseRate: 200,
        customRates: { hiace: 350, gmc: 500, starex: 300, staria: 300, coaster: 550 }
    },
    {
        id: 'jed-mad',
        origin: 'Jeddah Airport',
        destination: 'Madinah Hotel',
        distance: '400 km',
        duration: '4 hrs',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 1000, starex: 450, staria: 500, coaster: 1100 }
    },
    {
        id: 'mak-mad',
        origin: 'Makkah Hotel',
        destination: 'Madinah Hotel',
        distance: '450 km',
        duration: '4 hrs 30 min',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 900, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'mad-mak',
        origin: 'Madinah Hotel',
        destination: 'Makkah Hotel',
        distance: '450 km',
        duration: '4 hrs 30 min',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 900, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'mak-jed',
        origin: 'Makkah Hotel',
        destination: 'Jeddah Airport',
        distance: '100 km',
        duration: '1 hr 30 min',
        baseRate: 200,
        customRates: { hiace: 350, gmc: 500, starex: 300, staria: 300, coaster: 550 }
    },
    {
        id: 'mad-airport',
        origin: 'Madinah Airport',
        destination: 'Madinah Hotel',
        distance: '20 km',
        duration: '25 min',
        baseRate: 150,
        customRates: { hiace: 250, gmc: 300, starex: 200, staria: 250, coaster: 400 }
    },
    {
        id: 'jed-train',
        origin: 'Jeddah Airport',
        destination: 'Jeddah Train Station',
        distance: '20 km',
        duration: '30 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },
    {
        id: 'mak-train',
        origin: 'Makkah Hotel',
        destination: 'Makkah Train Station',
        distance: '15 km',
        duration: '25 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },
    {
        id: 'mad-train',
        origin: 'Madinah Hotel',
        destination: 'Madinah Train Station',
        distance: '15 km',
        duration: '25 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },
    {
        id: 'ziarat-mak',
        origin: 'Makkah',
        destination: 'Ziarat (Half Day)',
        distance: '40 km',
        duration: '3-4 hrs',
        baseRate: 200,
        customRates: { hiace: 300, gmc: 400, starex: 250, staria: 250, coaster: 500 }
    },
    {
        id: 'ziarat-mad',
        origin: 'Madinah',
        destination: 'Ziarat (Half Day)',
        distance: '40 km',
        duration: '3-4 hrs',
        baseRate: 200,
        customRates: { hiace: 250, gmc: 400, starex: 200, staria: 200, coaster: 500 }
    },
    {
        id: 'taif-tour',
        origin: 'Makkah',
        destination: 'Taif (Return)',
        distance: '180 km',
        duration: '8-10 hrs',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 800, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'jed-taif',
        origin: 'Jeddah',
        destination: 'Taif (Return)',
        distance: '350 km',
        duration: '10-12 hrs',
        baseRate: 500,
        customRates: { hiace: 700, gmc: 1000, starex: 600, staria: 600, coaster: 1000 }
    },
    {
        id: 'badar-ziarat',
        origin: 'Madinah',
        destination: 'Badar Ziarat (Full Day)',
        distance: '300 km',
        duration: '6-8 hrs',
        baseRate: 700,
        customRates: {}
    },
    {
        id: 'hourly',
        origin: 'Hourly Rental',
        destination: 'Per Hour',
        distance: '-',
        duration: '1 Hour',
        baseRate: 80,
        customRates: { hiace: 120, gmc: 140, starex: 100, staria: 100, coaster: 250 }
    },
]

async function main() {
    console.log('Start seeding...')

    // Seed Vehicles
    for (const vehicle of VEHICLES) {
        await prisma.vehicle.upsert({
            where: { id: vehicle.id },
            update: {
                image: vehicle.image,
            },
            create: {
                id: vehicle.id,
                name: vehicle.name,
                image: vehicle.image,
                passengers: vehicle.passengers,
                luggage: vehicle.luggage,
                features: vehicle.features,
                price: vehicle.price,
                category: vehicle.category,
                isActive: vehicle.isActive,
            }
        })
    }
    console.log(`Seeded ${VEHICLES.length} vehicles.`)

    // Seed Routes and Prices
    for (const route of ROUTES) {
        const createdRoute = await prisma.route.upsert({
            where: { id: route.id },
            update: {},
            create: {
                id: route.id,
                origin: route.origin,
                destination: route.destination,
                distance: route.distance,
                duration: route.duration,
            }
        })

        // Create default price (base rate) for all vehicles if not custom
        for (const vehicle of VEHICLES) {
            const price = route.customRates[vehicle.id as keyof typeof route.customRates] || route.baseRate

            await prisma.routePrice.upsert({
                where: {
                    routeId_vehicleId: {
                        routeId: createdRoute.id,
                        vehicleId: vehicle.id
                    }
                },
                update: { price: Number(price) },
                create: {
                    routeId: createdRoute.id,
                    vehicleId: vehicle.id,
                    price: Number(price)
                }
            })
        }
    }
    console.log(`Seeded ${ROUTES.length} routes and their prices.`)

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
