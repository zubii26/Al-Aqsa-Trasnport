import re

with open("src/app/(public)/booking/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add legs state
content = content.replace(
    "const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);",
    """const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
    const [legs, setLegs] = useState([{
        id: '1',
        routeId: '',
        pickup: '',
        dropoff: '',
        date: null as Date | null,
        time: null as Date | null,
        customRoute: null as any
    }]);"""
)

with open("src/app/(public)/booking/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied.")
