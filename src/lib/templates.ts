import type {
  MealType,
  MealCell,
  WeekData,
  DayOfWeek,
} from "@/types/meal-plan";
import { DAYS, MEAL_SLOTS, createEmptyWeek } from "@/types/meal-plan";

export interface MealTemplate {
  id: string;
  name: string;
  description: string;
  /** Per-day meal data. If a day is omitted, Monday's data will be reused. */
  days: Partial<Record<DayOfWeek, Record<MealType, MealCell>>>;
}

function buildWeekFromDays(
  days: Partial<Record<DayOfWeek, Record<MealType, MealCell>>>,
): WeekData {
  const week = createEmptyWeek();
  const fallback = days.monday;

  for (const day of DAYS) {
    const source = days[day.key] ?? fallback;
    if (source) {
      for (const meal of MEAL_SLOTS) {
        week[day.key][meal.key] = { ...source[meal.key] };
      }
    }
  }
  return week;
}

// ─── Templates ────────────────────────────────────────────────────────

const pcosTemplate: MealTemplate = {
  id: "pcos",
  name: "PCOS",
  description: "Low GI, anti-inflammatory, insulin-friendly plan",
  days: {
    monday: {
      early_morning: {
        diet: "Warm water + cinnamon + 5 soaked almonds",
        quantity: "1 glass",
        note: "Empty stomach",
      },
      breakfast: {
        diet: "Besan chilla + mint chutney",
        quantity: "2 pieces",
        note: "High protein, no maida",
      },
      mid_meal: {
        diet: "Apple slices + peanut butter",
        quantity: "1 small apple",
        note: "Low GI fruit",
      },
      lunch: {
        diet: "Brown rice + palak dal + cucumber raita",
        quantity: "1 plate",
        note: "Low GI carbs",
      },
      evening_snack: {
        diet: "Roasted makhana",
        quantity: "1 cup",
        note: "Anti-inflammatory",
      },
      dinner: {
        diet: "Grilled tofu + sautéed veggies + 1 roti",
        quantity: "1 plate",
        note: "Light, early dinner",
      },
      post_dinner: {
        diet: "Chamomile tea",
        quantity: "1 cup",
        note: "Caffeine-free",
      },
    },
    tuesday: {
      early_morning: {
        diet: " my tues Warm water + cinnamon + 5 soaked almonds",
        quantity: "1 glass",
        note: "Empty stomach",
      },
      breakfast: {
        diet: "Besan chilla + mint chutney",
        quantity: "2 pieces",
        note: "High protein, no maida",
      },
      mid_meal: {
        diet: "Apple slices + peanut butter",
        quantity: "1 small apple",
        note: "Low GI fruit",
      },
      lunch: {
        diet: "Brown rice + palak dal + cucumber raita",
        quantity: "1 plate",
        note: "Low GI carbs",
      },
      evening_snack: {
        diet: "Roasted makhana",
        quantity: "1 cup",
        note: "Anti-inflammatory",
      },
      dinner: {
        diet: "Grilled tofu + sautéed veggies + 1 roti",
        quantity: "1 plate",
        note: "Light, early dinner",
      },
      post_dinner: {
        diet: "Chamomile tea",
        quantity: "1 cup",
        note: "Caffeine-free",
      },
    },
    wednesday: {
      early_morning: {
        diet: "Warm water + fenugreek seeds",
        quantity: "1 glass",
        note: "Soak seeds overnight",
      },
      breakfast: {
        diet: " my wed Vegetable poha + sprouts",
        quantity: "1 bowl",
        note: "Add turmeric",
      },
      mid_meal: { diet: "Guava slices", quantity: "1 medium", note: "Low GI" },
      lunch: {
        diet: "Quinoa pulao + raita + green salad",
        quantity: "1 plate",
        note: "High fiber",
      },
      evening_snack: {
        diet: "Chana chaat",
        quantity: "1 small bowl",
        note: "No sev/papdi",
      },
      dinner: {
        diet: "Paneer bhurji + multigrain roti",
        quantity: "1 plate",
        note: "No cream",
      },
      post_dinner: {
        diet: "Turmeric milk (no sugar)",
        quantity: "1 glass",
        note: "Use jaggery if needed",
      },
    },
    thursday: {
      early_morning: {
        diet: "Warm water + cinnamon + 5 soaked almonds",
        quantity: "1 glass",
        note: "Empty stomach",
      },
      breakfast: {
        diet: "Besan chilla + mint chutney",
        quantity: "2 pieces",
        note: "High protein, no maida",
      },
      mid_meal: {
        diet: "Apple slices + peanut butter",
        quantity: "1 small apple",
        note: "Low GI fruit",
      },
      lunch: {
        diet: " my thus Brown rice + palak dal + cucumber raita",
        quantity: "1 plate",
        note: "Low GI carbs",
      },
      evening_snack: {
        diet: "Roasted makhana",
        quantity: "1 cup",
        note: "Anti-inflammatory",
      },
      dinner: {
        diet: "Grilled tofu + sautéed veggies + 1 roti",
        quantity: "1 plate",
        note: "Light, early dinner",
      },
      post_dinner: {
        diet: "Chamomile tea",
        quantity: "1 cup",
        note: "Caffeine-free",
      },
    },
    friday: {
      early_morning: {
        diet: "Warm water + chia seeds + lemon",
        quantity: "1 glass",
        note: "Soak chia 10 min",
      },
      breakfast: {
        diet: "Oats idli + sambar",
        quantity: "2 idlis",
        note: "Oats-based batter",
      },
      mid_meal: {
        diet: "Pomegranate bowl",
        quantity: "1 bowl",
        note: "Rich in antioxidants",
      },
      lunch: {
        diet: "Millets khichdi + curd + veggies",
        quantity: "1 plate",
        note: "Jowar/bajra millet",
      },
      evening_snack: {
        diet: "Mixed seeds trail mix",
        quantity: "1 handful",
        note: "Pumpkin, sunflower, flax",
      },
      dinner: {
        diet: " my friday Stuffed capsicum + soup",
        quantity: "1 plate",
        note: "Paneer-stuffed",
      },
      post_dinner: {
        diet: "Warm milk + nutmeg",
        quantity: "1 glass",
        note: "Aids sleep",
      },
    },
    saturday: {
      early_morning: {
        diet: "Warm water + cinnamon + 5 soaked almonds",
        quantity: "1 glass",
        note: "Empty stomach",
      },
      breakfast: {
        diet: "Besan chilla + mint chutney",
        quantity: "2 pieces",
        note: "High protein, no maida",
      },
      mid_meal: {
        diet: "Apple slices + peanut butter",
        quantity: "1 small apple",
        note: "Low GI fruit",
      },
      lunch: {
        diet: "Brown rice + palak dal + cucumber raita",
        quantity: "1 plate",
        note: "Low GI carbs",
      },
      evening_snack: {
        diet: "Roasted makhana",
        quantity: "1 cup",
        note: "Anti-inflammatory",
      },
      dinner: {
        diet: "Grilled tofu + sautéed veggies + 1 roti",
        quantity: "1 plate",
        note: "Light, early dinner",
      },
      post_dinner: {
        diet: " my saturday Chamomile tea",
        quantity: "1 cup",
        note: "Caffeine-free",
      },
    },
    sunday: {
      early_morning: {
        diet: " my sunday Warm water + cinnamon + 5 soaked almonds",
        quantity: "1 glass",
        note: "Empty stomach",
      },
      breakfast: {
        diet: "Besan chilla + mint chutney",
        quantity: "2 pieces",
        note: "High protein, no maida",
      },
      mid_meal: {
        diet: "Apple slices + peanut butter",
        quantity: "1 small apple",
        note: "Low GI fruit",
      },
      lunch: {
        diet: "Brown rice + palak dal + cucumber raita",
        quantity: "1 plate",
        note: "Low GI carbs",
      },
      evening_snack: {
        diet: "Roasted makhana",
        quantity: "1 cup",
        note: "Anti-inflammatory",
      },
      dinner: {
        diet: "Grilled tofu + sautéed veggies + 1 roti",
        quantity: "1 plate",
        note: "Light, early dinner",
      },
      post_dinner: {
        diet: "Chamomile tea",
        quantity: "1 cup",
        note: "Caffeine-free",
      },
    },
  },
};

