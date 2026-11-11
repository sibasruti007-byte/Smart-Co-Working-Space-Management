"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const client_1 = require("@prisma/client");
const argon2_1 = __importDefault(require("argon2"));
const prisma = new client_1.PrismaClient();
const CITIES = [
    {
        name: 'New York',
        state: 'NY',
        postalCodePrefix: '100',
        lat: 40.7128,
        lng: -74.006,
        districts: ['Manhattan', 'Brooklyn Tech Triangle', 'Flatiron District', 'SoHo', 'DUMBO', 'Hudson Yards'],
    },
    {
        name: 'San Francisco',
        state: 'CA',
        postalCodePrefix: '941',
        lat: 37.7749,
        lng: -122.4194,
        districts: ['SoMa', 'Financial District', 'Mission Bay', 'Potrero Hill', 'Presidio', 'Jackson Square'],
    },
    {
        name: 'London',
        state: 'Greater London',
        postalCodePrefix: 'EC2',
        lat: 51.5074,
        lng: -0.1278,
        districts: ['Shoreditch', 'Canary Wharf', 'King’s Cross', 'Soho', 'Fitzrovia', 'City of London'],
    },
    {
        name: 'Berlin',
        state: 'Berlin',
        postalCodePrefix: '101',
        lat: 52.52,
        lng: 13.405,
        districts: ['Mitte', 'Kreuzberg', 'Prenzlauer Berg', 'Friedrichshain', 'Charlottenburg'],
    },
    {
        name: 'Singapore',
        state: 'Central Region',
        postalCodePrefix: '048',
        lat: 1.3521,
        lng: 103.8198,
        districts: ['Marina Bay Financial Centre', 'Tanjong Pagar', 'Raffles Place', 'Orchard', 'One-North'],
    },
];
const AMENITIES_CATALOG = [
    { slug: 'wifi', name: 'Gigabit Wi-Fi 6', category: 'Connectivity', icon: 'Wifi' },
    { slug: 'power_backup', name: '100% Power Backup', category: 'Utilities', icon: 'Zap' },
    { slug: 'air_conditioning', name: 'Central Air Conditioning', category: 'Comfort', icon: 'Wind' },
    { slug: 'ergonomic_chairs', name: 'Herman Miller Ergonomic Chairs', category: 'Furniture', icon: 'Armchair' },
    { slug: 'standing_desk', name: 'Motorized Standing Desks', category: 'Furniture', icon: 'ArrowUpDown' },
    { slug: 'monitors_4k', name: 'Dual 4K UltraSharp Displays', category: 'Hardware', icon: 'Monitor' },
    { slug: 'meeting_room', name: 'High-Tech Meeting Rooms', category: 'Spaces', icon: 'Users' },
    { slug: 'phone_booth', name: 'Soundproof Acoustic Phone Booths', category: 'Spaces', icon: 'PhoneCall' },
    { slug: 'cafeteria', name: 'Artisan Cafeteria & Espresso Bar', category: 'Dining', icon: 'Coffee' },
    { slug: 'parking', name: 'Reserved Covered Parking & EV Charging', category: 'Transport', icon: 'Car' },
    { slug: 'security_24_7', name: '24/7 Biometric Turnstiles & CCTV', category: 'Security', icon: 'ShieldCheck' },
    { slug: 'printer_scanner', name: 'Commercial Laser Printer & Scanner', category: 'Office', icon: 'Printer' },
    { slug: 'event_space', name: 'Community Town Hall & Event Space', category: 'Community', icon: 'Sparkles' },
    { slug: 'lockers', name: 'Digital Keypad Lockers', category: 'Storage', icon: 'Lock' },
    { slug: 'pet_friendly', name: 'Pet Friendly Campus', category: 'Lifestyle', icon: 'Heart' },
];
const WORKSPACE_IMAGES = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
];
const NAME_PREFIXES = ['Nexus', 'Apex', 'UrbanTech', 'Vanguard', 'Catalyst', 'Hyperion', 'Foundry', 'Elevate', 'Synapse', 'Quantum'];
const NAME_SUFFIXES = ['Hub', 'Studio', 'Workspace', 'Lab', 'Commons', 'Suites', 'Sanctuary', 'Tower', 'Bay', 'Exchange'];
async function main() {
    console.log('🌱 Starting database seed for SmartSpace...');
    // 1. Seed Amenities
    console.log('Seeding standard amenities...');
    const amenityMap = new Map();
    for (const amen of AMENITIES_CATALOG) {
        const record = await prisma.amenity.upsert({
            where: { slug: amen.slug },
            update: { name: amen.name, category: amen.category, icon: amen.icon },
            create: { slug: amen.slug, name: amen.name, category: amen.category, icon: amen.icon },
        });
        amenityMap.set(amen.slug, record.id);
    }
    // 2. Hash default password
    const defaultPasswordHash = await argon2_1.default.hash('SmartSpace2026!');
    // 3. Seed Admin
    console.log('Seeding administrator...');
    const admin = await prisma.user.upsert({
        where: { email: 'admin@smartspace.io' },
        update: {},
        create: {
            email: 'admin@smartspace.io',
            fullName: 'Chief Administrator',
            passwordHash: defaultPasswordHash,
            role: client_1.UserRole.ADMIN,
            isVerified: true,
            phone: '+1-555-0100',
        },
    });
    // 4. Seed Space Owners
    console.log('Seeding space owners...');
    const owners = [];
    const ownerConfigs = [
        { email: 'owner1@wecreate.com', name: 'Marcus Sterling', phone: '+1-555-0101' },
        { email: 'owner2@urbanhive.com', name: 'Elena Rostova', phone: '+1-555-0102' },
        { email: 'owner3@berlinoffices.de', name: 'Klaus Reinhardt', phone: '+49-30-555-0103' },
        { email: 'owner4@londonspace.co.uk', name: 'Victoria Cavendish', phone: '+44-20-555-0104' },
        { email: 'owner5@sgworkspaces.sg', name: 'Wei Zhang', phone: '+65-6555-0105' },
    ];
    for (const oc of ownerConfigs) {
        const owner = await prisma.user.upsert({
            where: { email: oc.email },
            update: {},
            create: {
                email: oc.email,
                fullName: oc.name,
                passwordHash: defaultPasswordHash,
                role: client_1.UserRole.SPACE_OWNER,
                isVerified: true,
                phone: oc.phone,
            },
        });
        owners.push(owner);
    }
    // 5. Seed Regular Users
    console.log('Seeding standard users...');
    const users = [];
    const userConfigs = [
        { email: 'alice@fintech.io', name: 'Alice Cooper', city: 'New York', teamSize: 8, budgetMax: 60 },
        { email: 'bob@cloudops.dev', name: 'Bob Jenkins', city: 'San Francisco', teamSize: 4, budgetMax: 45 },
        { email: 'carol@designcraft.co', name: 'Carol Danvers', city: 'London', teamSize: 2, budgetMax: 35 },
        { email: 'david@aiagents.ai', name: 'David Kim', city: 'Berlin', teamSize: 12, budgetMax: 80 },
        { email: 'emma@biomed.sg', name: 'Emma Watson', city: 'Singapore', teamSize: 6, budgetMax: 55 },
    ];
    for (const uc of userConfigs) {
        const user = await prisma.user.upsert({
            where: { email: uc.email },
            update: {},
            create: {
                email: uc.email,
                fullName: uc.name,
                passwordHash: defaultPasswordHash,
                role: client_1.UserRole.USER,
                isVerified: true,
                userPreference: {
                    create: {
                        teamSize: uc.teamSize,
                        workStyle: 'COLLABORATIVE',
                        budgetMin: 15,
                        budgetMax: uc.budgetMax,
                        preferredCity: uc.city,
                        optInSimilarTeams: true,
                        expectations: {
                            highSpeedWifi: true,
                            standingDesks: true,
                            coffeeBar: true,
                        },
                    },
                },
            },
        });
        users.push(user);
    }
    // 6. Seed 200 Spaces (40 spaces per city across 5 cities)
    console.log('Seeding 200 diverse workspaces across 5 global tech hubs...');
    const workspaceTypes = [
        client_1.WorkspaceType.PRIVATE_CABIN,
        client_1.WorkspaceType.SHARED_DESK,
        client_1.WorkspaceType.MEETING_ROOM,
        client_1.WorkspaceType.DEDICATED_DESK,
    ];
    const amenitySlugs = Array.from(amenityMap.keys());
    let spaceIndex = 0;
    for (const city of CITIES) {
        for (let i = 0; i < 40; i++) {
            spaceIndex++;
            const prefix = NAME_PREFIXES[spaceIndex % NAME_PREFIXES.length];
            const suffix = NAME_SUFFIXES[(spaceIndex + i) % NAME_SUFFIXES.length];
            const district = city.districts[i % city.districts.length];
            const type = workspaceTypes[i % workspaceTypes.length];
            const owner = owners[spaceIndex % owners.length];
            // Jitter coordinates within ~5-10km of city center
            const latOffset = (Math.sin(spaceIndex) * 0.045);
            const lngOffset = (Math.cos(spaceIndex) * 0.055);
            const latitude = +(city.lat + latOffset).toFixed(6);
            const longitude = +(city.lng + lngOffset).toFixed(6);
            // Sizing & Pricing
            const seatingCapacity = type === client_1.WorkspaceType.SHARED_DESK ? 1 : type === client_1.WorkspaceType.DEDICATED_DESK ? 1 : (4 + (i % 8) * 4);
            const areaSqFt = seatingCapacity * 65 + 100;
            const pricePerHour = +(18 + (i % 7) * 8 + (type === client_1.WorkspaceType.PRIVATE_CABIN ? 20 : 0)).toFixed(2);
            const pricePerDay = +(pricePerHour * 7).toFixed(2);
            const pricePerMonth = +(pricePerDay * 20).toFixed(2);
            const title = `${prefix} ${suffix} - ${district}`;
            const slug = `${prefix.toLowerCase()}-${suffix.toLowerCase()}-${city.name.toLowerCase().replace(/\s+/g, '-')}-${spaceIndex}`;
            // 4-8 randomized amenities per space
            const numAmenities = 4 + (spaceIndex % 7);
            const selectedAmenitySlugs = amenitySlugs.slice(0, numAmenities);
            const rating = +(4.0 + (spaceIndex % 10) * 0.1).toFixed(1);
            const reviewCount = 5 + (spaceIndex % 45);
            const createdSpace = await prisma.workspace.upsert({
                where: { slug },
                update: {},
                create: {
                    ownerId: owner.id,
                    title,
                    slug,
                    description: `Premier modern workspace located in the vibrant ${district} district of ${city.name}. Featuring high-speed internet, ergonomic workstations, intelligent environmental telemetry, sound isolation, and direct public transit connectivity. Ideal for remote teams and scaling enterprises.`,
                    type,
                    status: client_1.WorkspaceStatus.APPROVED,
                    areaSqFt,
                    seatingCapacity,
                    pricePerHour,
                    pricePerDay,
                    pricePerMonth,
                    address: `${100 + i * 4} Innovation Blvd, Suite ${200 + i}`,
                    city: city.name,
                    state: city.state,
                    postalCode: `${city.postalCodePrefix}${10 + (i % 80)}`,
                    latitude,
                    longitude,
                    operatingHours: {
                        monday: { open: '08:00', close: '21:00' },
                        tuesday: { open: '08:00', close: '21:00' },
                        wednesday: { open: '08:00', close: '21:00' },
                        thursday: { open: '08:00', close: '21:00' },
                        friday: { open: '08:00', close: '20:00' },
                        saturday: { open: '09:00', close: '18:00' },
                        sunday: { open: '10:00', close: '16:00' },
                    },
                    rules: ['Quiet calls in phone booths only', 'Guest check-in required at turnstile', 'No open smoking/vaping'],
                    averageRating: rating,
                    reviewCount,
                    currentOccupancy: Math.floor(seatingCapacity * 0.4),
                    images: {
                        create: [
                            {
                                url: WORKSPACE_IMAGES[spaceIndex % WORKSPACE_IMAGES.length],
                                alt: `${title} main interior`,
                                displayOrder: 0,
                                isPrimary: true,
                            },
                            {
                                url: WORKSPACE_IMAGES[(spaceIndex + 1) % WORKSPACE_IMAGES.length],
                                alt: `${title} meeting room`,
                                displayOrder: 1,
                                isPrimary: false,
                            },
                        ],
                    },
                    amenities: {
                        create: selectedAmenitySlugs.map((slug) => ({
                            amenityId: amenityMap.get(slug),
                        })),
                    },
                },
            });
            // Add a sample booking for the first 20 spaces
            if (spaceIndex <= 20) {
                const sampleUser = users[spaceIndex % users.length];
                const now = new Date();
                const start = new Date(now.getTime() + (spaceIndex * 3600000));
                const end = new Date(start.getTime() + 4 * 3600000);
                await prisma.booking.create({
                    data: {
                        workspaceId: createdSpace.id,
                        userId: sampleUser.id,
                        status: client_1.BookingStatus.CONFIRMED,
                        startTime: start,
                        endTime: end,
                        attendeeCount: Math.min(createdSpace.seatingCapacity, 4),
                        totalPrice: createdSpace.pricePerHour * 4,
                        hourlyRate: createdSpace.pricePerHour,
                    },
                });
            }
        }
    }
    console.log(`✅ Seed successfully completed! 200 workspaces, 5 owners, 5 users, and admin created.`);
}
main()
    .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map