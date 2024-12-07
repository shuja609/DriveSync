require('dotenv').config();
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const generateVIN = () => {
    const chars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
    let vin = '';
    for (let i = 0; i < 17; i++) {
        vin += chars[Math.floor(Math.random() * chars.length)];
    }
    return vin;
};

const addTestVehicles = async () => {
    try {
        await connectDB();

        // Find an admin user to set as creator
        const adminUser = await User.findOne({ role: 'admin' });

        if (!adminUser) {
            console.error('No admin user found. Please create an admin user first.');
            process.exit(1);
        }

        console.log('Using admin user:', adminUser.email);

        // Test vehicles data
        const testVehicles = [
            {
                title: 'Tesla Model S Plaid',
                brand: 'Tesla',
                model: 'Model S',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Pearl White Multi-Coat',
                    hexCode: '#FFFFFF'
                },
                interiorColor: {
                    name: 'Black',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'TS24001',
                description: {
                    short: 'Experience the future of electric vehicles with the Tesla Model S Plaid.',
                    full: 'The Tesla Model S Plaid is the highest performing sedan ever built. With the lowest drag coefficient on Earth and unmatched performance and range, Model S Plaid is built for speed, endurance and range.'
                },
                specifications: {
                    engine: {
                        type: 'Electric',
                        power: '1,020 hp',
                        transmission: 'Single-Speed',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '1.99s 0-60 mph',
                        topSpeed: '200 mph',
                        fuelEconomy: {
                            city: 'N/A',
                            highway: 'N/A',
                            combined: '396 miles range'
                        }
                    },
                    dimensions: {
                        length: 4970,
                        width: 1964,
                        height: 1445,
                        wheelbase: 2960,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['Glass Roof', 'Power Folding Mirrors', 'LED Headlights'],
                        interior: ['17" Cinematic Display', 'Heated Seats', 'Premium Audio'],
                        safety: ['Autopilot', 'Full Self-Driving Capability', 'Active Safety Features'],
                        technology: ['Wireless Charging', 'Premium Connectivity', 'Gaming Computer'],
                        comfort: ['Tri-Zone Climate Control', 'HEPA Air Filtration', 'Acoustic Glass']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 129990,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 1299,
                        downPayment: 5000,
                        mileageLimit: 12000
                    }],
                    financingOptions: [{
                        duration: 72,
                        apr: 2.99,
                        monthlyPayment: 1899,
                        downPayment: 10000
                    }]
                },
                category: ['Luxury', 'Electric', 'Sedan'],
                tags: ['Electric', 'Performance', 'Luxury', 'Tech'],
                highlights: [
                    '1,020 Horsepower',
                    '396 Mile Range',
                    'Full Self-Driving Capability',
                    'Premium Interior'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '4 years/50,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '123 Auto Drive',
                        city: 'San Francisco',
                        state: 'CA',
                        zipCode: '94105',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'BMW M5 Competition',
                brand: 'BMW',
                model: 'M5',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Marina Bay Blue Metallic',
                    hexCode: '#0066B1'
                },
                interiorColor: {
                    name: 'Silverstone Merino Leather',
                    hexCode: '#E5E4E2'
                },
                vin: generateVIN(),
                stockNumber: 'BM24001',
                description: {
                    short: 'The ultimate expression of luxury and performance.',
                    full: 'The BMW M5 Competition blends luxury and high-performance in perfect harmony. With its powerful engine, sophisticated technology, and premium features, it delivers an unmatched driving experience.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '4.4L',
                        power: '617 hp @ 6000 rpm',
                        torque: '553 lb-ft @ 1800-5860 rpm',
                        transmission: 'Automatic',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '3.2s 0-60 mph',
                        topSpeed: '190 mph',
                        fuelEconomy: {
                            city: '15 mpg',
                            highway: '21 mpg',
                            combined: '17 mpg'
                        }
                    },
                    dimensions: {
                        length: 4965,
                        width: 1903,
                        height: 1473,
                        wheelbase: 2982,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['M Sport Exhaust', 'Adaptive LED Headlights', '20" M Wheels'],
                        interior: ['M Multifunction Seats', 'Extended Merino Leather', 'M Steering Wheel'],
                        safety: ['Active Protection', 'Driving Assistant Professional', 'Parking Assistant Plus'],
                        technology: ['BMW Live Cockpit Professional', 'Harman Kardon Surround Sound', 'Gesture Control'],
                        comfort: ['4-Zone Climate Control', 'Heated/Ventilated Seats', 'Ambient Lighting']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 139900,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 1499,
                        downPayment: 5000,
                        mileageLimit: 10000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.49,
                        monthlyPayment: 2499,
                        downPayment: 15000
                    }]
                },
                category: ['Luxury', 'Sports', 'Sedan'],
                tags: ['Performance', 'Luxury', 'German Engineering', 'Sport Sedan'],
                highlights: [
                    '617 Horsepower Twin-Turbo V8',
                    'M xDrive All-Wheel Drive',
                    'Carbon Fiber Roof',
                    'Competition Package'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '4 years/50,000 miles',
                    coverage: 'Bumper to Bumper'
                },
                location: {
                    address: {
                        street: '456 Luxury Lane',
                        city: 'Los Angeles',
                        state: 'CA',
                        zipCode: '90001',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Porsche 911 GT3 RS',
                brand: 'Porsche',
                model: '911',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'GT Silver Metallic',
                    hexCode: '#C0C0C0'
                },
                interiorColor: {
                    name: 'Black/Red',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'P24001',
                description: {
                    short: 'The pinnacle of Porsche performance engineering.',
                    full: 'The 911 GT3 RS is the most extreme expression of Porsches commitment to performance. With its naturally aspirated engine, advanced aerodynamics, and track-focused design, it represents the pinnacle of sports car engineering.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '4.0L',
                        power: '518 hp @ 8400 rpm',
                        torque: '346 lb-ft @ 6250 rpm',
                        transmission: 'DCT',
                        drivetrain: 'RWD'
                    },
                    performance: {
                        acceleration: '3.0s 0-60 mph',
                        topSpeed: '184 mph',
                        fuelEconomy: {
                            city: '15 mpg',
                            highway: '18 mpg',
                            combined: '16 mpg'
                        }
                    },
                    dimensions: {
                        length: 4557,
                        width: 1852,
                        height: 1277,
                        wheelbase: 2457,
                        seatingCapacity: 2
                    },
                    features: {
                        exterior: ['Active Aerodynamics', 'Carbon Fiber Components', 'Center Lock Wheels'],
                        interior: ['Full Bucket Seats', 'Alcantara Trim', 'Roll Cage'],
                        safety: ['Ceramic Composite Brakes', 'Stability Management', 'Tire Pressure Monitoring'],
                        technology: ['Track Precision App', 'Sport Chrono Package', 'Dynamic Engine Mounts'],
                        comfort: ['Air Conditioning', 'Sound System', 'Navigation']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 249900,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 2999,
                        downPayment: 25000,
                        mileageLimit: 5000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 4.99,
                        monthlyPayment: 4299,
                        downPayment: 50000
                    }]
                },
                category: ['Sports', 'Luxury'],
                tags: ['Track Ready', 'Performance', 'Limited Edition', 'Collectible'],
                highlights: [
                    '518 Horsepower Naturally Aspirated Engine',
                    'Advanced Aerodynamics Package',
                    'Track-Focused Suspension',
                    'Lightweight Construction'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '4 years/50,000 miles',
                    coverage: 'Limited Warranty'
                },
                location: {
                    address: {
                        street: '789 Performance Drive',
                        city: 'Miami',
                        state: 'FL',
                        zipCode: '33101',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Transit',
                    expectedDate: new Date('2024-04-15')
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Audi Q8',
                brand: 'Audi',
                model: 'Q8',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Mythos Black',
                    hexCode: '#000000'
                },
                interiorColor: {
                    name: 'Black',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'AU24001',
                description: {
                    short: 'Luxury SUV with cutting-edge technology.',
                    full: 'The Audi Q8 combines luxury and performance with a spacious interior and advanced technology features.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '3.0L',
                        power: '335 hp',
                        transmission: 'Automatic',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '5.6s 0-60 mph',
                        topSpeed: '155 mph',
                        fuelEconomy: {
                            city: '17 mpg',
                            highway: '22 mpg',
                            combined: '19 mpg'
                        }
                    },
                    dimensions: {
                        length: 4986,
                        width: 1995,
                        height: 1700,
                        wheelbase: 2995,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Panoramic Sunroof', 'Power Tailgate'],
                        interior: ['Virtual Cockpit', 'Heated Seats', 'Bang & Olufsen Sound System'],
                        safety: ['Adaptive Cruise Control', 'Lane Departure Warning', '360-Degree Camera'],
                        technology: ['Apple CarPlay', 'Android Auto', 'Navigation System'],
                        comfort: ['Four-Zone Climate Control', 'Massage Seats', 'Ambient Lighting']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1581281280000-1c1e1e1e1e1e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 74900,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 799,
                        downPayment: 5000,
                        mileageLimit: 10000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.99,
                        monthlyPayment: 1299,
                        downPayment: 10000
                    }]
                },
                category: ['Luxury', 'SUV'],
                tags: ['Luxury', 'Performance', 'SUV'],
                highlights: [
                    '335 Horsepower',
                    'Advanced Technology',
                    'Spacious Interior',
                    'Luxury Features'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '4 years/50,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '321 Luxury Blvd',
                        city: 'New York',
                        state: 'NY',
                        zipCode: '10001',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Ford Mustang Mach-E',
                brand: 'Ford',
                model: 'Mustang Mach-E',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Shadow Black',
                    hexCode: '#101820'
                },
                interiorColor: {
                    name: 'Black',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'FM24001',
                description: {
                    short: 'All-electric SUV with Mustang performance.',
                    full: 'The Ford Mustang Mach-E combines the iconic Mustang performance with the practicality of an SUV, offering an exhilarating driving experience with zero emissions.'
                },
                specifications: {
                    engine: {
                        type: 'Electric',
                        power: '480 hp',
                        transmission: 'Single-Speed',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '3.5s 0-60 mph',
                        topSpeed: '130 mph',
                        fuelEconomy: {
                            city: '100 MPGe',
                            highway: '90 MPGe',
                            combined: '95 MPGe'
                        }
                    },
                    dimensions: {
                        length: 4724,
                        width: 1881,
                        height: 1625,
                        wheelbase: 2971,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Panoramic Roof', 'Power Liftgate'],
                        interior: ['12" Touchscreen', 'Heated Seats', 'B&O Sound System'],
                        safety: ['Ford Co-Pilot360', 'Adaptive Cruise Control', 'Lane Keeping Assist'],
                        technology: ['FordPass Connect', 'Wireless Charging', 'Navigation System'],
                        comfort: ['Dual-Zone Climate Control', 'Ambient Lighting', 'Spacious Cargo Area']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 59995,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 599,
                        downPayment: 5000,
                        mileageLimit: 10000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.99,
                        monthlyPayment: 1099,
                        downPayment: 10000
                    }]
                },
                category: ['Electric', 'SUV'],
                tags: ['Electric', 'Performance', 'SUV'],
                highlights: [
                    '480 Horsepower',
                    'All-Wheel Drive',
                    'Zero to Sixty in 3.5 Seconds',
                    'Iconic Mustang Design'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '123 Electric Ave',
                        city: 'Detroit',
                        state: 'MI',
                        zipCode: '48201',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Chevrolet Corvette Stingray',
                brand: 'Chevrolet',
                model: 'Corvette',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Torch Red',
                    hexCode: '#C8102E'
                },
                interiorColor: {
                    name: 'Adrenaline Red',
                    hexCode: '#C8102E'
                },
                vin: generateVIN(),
                stockNumber: 'CV24001',
                description: {
                    short: 'The ultimate American sports car.',
                    full: 'The Chevrolet Corvette Stingray offers a mid-engine layout, stunning performance, and cutting-edge technology, making it a true icon of American engineering.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '6.2L V8',
                        power: '495 hp',
                        torque: '470 lb-ft',
                        transmission: '8-Speed Dual-Clutch',
                        drivetrain: 'RWD'
                    },
                    performance: {
                        acceleration: '2.9s 0-60 mph',
                        topSpeed: '194 mph',
                        fuelEconomy: {
                            city: '15 mpg',
                            highway: '27 mpg',
                            combined: '20 mpg'
                        }
                    },
                    dimensions: {
                        length: 4636,
                        width: 1940,
                        height: 1234,
                        wheelbase: 2711,
                        seatingCapacity: 2
                    },
                    features: {
                        exterior: ['LED Headlights', 'Carbon Fiber Components', 'Magnetic Ride Control'],
                        interior: ['GT1 Seats', 'Bose Performance Audio', '8" Touchscreen'],
                        safety: ['Rear Camera Mirror', 'Performance Traction Management', 'Front Lift Adjustable Height'],
                        technology: ['Apple CarPlay', 'Android Auto', 'Wi-Fi Hotspot'],
                        comfort: ['Dual-Zone Climate Control', 'Heated and Ventilated Seats', 'Customizable Ambient Lighting']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 62995,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 699,
                        downPayment: 5000,
                        mileageLimit: 10000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 4.49,
                        monthlyPayment: 1199,
                        downPayment: 15000
                    }]
                },
                category: ['Sports', 'Luxury'],
                tags: ['Performance', 'Luxury', 'Sports Car'],
                highlights: [
                    '495 Horsepower',
                    'Mid-Engine Design',
                    'Zero to Sixty in 2.9 Seconds',
                    'Iconic American Sports Car'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '456 Sports Car Blvd',
                        city: 'Bowling Green',
                        state: 'KY',
                        zipCode: '42101',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Toyota RAV4',
                brand: 'Toyota',
                model: 'RAV4',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Super White',
                    hexCode: '#FFFFFF'
                },
                interiorColor: {
                    name: 'Black',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'TR24001',
                description: {
                    short: 'Versatile and reliable compact SUV.',
                    full: 'The Toyota RAV4 offers a spacious interior, advanced safety features, and excellent fuel efficiency, making it a perfect choice for families and adventurers alike.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '2.5L',
                        power: '203 hp',
                        transmission: '8-Speed Automatic',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '5.8s 0-60 mph',
                        topSpeed: '120 mph',
                        fuelEconomy: {
                            city: '27 mpg',
                            highway: '35 mpg',
                            combined: '30 mpg'
                        }
                    },
                    dimensions: {
                        length: 4600,
                        width: 1855,
                        height: 1685,
                        wheelbase: 2690,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Roof Rails', 'Power Liftgate'],
                        interior: ['7" Touchscreen', 'Apple CarPlay', 'Android Auto'],
                        safety: ['Toyota Safety Sense', 'Lane Departure Alert', 'Adaptive Cruise Control'],
                        technology: ['Bluetooth Connectivity', 'USB Ports', 'Navigation System'],
                        comfort: ['Dual-Zone Climate Control', 'Heated Seats', 'Spacious Cargo Area']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1581281280000-1c1e1e1e1e1e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 29995,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 299,
                        downPayment: 3000,
                        mileageLimit: 12000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.49,
                        monthlyPayment: 549,
                        downPayment: 5000
                    }]
                },
                category: ['SUV', 'Compact'],
                tags: ['Family', 'SUV', 'Reliable'],
                highlights: [
                    '203 Horsepower',
                    'All-Wheel Drive',
                    'Spacious Interior',
                    'Advanced Safety Features'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '789 Family Rd',
                        city: 'Los Angeles',
                        state: 'CA',
                        zipCode: '90001',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Honda Accord',
                brand: 'Honda',
                model: 'Accord',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Crystal Black Pearl',
                    hexCode: '#000000'
                },
                interiorColor: {
                    name: 'Ivory',
                    hexCode: '#F5F5F0'
                },
                vin: generateVIN(),
                stockNumber: 'HA24001',
                description: {
                    short: 'Stylish and efficient midsize sedan.',
                    full: 'The Honda Accord offers a spacious interior, advanced safety features, and excellent fuel efficiency, making it a top choice for families and commuters.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '1.5L Turbo',
                        power: '192 hp',
                        transmission: 'CVT',
                        drivetrain: 'FWD'
                    },
                    performance: {
                        acceleration: '5.5s 0-60 mph',
                        topSpeed: '130 mph',
                        fuelEconomy: {
                            city: '30 mpg',
                            highway: '38 mpg',
                            combined: '33 mpg'
                        }
                    },
                    dimensions: {
                        length: 1923,
                        width: 1862,
                        height: 1440,
                        wheelbase: 2830,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Sunroof', 'Alloy Wheels'],
                        interior: ['10" Touchscreen', 'Leather Seats', 'Apple CarPlay'],
                        safety: ['Honda Sensing', 'Lane Keeping Assist', 'Adaptive Cruise Control'],
                        technology: ['Bluetooth Connectivity', 'Navigation System', 'Premium Audio'],
                        comfort: ['Dual-Zone Climate Control', 'Heated Seats', 'Spacious Trunk']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1581281280000-1c1e1e1e1e1e',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 26900,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 299,
                        downPayment: 3000,
                        mileageLimit: 12000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.49,
                        monthlyPayment: 499,
                        downPayment: 5000
                    }]
                },
                category: ['Sedan', 'Compact'],
                tags: ['Family', 'Sedan', 'Reliable'],
                highlights: [
                    '192 Horsepower',
                    'Excellent Fuel Economy',
                    'Spacious Interior',
                    'Advanced Safety Features'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '123 Honda Way',
                        city: 'Los Angeles',
                        state: 'CA',
                        zipCode: '90001',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Nissan Rogue',
                brand: 'Nissan',
                model: 'Rogue',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Gun Metallic',
                    hexCode: '#7D7F7D'
                },
                interiorColor: {
                    name: 'Charcoal',
                    hexCode: '#333333'
                },
                vin: generateVIN(),
                stockNumber: 'NR24001',
                description: {
                    short: 'Versatile compact SUV with advanced technology.',
                    full: 'The Nissan Rogue combines style, comfort, and technology, making it a great choice for families and adventurers alike.'
                },
                specifications: {
                    engine: {
                        type: 'Petrol',
                        displacement: '2.5L',
                        power: '181 hp',
                        transmission: 'CVT',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '7.5s 0-60 mph',
                        topSpeed: '125 mph',
                        fuelEconomy: {
                            city: '26 mpg',
                            highway: '33 mpg',
                            combined: '29 mpg'
                        }
                    },
                    dimensions: {
                        length: 1849,
                        width: 1830,
                        height: 1685,
                        wheelbase: 2705,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Roof Rails', 'Power Liftgate'],
                        interior: ['9" Touchscreen', 'Heated Seats', 'Bose Audio System'],
                        safety: ['ProPILOT Assist', 'Blind Spot Warning', 'Rear Cross Traffic Alert'],
                        technology: ['Apple CarPlay', 'Android Auto', 'Navigation System'],
                        comfort: ['Dual-Zone Climate Control', 'Spacious Cargo Area', 'Ambient Lighting']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 28990,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 349,
                        downPayment: 3000,
                        mileageLimit: 12000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 3.99,
                        monthlyPayment: 549,
                        downPayment: 5000
                    }]
                },
                category: ['SUV', 'Compact'],
                tags: ['Family', 'SUV', 'Versatile'],
                highlights: [
                    '181 Horsepower',
                    'Advanced Safety Features',
                    'Spacious Interior',
                    'Great Fuel Economy'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '456 Nissan Ave',
                        city: 'San Francisco',
                        state: 'CA',
                        zipCode: '94105',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            },
            {
                title: 'Volkswagen ID.4',
                brand: 'Volkswagen',
                model: 'ID.4',
                year: 2024,
                condition: 'New',
                exteriorColor: {
                    name: 'Moonstone Gray',
                    hexCode: '#B7B7B7'
                },
                interiorColor: {
                    name: 'Black',
                    hexCode: '#000000'
                },
                vin: generateVIN(),
                stockNumber: 'VW24001',
                description: {
                    short: 'All-electric SUV with spacious interior.',
                    full: 'The Volkswagen ID.4 is an all-electric SUV that combines practicality with advanced technology and a spacious interior.'
                },
                specifications: {
                    engine: {
                        type: 'Electric',
                        power: '201 hp',
                        transmission: 'Single-Speed',
                        drivetrain: 'AWD'
                    },
                    performance: {
                        acceleration: '7.5s 0-60 mph',
                        topSpeed: '99 mph',
                        fuelEconomy: {
                            city: '104 MPGe',
                            highway: '89 MPGe',
                            combined: '97 MPGe'
                        }
                    },
                    dimensions: {
                        length: 4584,
                        width: 1852,
                        height: 1630,
                        wheelbase: 2765,
                        seatingCapacity: 5
                    },
                    features: {
                        exterior: ['LED Headlights', 'Panoramic Sunroof', 'Power Tailgate'],
                        interior: ['10" Touchscreen', 'Heated Seats', 'Premium Audio'],
                        safety: ['Adaptive Cruise Control', 'Blind Spot Monitoring', 'Lane Assist'],
                        technology: ['Wireless Charging', 'Navigation System', 'Voice Control'],
                        comfort: ['Dual-Zone Climate Control', 'Spacious Cargo Area', 'Ambient Lighting']
                    }
                },
                media: [
                    {
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399',
                        isPrimary: true,
                        order: 0
                    }
                ],
                pricing: {
                    basePrice: 39900,
                    leaseOptions: [{
                        duration: 36,
                        monthlyPayment: 399,
                        downPayment: 4000,
                        mileageLimit: 10000
                    }],
                    financingOptions: [{
                        duration: 60,
                        apr: 4.49,
                        monthlyPayment: 699,
                        downPayment: 7000
                    }]
                },
                category: ['Electric', 'SUV'],
                tags: ['Electric', 'SUV', 'Spacious'],
                highlights: [
                    '201 Horsepower',
                    'All-Electric Range of 250 Miles',
                    'Spacious Interior',
                    'Advanced Technology'
                ],
                warranty: {
                    type: 'Basic',
                    duration: '3 years/36,000 miles',
                    coverage: 'Comprehensive'
                },
                location: {
                    address: {
                        street: '789 Volkswagen St',
                        city: 'Seattle',
                        state: 'WA',
                        zipCode: '98101',
                        country: 'USA'
                    }
                },
                availability: {
                    status: 'In Stock'
                },
                metadata: {
                    createdBy: adminUser._id,
                    lastUpdatedBy: adminUser._id
                }
            }
        ];

        // Delete existing vehicles
        await Vehicle.deleteMany({});

        // Insert test vehicles
        const insertedVehicles = await Vehicle.insertMany(testVehicles);

        console.log('Test vehicles data added successfully!');
        console.log('Added vehicles:', insertedVehicles.length);
        console.log('Vehicles created by admin:', adminUser.email);
        process.exit(0);
    } catch (error) {
        console.error('Error adding test vehicles:', error);
        process.exit(1);
    }
};

addTestVehicles();