const hormonalImbalanceTemplate: MealTemplate = {
  id: "hormonal-imbalance",
  name: "Hormonal Imbalance",
  description: "Hormone-balancing, gut-friendly, nutrient-dense plan",
  days: {
    monday: {
      early_morning: {
        diet: "Warm water + soaked flaxseeds",
        quantity: "1 glass",
        note: "Phytoestrogens",
      },
      breakfast: {
        diet: "Ragi dosa + coconut chutney",
        quantity: "2 dosas",
        note: "Calcium-rich",
      },
      mid_meal: {
        diet: "Papaya cubes",
        quantity: "1 bowl",
        note: "Digestive enzymes",
      },
      lunch: {
        diet: "Red rice + sambar + beans poriyal + curd",
        quantity: "1 plate",
        note: "Fiber + probiotics",
      },
      evening_snack: {
        diet: "Sprouted moong salad",
        quantity: "1 cup",
        note: "Lemon + chaat masala",
      },
      dinner: {
        diet: "Methi paratha + dal + raita",
        quantity: "1 plate",
        note: "Methi aids hormones",
      },
      post_dinner: {
        diet: "Ashwagandha milk",
        quantity: "1 glass",
        note: "Stress-reducing",
      },
    },
    tuesday: {
      early_morning: {
        diet: "Warm lemon water + walnuts",
        quantity: "1 glass + 3 walnuts",
        note: "Omega-3",
      },
      breakfast: {
        diet: "Moong dal cheela + avocado",
        quantity: "2 pieces",
        note: "Healthy fats",
      },
      mid_meal: {
        diet: "Mixed berries",
        quantity: "1 cup",
        note: "Antioxidant boost",
      },
      lunch: {
        diet: "Bajra roti + kadhi + aloo gobi",
        quantity: "1 plate",
        note: "Millet-based",
      },
      evening_snack: {
        diet: "Dates + almond butter",
        quantity: "2 dates",
        note: "Iron-rich",
      },
      dinner: {
        diet: "Grilled fish + steamed broccoli + soup",
        quantity: "1 plate",
        note: "Omega-3 fatty acids",
      },
      post_dinner: {
        diet: "Shatavari milk",
        quantity: "1 glass",
        note: "Hormone support",
      },
    },
    thursday: {
      early_morning: {
        diet: "Warm water + amla + honey",
        quantity: "1 glass",
        note: "Vitamin C boost",
      },
      breakfast: {
        diet: "Overnight oats + seeds + berries",
        quantity: "1 bowl",
        note: "No refined sugar",
      },
      mid_meal: {
        diet: "Sweet potato chaat",
        quantity: "1 small bowl",
        note: "Complex carbs",
      },
      lunch: {
        diet: "Foxtail millet rice + rasam + palak paneer",
        quantity: "1 plate",
        note: "Iron + protein",
      },
      evening_snack: {
        diet: "Roasted peanuts + jaggery",
        quantity: "1 handful",
        note: "",
      },
      dinner: {
        diet: "Egg bhurji + multigrain toast + salad",
        quantity: "1 plate",
        note: "Protein-rich",
      },
      post_dinner: {
        diet: "Lavender chamomile tea",
        quantity: "1 cup",
        note: "Calming",
      },
    },
  },
};

