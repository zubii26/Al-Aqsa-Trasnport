const fs = require('fs');

const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

// 1. Add Legs state and helper functions
const stateAnchor = 'const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);';
const newState = `const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [legs, setLegs] = useState([{
        id: '1',
        routeId: '',
        pickup: '',
        dropoff: '',
        date: null as Date | null,
        time: null as Date | null,
        customRoute: null as any
    }]);

    const addLeg = () => {
        setLegs(prev => [...prev, {
            id: Date.now().toString(),
            routeId: '',
            pickup: prev[prev.length - 1]?.dropoff || '',
            dropoff: '',
            date: null,
            time: null,
            customRoute: null
        }]);
    };

    const removeLeg = (id: string) => {
        if (legs.length > 1) {
            setLegs(prev => prev.filter(l => l.id !== id));
        }
    };

    const updateLeg = (id: string, field: string, value: any) => {
        setLegs(prev => prev.map(l => {
            if (l.id === id) {
                const newLeg = { ...l, [field]: value };
                // Also update bookingData for backward compatibility of the first leg
                if (prev[0].id === id) {
                    setBookingData(curr => ({ ...curr, [field]: value }));
                }
                return newLeg;
            }
            return l;
        }));
    };
`;
code = code.replace(stateAnchor, newState);

// 2. Modify getPriceDetails to sum across all legs
const priceFnAnchor = `const getPriceDetails = useCallback((routeId: string, vehicleId: string) => {`;
const newPriceFn = `const getPriceDetails = useCallback((_ignoredRouteId: string, vehicleId: string) => {
        // Calculate sum across ALL legs
        let totalOriginal = 0;
        let totalDiscount = 0;
        let totalPrice = 0;
        let discountType: 'percentage' | 'fixed' | undefined = undefined;

        legs.forEach(leg => {
            const rId = leg.routeId;
            if (!rId) return;

            let legBasePrice = 0;
            if (rId === 'custom' && leg.customRoute) {
                const baseFare = settings.customRoute?.baseFare ?? 50;
                const kmRate = settings.customRoute?.kmRate ?? 3;
                const minFare = settings.customRoute?.minFare ?? 50;
                const distance = leg.customRoute.distanceKm ?? 0;
                const defaultVehicle = vehicles.find(v => v.id === vehicleId);
                const multiplier = defaultVehicle?.multiplier ?? 1;
                legBasePrice = Math.max(minFare, baseFare + distance * kmRate) * multiplier;
            } else {
                const route = routes.find(r => r.id === rId);
                if (route) {
                    const priceEntry = route.prices?.find(p => p.vehicleId === vehicleId);
                    if (priceEntry) legBasePrice = priceEntry.price;
                }
            }

            if (legBasePrice > 0) {
                const { price, originalPrice, discountApplied, discountType: dt } = calculateFinalPrice(legBasePrice, settings.discount);
                totalOriginal += originalPrice || price;
                totalDiscount += discountApplied;
                totalPrice += price;
                discountType = dt;
            }
        });

        return {
            originalPrice: totalOriginal,
            discountApplied: totalDiscount,
            price: totalPrice,
            discountType
        };
    }, [legs, routes, vehicles, settings]);
    
    const old_getPriceDetails = useCallback((routeId: string, vehicleId: string) => {`;
code = code.replace(priceFnAnchor, newPriceFn);


fs.writeFileSync(filePath, code, 'utf-8');
console.log('Phase 1 Patch complete');
