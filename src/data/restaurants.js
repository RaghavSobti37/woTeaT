// 20 Famous Nashik Restaurants with Dishes and Taste Vectors
// Taste Vector Layout: [Spicy, Sweet, Tangy, CaloricDensity, Traditional]
// Values are from 0.0 to 1.0

export const RESTAURANTS = [
  {
    id: "r1",
    name: "Sadhana Chulivarchi Misal",
    type: "Traditional Veg",
    location: "Bardan Phata",
    rating: 4.8,
    dishes: [
      {
        id: "d1_1",
        name: "Chulivarchi Misal Pav",
        price: 110,
        category: "Misal",
        description: "Smoky misal cooked on wood fire with sprouts, shev, and fresh bread",
        vector: [0.9, 0.1, 0.5, 0.6, 0.9],
        isVeg: true,
        icon: "🌶️"
      },
      {
        id: "d1_2",
        name: "Claypot Solkadhi",
        price: 50,
        category: "Beverage",
        description: "Traditional refreshing drink made from kokum and coconut milk",
        vector: [0.3, 0.2, 0.8, 0.4, 0.9],
        isVeg: true,
        icon: "🥥"
      },
      {
        id: "d1_3",
        name: "Chulivarchi Jalebi",
        price: 60,
        category: "Dessert",
        description: "Hot, crispy jalebis fried in pure ghee over a wood stove",
        vector: [0.0, 1.0, 0.2, 0.8, 0.9],
        isVeg: true,
        icon: "🌀"
      }
    ]
  },
  {
    id: "r2",
    name: "Ambika Misal",
    type: "Traditional Veg",
    location: "Panchavati",
    rating: 4.7,
    dishes: [
      {
        id: "d2_1",
        name: "Kala Masala Misal",
        price: 95,
        category: "Misal",
        description: "Authentic Nashik black masala curry misal, extremely aromatic and spicy",
        vector: [0.95, 0.05, 0.4, 0.6, 0.95],
        isVeg: true,
        icon: "🥣"
      },
      {
        id: "d2_2",
        name: "Spiced Buttermilk (Taak)",
        price: 35,
        category: "Beverage",
        description: "Cooling buttermilk infused with cumin, ginger, and coriander",
        vector: [0.2, 0.1, 0.6, 0.2, 0.9],
        isVeg: true,
        icon: "🥛"
      }
    ]
  },
  {
    id: "r3",
    name: "Shamsundar Misal",
    type: "Traditional Veg",
    location: "Satpur MIDC",
    rating: 4.6,
    dishes: [
      {
        id: "d3_1",
        name: "Satpur Special Spicy Misal",
        price: 100,
        category: "Misal",
        description: "Legendary red-rassa misal, served with dynamic shev mix",
        vector: [0.9, 0.1, 0.4, 0.6, 0.85],
        isVeg: true,
        icon: "🔥"
      },
      {
        id: "d3_2",
        name: "Shev Tomato Sabji",
        price: 120,
        category: "Main Course",
        description: "Spicy tomato gravy loaded with crunchy shev, classic factory-belt lunch",
        vector: [0.8, 0.2, 0.6, 0.7, 0.8],
        isVeg: true,
        icon: "🍅"
      }
    ]
  },
  {
    id: "r4",
    name: "Tushar Misal",
    type: "Traditional Veg",
    location: "College Road",
    rating: 4.5,
    dishes: [
      {
        id: "d4_1",
        name: "College Road Misal Pav",
        price: 90,
        category: "Misal",
        description: "Zesty misal tailored for students, balanced heat with tangy lemon",
        vector: [0.75, 0.15, 0.7, 0.55, 0.75],
        isVeg: true,
        icon: "🍋"
      },
      {
        id: "d4_2",
        name: "Batata Vada (2 Pcs)",
        price: 45,
        category: "Snacks",
        description: "Crispy potato fritters served with green and dry garlic chutney",
        vector: [0.4, 0.1, 0.3, 0.7, 0.85],
        isVeg: true,
        icon: "🥔"
      }
    ]
  },
  {
    id: "r5",
    name: "Mamacha Misal",
    type: "Traditional Veg",
    location: "Makhmalabad",
    rating: 4.4,
    dishes: [
      {
        id: "d5_1",
        name: "Mama's Fire Misal Pav",
        price: 95,
        category: "Misal",
        description: "Unapologetically spicy misal with direct green chili tadka. Enter at your own risk!",
        vector: [1.0, 0.0, 0.3, 0.6, 0.8],
        isVeg: true,
        icon: "🌋"
      },
      {
        id: "d5_2",
        name: "Sweet Thick Lassi",
        price: 55,
        category: "Beverage",
        description: "Thick creamy curd lassi to extinguish the fire from Mamacha's misal",
        vector: [0.0, 0.95, 0.1, 0.7, 0.8],
        isVeg: true,
        icon: "🥛"
      }
    ]
  },
  {
    id: "r6",
    name: "Sayantara Sabudana Vada",
    type: "Traditional Veg",
    location: "Bhadrakali Market",
    rating: 4.8,
    dishes: [
      {
        id: "d6_1",
        name: "Crispy Sabudana Vada (2 Pcs)",
        price: 50,
        category: "Snacks",
        description: "Legendary sago fritters, crispy gold outside, soft inside, sweet-spicy peanut chutney",
        vector: [0.3, 0.4, 0.3, 0.65, 0.95],
        isVeg: true,
        icon: "🟡"
      },
      {
        id: "d6_2",
        name: "Fasting Sabudana Khichdi",
        price: 60,
        category: "Snacks",
        description: "Lightly sautéed sago with green chilies, roasted peanuts, and grated coconut",
        vector: [0.4, 0.2, 0.3, 0.5, 0.95],
        isVeg: true,
        icon: "🍚"
      }
    ]
  },
  {
    id: "r7",
    name: "Shree Krishna Uphaar Gruh",
    type: "Traditional Veg",
    location: "Old Nashik",
    rating: 4.6,
    dishes: [
      {
        id: "d7_1",
        name: "Iconic Wada Pav",
        price: 25,
        category: "Snacks",
        description: "Classic Nashik vada pav with fiery garlic-chili wet thecha smear",
        vector: [0.7, 0.1, 0.4, 0.6, 0.9],
        isVeg: true,
        icon: "🍔"
      },
      {
        id: "d7_2",
        name: "Moong Bhaji Plate",
        price: 50,
        category: "Snacks",
        description: "Fried split-green-gram fritters, crispy and spicy",
        vector: [0.5, 0.1, 0.3, 0.6, 0.85],
        isVeg: true,
        icon: "🧆"
      }
    ]
  },
  {
    id: "r8",
    name: "Shree Rajbhog Thali",
    type: "Traditional Veg",
    location: "Mumbai Naka",
    rating: 4.7,
    dishes: [
      {
        id: "d8_1",
        name: "Maharaja Veg Thali",
        price: 350,
        category: "Thali",
        description: "Royalty on a plate: 4 curries, dal, kadhi, 3 desserts, hot rotis, khichdi, and appetizers",
        vector: [0.4, 0.6, 0.5, 0.95, 0.9],
        isVeg: true,
        icon: "🍱"
      },
      {
        id: "d8_2",
        name: "Kesar Shrikhand Cup",
        price: 80,
        category: "Dessert",
        description: "Velvety strained yogurt sweet flavored with saffron, cardamom, and almond slivers",
        vector: [0.0, 1.0, 0.2, 0.75, 0.9],
        isVeg: true,
        icon: "🟡"
      }
    ]
  },
  {
    id: "r9",
    name: "Shilpa Dining Hall",
    type: "Traditional Veg",
    location: "College Road",
    rating: 4.5,
    dishes: [
      {
        id: "d9_1",
        name: "Maharashtrian Ghadichi Poli Thali",
        price: 260,
        category: "Thali",
        description: "Homestyle thali featuring thin multi-layered rotis, pithla, usal, and dry bhaji",
        vector: [0.5, 0.3, 0.4, 0.75, 0.95],
        isVeg: true,
        icon: "🍛"
      },
      {
        id: "d9_2",
        name: "Ghee Puran Poli (1 Pc)",
        price: 60,
        category: "Dessert",
        description: "Classic sweet flatbread stuffed with chana dal and jaggery, drenched in melted ghee",
        vector: [0.0, 0.95, 0.1, 0.8, 1.0],
        isVeg: true,
        icon: "🫓"
      }
    ]
  },
  {
    id: "r10",
    name: "Purohit Thali",
    type: "Traditional Veg",
    location: "Nashik Road",
    rating: 4.6,
    dishes: [
      {
        id: "d10_1",
        name: "Rajasthani Dal Bati Churma Thali",
        price: 320,
        category: "Thali",
        description: "Authentic Rajasthani hard wheat balls, spiced lentil curry, and sweet crumbled wheat",
        vector: [0.5, 0.5, 0.3, 0.95, 0.9],
        isVeg: true,
        icon: "🥘"
      }
    ]
  },
  {
    id: "r11",
    name: "Divtya Budhlya Wada",
    type: "Traditional Non-Veg",
    location: "Gangapur Road",
    rating: 4.8,
    dishes: [
      {
        id: "d11_1",
        name: "Sajuk Tupatli Mutton Thali",
        price: 420,
        category: "Thali",
        description: "Rich mutton curry cooked in pure ghee, served with pandhra/tambda rassa and bhakri",
        vector: [0.85, 0.1, 0.4, 0.95, 0.9],
        isVeg: false,
        icon: "🍖"
      },
      {
        id: "d11_2",
        name: "Kala Masala Chicken Handi",
        price: 380,
        category: "Mughlai",
        description: "Chicken slow-cooked in charred onion and black spices paste, deeply smoky",
        vector: [0.8, 0.1, 0.4, 0.85, 0.85],
        isVeg: false,
        icon: "🍗"
      },
      {
        id: "d11_3",
        name: "Bajri Bhakri",
        price: 30,
        category: "Bread",
        description: "Rustic hearth-baked pearl millet flatbread, best companion for kala masala",
        vector: [0.1, 0.1, 0.1, 0.5, 0.95],
        isVeg: true,
        icon: "🫓"
      }
    ]
  },
  {
    id: "r12",
    name: "River Dine Restaurant",
    type: "Multicuisine Premium",
    location: "Gangapur Road",
    rating: 4.5,
    dishes: [
      {
        id: "d12_1",
        name: "Paneer Tikka Masala",
        price: 280,
        category: "Main Course",
        description: "Claypot grilled paneer cubes folded in rich tomato-cream gravy",
        vector: [0.5, 0.3, 0.5, 0.8, 0.7],
        isVeg: true,
        icon: "🧀"
      },
      {
        id: "d12_2",
        name: "Gourmet Veg Crispy",
        price: 220,
        category: "Appetizers",
        description: "Crunchy batter-fried baby corn, cauliflower, and carrots tossed in sweet chili soy",
        vector: [0.4, 0.4, 0.6, 0.65, 0.3],
        isVeg: true,
        icon: "🥦"
      }
    ]
  },
  {
    id: "r13",
    name: "Haji Darbar",
    type: "Mughlai Non-Veg",
    location: "Dwarka Circle",
    rating: 4.4,
    dishes: [
      {
        id: "d13_1",
        name: "Special Chicken Dum Biryani",
        price: 260,
        category: "Mughlai",
        description: "Fragrant basmati rice layered with spiced chicken, fried onions, and saffron",
        vector: [0.7, 0.2, 0.3, 0.85, 0.8],
        isVeg: false,
        icon: "🍛"
      },
      {
        id: "d13_2",
        name: "Mutton Seekh Kebab (4 Pcs)",
        price: 280,
        category: "Appetizers",
        description: "Skewered minced mutton blended with herbs and spices, grilled in tandoor",
        vector: [0.75, 0.1, 0.3, 0.75, 0.8],
        isVeg: false,
        icon: "🍢"
      }
    ]
  },
  {
    id: "r14",
    name: "Soma at Sula Vineyards",
    type: "Global Premium",
    location: "Sula Vineyards",
    rating: 4.7,
    dishes: [
      {
        id: "d14_1",
        name: "Rasa Paneer Tikka",
        price: 450,
        category: "Appetizers",
        description: "Premium cottage cheese marinated in local Chenin Blanc and hand-ground spices",
        vector: [0.5, 0.3, 0.6, 0.75, 0.5],
        isVeg: true,
        icon: "🧀"
      },
      {
        id: "d14_2",
        name: "Vineyard Green Salad",
        price: 320,
        category: "Salad",
        description: "Organic greens, feta, olives, and fresh grapes dressed with honey wine vinaigrette",
        vector: [0.1, 0.3, 0.8, 0.3, 0.2],
        isVeg: true,
        icon: "🥗"
      }
    ]
  },
  {
    id: "r15",
    name: "Little Italy at Sula",
    type: "Italian Premium",
    location: "Sula Vineyards",
    rating: 4.6,
    dishes: [
      {
        id: "d15_1",
        name: "Wood-Fired Margherita Pizza",
        price: 480,
        category: "Italian",
        description: "Artisanal dough topped with fresh tomato sauce, fresh mozzarella, and garden basil",
        vector: [0.1, 0.2, 0.5, 0.75, 0.2],
        isVeg: true,
        icon: "🍕"
      },
      {
        id: "d15_2",
        name: "Penne Pasta Al Pesto",
        price: 450,
        category: "Italian",
        description: "Penne pasta tossed in rich basil, pine nut, parmesan cheese, and olive oil paste",
        vector: [0.1, 0.1, 0.4, 0.8, 0.2],
        isVeg: true,
        icon: "🍝"
      }
    ]
  },
  {
    id: "r16",
    name: "Mantra Fine Dine",
    type: "Multicuisine Veg",
    location: "Untwadi Road",
    rating: 4.5,
    dishes: [
      {
        id: "d16_1",
        name: "Mantra Special Paneer",
        price: 310,
        category: "Main Course",
        description: "Three layered paneer with green chutney, red masala, and cashew gravy",
        vector: [0.6, 0.4, 0.5, 0.85, 0.6],
        isVeg: true,
        icon: "🧀"
      },
      {
        id: "d16_2",
        name: "Slow Cooked Dal Makhani",
        price: 240,
        category: "Main Course",
        description: "Black lentils slow-cooked for 12 hours with butter and cream",
        vector: [0.3, 0.3, 0.3, 0.85, 0.8],
        isVeg: true,
        icon: "🥣"
      }
    ]
  },
  {
    id: "r17",
    name: "Larive Kitchen",
    type: "Global Healthy",
    location: "Indira Nagar",
    rating: 4.6,
    dishes: [
      {
        id: "d17_1",
        name: "Sourdough Avocado Toast",
        price: 360,
        category: "Salad",
        description: "Toasted sourdough bread loaded with smashed avocado, cherry tomatoes, and microgreens",
        vector: [0.1, 0.1, 0.6, 0.5, 0.1],
        isVeg: true,
        icon: "🥑"
      },
      {
        id: "d17_2",
        name: "Crunchy Quinoa Salad",
        price: 340,
        category: "Salad",
        description: "Nutritious quinoa tossed with diced vegetables, mint, and lemon vinaigrette",
        vector: [0.1, 0.2, 0.7, 0.3, 0.1],
        isVeg: true,
        icon: "🥗"
      }
    ]
  },
  {
    id: "r18",
    name: "Budha Halwai",
    type: "Traditional Sweets",
    location: "Panchavati",
    rating: 4.8,
    dishes: [
      {
        id: "d18_1",
        name: "Ghee Fried Saffron Jalebi",
        price: 70,
        category: "Dessert",
        description: "Famous hot thick spirals of saffron-infused sugar syrup goodness",
        vector: [0.0, 1.0, 0.3, 0.8, 0.95],
        isVeg: true,
        icon: "🌀"
      },
      {
        id: "d18_2",
        name: "Traditional Pedha Plate",
        price: 90,
        category: "Dessert",
        description: "Soft caramelized milk solids pedha, the signature prasad of Nashik temple",
        vector: [0.0, 0.95, 0.1, 0.75, 0.95],
        isVeg: true,
        icon: "🟡"
      }
    ]
  },
  {
    id: "r19",
    name: "Samarth Juice Center",
    type: "Juices & Drinks",
    location: "College Road",
    rating: 4.5,
    dishes: [
      {
        id: "d19_1",
        name: "Tangy Pineapple Sarbat",
        price: 45,
        category: "Beverage",
        description: "Sweet and sour freshly squeezed pineapple juice with black salt and cumin",
        vector: [0.1, 0.6, 0.85, 0.3, 0.8],
        isVeg: true,
        icon: "🍍"
      },
      {
        id: "d19_2",
        name: "Alphanso Mango Milkshake",
        price: 80,
        category: "Beverage",
        description: "Thick pulp mango milkshake loaded with chopped fresh mangoes and vanilla scoop",
        vector: [0.0, 0.9, 0.4, 0.65, 0.7],
        isVeg: true,
        icon: "🥭"
      }
    ]
  },
  {
    id: "r20",
    name: "Spice Route",
    type: "Traditional Non-Veg",
    location: "Nashik Road",
    rating: 4.5,
    dishes: [
      {
        id: "d20_1",
        name: "Fiery Veg Kolhapuri",
        price: 240,
        category: "Main Course",
        description: "Assorted vegetables cooked in a thick spicy coconut gravy with red hot chilies",
        vector: [0.9, 0.1, 0.5, 0.75, 0.85],
        isVeg: true,
        icon: "🔥"
      },
      {
        id: "d20_2",
        name: "Chicken Angara Kabab",
        price: 320,
        category: "Appetizers",
        description: "Boneless chicken marinated in tandoori spices and smoked with red-hot coal",
        vector: [0.85, 0.1, 0.3, 0.8, 0.8],
        isVeg: false,
        icon: "🍢"
      }
    ]
  }
];