const periMenopauseTemplate: MealTemplate = {
  id: "peri-menopause",
  name: "Peri-menopause",
  description: "Calcium-rich, phytoestrogen, bone & heart health plan",
  days: {
    monday: {
      early_morning: {
        diet: "Warm water + soaked almonds + raisins",
        quantity: "1 glass + 5 almonds",
        note: "Calcium + iron",
      },
      breakfast: {
        diet: "Nachni (ragi) porridge + nuts",
        quantity: "1 bowl",
        note: "Calcium-dense",
      },
      mid_meal: {
        diet: "Orange + flaxseed powder",
        quantity: "1 orange",
        note: "Vitamin C + phytoestrogen",
      },
      lunch: {
        diet: "Jowar roti + methi dal + carrot salad + curd",
        quantity: "1 plate",
        note: "Fiber-rich",
      },
      evening_snack: {
        diet: "Til (sesame) laddoo",
        quantity: "1 piece",
        note: "Calcium powerhouse",
      },
      dinner: {
        diet: "Mushroom soup + grilled paneer sandwich",
        quantity: "1 plate",
        note: "Vitamin D + protein",
      },
      post_dinner: {
        diet: "Warm milk + saffron",
        quantity: "1 glass",
        note: "Aids sleep & mood",
      },
    },
    wednesday: {
      early_morning: {
        diet: "Warm water + moringa powder",
        quantity: "1 glass",
        note: "Mineral-rich",
      },
      breakfast: {
        diet: "Soy dosa + sambhar",
        quantity: "2 dosas",
        note: "Phytoestrogen",
      },
      mid_meal: {
        diet: "Kiwi + chia pudding",
        quantity: "1 cup",
        note: "Bone health",
      },
      lunch: {
        diet: "Brown rice + rajma + salad + buttermilk",
        quantity: "1 plate",
        note: "Protein + calcium",
      },
      evening_snack: {
        diet: "Dry fig + walnut mix",
        quantity: "1 handful",
        note: "Omega-3 + calcium",
      },
      dinner: {
        diet: "Tofu stir-fry + multigrain roti + soup",
        quantity: "1 plate",
        note: "Soy isoflavones",
      },
      post_dinner: {
        diet: "Valerian root tea",
        quantity: "1 cup",
        note: "Sleep support",
      },
    },
    saturday: {
      early_morning: {
        diet: "Warm water + amla juice",
        quantity: "1 glass",
        note: "Antioxidant",
      },
      breakfast: {
        diet: "Sprouted moong paratha + curd",
        quantity: "1 paratha",
        note: "High protein",
      },
      mid_meal: {
        diet: "Banana + pumpkin seeds",
        quantity: "1 banana",
        note: "Magnesium-rich",
      },
      lunch: {
        diet: "Ragi mudde + saaru + beans palya",
        quantity: "1 plate",
        note: "Traditional calcium meal",
      },
      evening_snack: {
        diet: "Paneer tikka (baked)",
        quantity: "3-4 pieces",
        note: "Protein + calcium",
      },
      dinner: {
        diet: "Vegetable daliya + raita",
        quantity: "1 bowl",
        note: "Light, fiber-rich",
      },
      post_dinner: {
        diet: "Golden milk (haldi)",
        quantity: "1 glass",
        note: "Anti-inflammatory",
      },
    },
  },
};

const fertilityTemplate: MealTemplate = {
  id: "fertility",
  name: "Fertility",
  description: "Folate-rich, iron-boosting, reproductive health plan",
  days: {
    monday: {
      early_morning: {
        diet: "Warm water + soaked walnuts + dates",
        quantity: "1 glass + 2 dates",
        note: "Iron + folate",
      },
      breakfast: {
        diet: "Spinach & cheese omelette + toast",
        quantity: "1 plate",
        note: "Folate + protein",
      },
      mid_meal: {
        diet: "Pomegranate juice",
        quantity: "1 glass",
        note: "Blood-building",
      },
      lunch: {
        diet: "Jeera rice + chana dal + beetroot raita",
        quantity: "1 plate",
        note: "Iron-rich",
      },
      evening_snack: {
        diet: "Mixed nuts + dried apricots",
        quantity: "1 handful",
        note: "Iron + healthy fats",
      },
      dinner: {
        diet: "Palak paneer + bajra roti + salad",
        quantity: "1 plate",
        note: "Iron + calcium",
      },
      post_dinner: {
        diet: "Warm milk + shatavari",
        quantity: "1 glass",
        note: "Fertility tonic",
      },
    },
    tuesday: {
      early_morning: {
        diet: "Warm water + fennel seeds",
        quantity: "1 glass",
        note: "Hormonal balance",
      },
      breakfast: {
        diet: "Avocado toast + boiled eggs",
        quantity: "1 plate",
        note: "Healthy fats + choline",
      },
      mid_meal: {
        diet: "Banana smoothie + flaxseeds",
        quantity: "1 glass",
        note: "Potassium + omega-3",
      },
      lunch: {
        diet: "Lemon rice + sambar + drumstick curry",
        quantity: "1 plate",
        note: "Vitamin C + iron absorption",
      },
      evening_snack: {
        diet: "Sweet potato wedges (baked)",
        quantity: "1 cup",
        note: "Beta-carotene",
      },
      dinner: {
        diet: "Grilled salmon/fish + quinoa + greens",
        quantity: "1 plate",
        note: "Omega-3 rich",
      },
      post_dinner: {
        diet: "Raspberry leaf tea",
        quantity: "1 cup",
        note: "Uterine tonic",
      },
    },
    friday: {
      early_morning: {
        diet: "Warm water + honey + ginger",
        quantity: "1 glass",
        note: "Circulation boost",
      },
      breakfast: {
        diet: "Whole wheat pancakes + berries + yogurt",
        quantity: "2 pancakes",
        note: "Antioxidants",
      },
      mid_meal: {
        diet: "Mango (seasonal) or kiwi",
        quantity: "1 serving",
        note: "Vitamin C",
      },
      lunch: {
        diet: "Rajma chawal + green salad + curd",
        quantity: "1 plate",
        note: "Protein + probiotics",
      },
      evening_snack: {
        diet: "Hummus + carrot sticks",
        quantity: "1 bowl",
        note: "Folate + fiber",
      },
      dinner: {
        diet: "Egg curry + multigrain roti + soup",
        quantity: "1 plate",
        note: "Protein + iron",
      },
      post_dinner: {
        diet: "Warm milk + ashwagandha",
        quantity: "1 glass",
        note: "Stress management",
      },
    },
  },
};

const weightGainTemplate: MealTemplate = {
  id: "weight-gain",
  name: "Weight Gain",
  description: "Calorie-dense, protein-rich, healthy surplus plan",
  days: {
    monday: {
      early_morning: {
        diet: "Banana shake + soaked almonds + cashews",
        quantity: "1 large glass",
        note: "Calorie-dense start",
      },
      breakfast: {
        diet: "Stuffed paratha (paneer) + curd + butter",
        quantity: "2 parathas",
        note: "Healthy fats + protein",
      },
      mid_meal: {
        diet: "Chikoo milkshake",
        quantity: "1 tall glass",
        note: "Natural sugars",
      },
      lunch: {
        diet: "White rice + chicken curry + dal + salad",
        quantity: "1 large plate",
        note: "Extra rice portion",
      },
      evening_snack: {
        diet: "Peanut butter sandwich + banana",
        quantity: "1 sandwich",
        note: "Calorie boost",
      },
      dinner: {
        diet: "Butter chicken / paneer + naan + raita",
        quantity: "1 plate",
        note: "Protein-dense",
      },
      post_dinner: {
        diet: "Warm milk + honey + badam powder",
        quantity: "1 glass",
        note: "Growth & recovery",
      },
    },
    wednesday: {
      early_morning: {
        diet: "Dry fruit milkshake",
        quantity: "1 large glass",
        note: "Dates, figs, almonds",
      },
      breakfast: {
        diet: "Aloo paratha + butter + lassi",
        quantity: "2 parathas",
        note: "Calorie surplus",
      },
      mid_meal: {
        diet: "Mango smoothie + protein powder",
        quantity: "1 glass",
        note: "Seasonal",
      },
      lunch: {
        diet: "Biryani + raita + boiled egg",
        quantity: "1 large plate",
        note: "Complete meal",
      },
      evening_snack: {
        diet: "Cheese toast + mixed nuts",
        quantity: "2 slices",
        note: "Healthy fats",
      },
      dinner: {
        diet: "Dal makhani + jeera rice + paneer tikka",
        quantity: "1 plate",
        note: "Rich & filling",
      },
      post_dinner: {
        diet: "Banana + peanut butter",
        quantity: "1 banana",
        note: "Slow-release energy",
      },
    },
    saturday: {
      early_morning: {
        diet: "Soaked raisins + cashew + warm milk",
        quantity: "1 glass",
        note: "Quick calories",
      },
      breakfast: {
        diet: "Chole bhature (baked bhature) + lassi",
        quantity: "1 plate",
        note: "Weekend special",
      },
      mid_meal: {
        diet: "Fruit custard",
        quantity: "1 bowl",
        note: "Mixed fruits",
      },
      lunch: {
        diet: "Ghee rice + mutton/soy curry + salad",
        quantity: "1 plate",
        note: "Protein + fat",
      },
      evening_snack: {
        diet: "Protein bar + milkshake",
        quantity: "1 each",
        note: "Convenient calories",
      },
      dinner: {
        diet: "Pasta in white sauce + garlic bread",
        quantity: "1 plate",
        note: "Carb loading",
      },
      post_dinner: {
        diet: "Warm turmeric milk + dates",
        quantity: "1 glass + 2 dates",
        note: "Recovery",
      },
    },
  },
};

const skinImmunityTemplate: MealTemplate = {
  id: "skin-immunity",
  name: "Skin & Immunity",
  description: "Vitamin-C rich, collagen-boosting, antioxidant plan",
  days: {
    monday: {
      early_morning: {
        diet: "Warm water + amla juice + turmeric",
        quantity: "1 glass",
        note: "Immunity booster",
      },
      breakfast: {
        diet: "Vegetable oats upma + green tea",
        quantity: "1 bowl",
        note: "Antioxidant-rich",
      },
      mid_meal: {
        diet: "Orange + kiwi bowl",
        quantity: "1 bowl",
        note: "Vitamin C bomb",
      },
      lunch: {
        diet: "Brown rice + drumstick sambar + carrot salad",
        quantity: "1 plate",
        note: "Beta-carotene + vitamin A",
      },
      evening_snack: {
        diet: "Green smoothie (spinach, cucumber, mint)",
        quantity: "1 glass",
        note: "Detox",
      },
      dinner: {
        diet: "Grilled chicken/paneer + stir-fry veggies + soup",
        quantity: "1 plate",
        note: "Collagen + vitamins",
      },
      post_dinner: {
        diet: "Golden milk (turmeric + pepper)",
        quantity: "1 glass",
        note: "Anti-inflammatory",
      },
    },
    tuesday: {
      early_morning: {
        diet: "Aloe vera juice + lemon",
        quantity: "1 glass",
        note: "Skin hydration",
      },
      breakfast: {
        diet: "Beetroot & carrot paratha + curd",
        quantity: "1 paratha",
        note: "Skin glow",
      },
      mid_meal: {
        diet: "Papaya bowl + pumpkin seeds",
        quantity: "1 bowl",
        note: "Enzyme + zinc",
      },
      lunch: {
        diet: "Millet khichdi + palak raita + tomato soup",
        quantity: "1 plate",
        note: "Lycopene + iron",
      },
      evening_snack: {
        diet: "Dark chocolate + almonds",
        quantity: "2 squares + 5 almonds",
        note: "Flavonoids",
      },
      dinner: {
        diet: "Fish tikka + vegetable pulao + salad",
        quantity: "1 plate",
        note: "Omega-3 for skin",
      },
      post_dinner: {
        diet: "Jasmine green tea",
        quantity: "1 cup",
        note: "Antioxidant",
      },
    },
    thursday: {
      early_morning: {
        diet: "Warm water + honey + basil seeds",
        quantity: "1 glass",
        note: "Cooling + cleansing",
      },
      breakfast: {
        diet: "Sweet potato toast + avocado + eggs",
        quantity: "1 plate",
        note: "Vitamin E + biotin",
      },
      mid_meal: {
        diet: "Watermelon + mint",
        quantity: "1 bowl",
        note: "Hydrating",
      },
      lunch: {
        diet: "Lemon rice + tomato dal + cucumber raita",
        quantity: "1 plate",
        note: "Vitamin C + probiotics",
      },
      evening_snack: {
        diet: "Coconut water + mixed seeds bar",
        quantity: "1 glass + 1 bar",
        note: "Electrolytes + zinc",
      },
      dinner: {
        diet: "Mushroom stir-fry + roti + broccoli soup",
        quantity: "1 plate",
        note: "Vitamin D + C",
      },
      post_dinner: {
        diet: "Rooibos tea",
        quantity: "1 cup",
        note: "Anti-aging antioxidants",
      },
    },
  },
};

// ─── Export ───────────────────────────────────────────────────────────

export const MEAL_TEMPLATES: MealTemplate[] = [
  pcosTemplate,
  hormonalImbalanceTemplate,
  periMenopauseTemplate,
  fertilityTemplate,
  weightGainTemplate,
  skinImmunityTemplate,
];

/**
 * Build a full WeekData from a template ID.
 * Days not explicitly defined in the template are filled from Monday's meals.
 */
export function getTemplateWeekData(templateId: string): WeekData | null {
  const template = MEAL_TEMPLATES.find((t) => t.id === templateId);
  if (!template) return null;
  return buildWeekFromDays(template.days);
}
