import {
  ActivityLevel,
  BmiCalculationRequest,
  BmiCategoryInfo,
  BmiCategoryKey,
  BmiResult,
  Gender,
} from '../types.ts';

export const BMI_CATEGORIES: BmiCategoryInfo[] = [
  {
    key: 'severe_thinness',
    label: 'Severe Thinness',
    min: 0,
    max: 15.99,
    color: '#3b82f6', // blue-500
    badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300',
    badgeText: 'text-blue-600',
    borderColor: 'border-blue-300 dark:border-blue-700',
    description: 'Significantly below standard body mass.',
    healthRisk: 'High risk of nutritional deficiency, weakened immunity, and bone fragility.',
  },
  {
    key: 'moderate_thinness',
    label: 'Moderate Thinness',
    min: 16.0,
    max: 16.99,
    color: '#06b6d4', // cyan-500
    badgeBg: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300',
    badgeText: 'text-cyan-600',
    borderColor: 'border-cyan-300 dark:border-cyan-700',
    description: 'Moderately underweight according to WHO standards.',
    healthRisk: 'Elevated risk of nutrient deficiencies and fatigue.',
  },
  {
    key: 'mild_thinness',
    label: 'Mild Thinness',
    min: 17.0,
    max: 18.49,
    color: '#0ea5e9', // sky-500
    badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300',
    badgeText: 'text-sky-600',
    borderColor: 'border-sky-300 dark:border-sky-700',
    description: 'Slightly underweight, bordering normal range.',
    healthRisk: 'Slightly increased risk of low energy, hormonal changes, or muscle loss.',
  },
  {
    key: 'normal',
    label: 'Normal Weight',
    min: 18.5,
    max: 24.99,
    color: '#10b981', // emerald-500
    badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300',
    badgeText: 'text-emerald-600',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    description: 'Optimal weight range associated with lowest health risks.',
    healthRisk: 'Lowest risk of weight-related chronic conditions.',
  },
  {
    key: 'overweight',
    label: 'Overweight (Pre-obese)',
    min: 25.0,
    max: 29.99,
    color: '#f59e0b', // amber-500
    badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300',
    badgeText: 'text-amber-600',
    borderColor: 'border-amber-300 dark:border-amber-700',
    description: 'Above optimal weight for height.',
    healthRisk: 'Moderate increase in risk for cardiovascular disease, hypertension, and type 2 diabetes.',
  },
  {
    key: 'obese_1',
    label: 'Obese Class I',
    min: 30.0,
    max: 34.99,
    color: '#f97316', // orange-500
    badgeBg: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300',
    badgeText: 'text-orange-600',
    borderColor: 'border-orange-300 dark:border-orange-700',
    description: 'Class 1 obesity; noticeable excess adipose mass.',
    healthRisk: 'High risk of hypertension, dyslipidemia, metabolic syndrome, and osteoarthritis.',
  },
  {
    key: 'obese_2',
    label: 'Obese Class II',
    min: 35.0,
    max: 39.99,
    color: '#ef4444', // red-500
    badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300',
    badgeText: 'text-red-600',
    borderColor: 'border-red-300 dark:border-red-700',
    description: 'Class 2 severe obesity.',
    healthRisk: 'Very high risk of heart disease, stroke, obstructive sleep apnea, and non-alcoholic fatty liver.',
  },
  {
    key: 'obese_3',
    label: 'Obese Class III',
    min: 40.0,
    max: 100.0,
    color: '#881337', // rose-900 / dark crimson
    badgeBg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300',
    badgeText: 'text-rose-700',
    borderColor: 'border-rose-300 dark:border-rose-700',
    description: 'Class 3 very severe / morbid obesity.',
    healthRisk: 'Extremely high risk of severe cardiovascular complications and reduced life expectancy.',
  },
];

export function determineCategory(bmi: number): BmiCategoryInfo {
  if (bmi < 16.0) return BMI_CATEGORIES[0];
  if (bmi < 17.0) return BMI_CATEGORIES[1];
  if (bmi < 18.5) return BMI_CATEGORIES[2];
  if (bmi < 25.0) return BMI_CATEGORIES[3];
  if (bmi < 30.0) return BMI_CATEGORIES[4];
  if (bmi < 35.0) return BMI_CATEGORIES[5];
  if (bmi < 40.0) return BMI_CATEGORIES[6];
  return BMI_CATEGORIES[7];
}

/**
 * Calculates BMI, Healthy Weight Range, Prime, Ponderal Index, and recommendations.
 */
export function calculateBmi(input: BmiCalculationRequest): BmiResult {
  const { unit, height, weight, age = 28, gender = 'male', activityLevel = 'moderate' } = input;

  // Convert to metric internally:
  // Height in meters and cm
  let heightCm: number;
  let weightKg: number;

  if (unit === 'imperial') {
    // height is in inches, weight in lbs
    heightCm = height * 2.54;
    weightKg = weight * 0.45359237;
  } else {
    heightCm = height;
    weightKg = weight;
  }

  // Guard against zeroes or invalid inputs
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Height and weight must be positive numbers');
  }

  const heightM = heightCm / 100;
  const bmiRaw = weightKg / (heightM * heightM);
  const bmi = Math.round(bmiRaw * 10) / 10;

  const categoryInfo = determineCategory(bmi);

  // Normal BMI range standard: 18.5 to 24.9
  const minNormalKg = Math.round(18.5 * (heightM * heightM) * 10) / 10;
  const maxNormalKg = Math.round(24.9 * (heightM * heightM) * 10) / 10;

  const minNormalLbs = Math.round((minNormalKg / 0.45359237) * 10) / 10;
  const maxNormalLbs = Math.round((maxNormalKg / 0.45359237) * 10) / 10;

  const isMetric = unit === 'metric';
  const displayMin = isMetric ? minNormalKg : minNormalLbs;
  const displayMax = isMetric ? maxNormalKg : maxNormalLbs;
  const weightUnit = isMetric ? 'kg' : 'lbs';

  // Weight Difference
  let status: 'under' | 'normal' | 'over' = 'normal';
  let diffKg = 0;
  let message = 'You are currently in the normal, healthy weight range for your height!';

  if (weightKg < minNormalKg) {
    status = 'under';
    diffKg = Math.round((minNormalKg - weightKg) * 10) / 10;
    const diffDisplay = isMetric ? diffKg : Math.round((diffKg / 0.45359237) * 10) / 10;
    message = `You are approximately ${diffDisplay} ${weightUnit} below the recommended healthy weight range.`;
  } else if (weightKg > maxNormalKg) {
    status = 'over';
    diffKg = Math.round((weightKg - maxNormalKg) * 10) / 10;
    const diffDisplay = isMetric ? diffKg : Math.round((diffKg / 0.45359237) * 10) / 10;
    message = `You are approximately ${diffDisplay} ${weightUnit} above the recommended healthy weight range.`;
  }

  const diffLbs = Math.round((diffKg / 0.45359237) * 10) / 10;
  const displayDifference = isMetric ? diffKg : diffLbs;

  // BMI Prime: Ratio of actual BMI to upper normal limit (25.0)
  const bmiPrime = Math.round((bmi / 25.0) * 100) / 100;

  // Ponderal Index: mass (kg) / height (m)^3
  const ponderalIndex = Math.round((weightKg / Math.pow(heightM, 3)) * 10) / 10;

  // Metabolic calculations (Mifflin-St Jeor formula)
  // BMR = 10 * weight(kg) + 6.25 * height(cm) - 5 * age + (gender === 'male' ? 5 : -161)
  const genderOffset = gender === 'female' ? -161 : gender === 'other' ? -78 : 5;
  const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset);

  const activityMultipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = Math.round(bmr * multiplier);

  // Recommendations and health risks tailored
  const risks: string[] = [];
  const recommendations: string[] = [];

  risks.push(categoryInfo.healthRisk);

  if (bmi < 18.5) {
    risks.push('Possible deficiencies in vitamin D, iron, and calcium.');
    risks.push('Potential decrease in muscle mass and bone mineral density.');
    recommendations.push('Gradually increase calorie intake with nutrient-dense foods (nuts, avocados, whole grains, lean proteins).');
    recommendations.push('Incorporate resistance training to stimulate healthy lean muscle growth rather than solely adipose tissue.');
    recommendations.push('Eat 3 balanced meals plus 2-3 healthy snacks spaced throughout the day.');
    recommendations.push('Consult a registered dietitian or doctor to exclude underlying gastrointestinal or metabolic conditions.');
  } else if (bmi >= 18.5 && bmi < 25.0) {
    risks.push('Statistically minimal baseline risk for cardiovascular conditions and type 2 diabetes.');
    recommendations.push('Maintain a wholesome diet rich in colorful vegetables, fruits, whole grains, and lean proteins.');
    recommendations.push('Target at least 150 minutes of moderate aerobic activity plus 2 strength sessions weekly.');
    recommendations.push('Prioritize consistent 7-9 hours of restorative sleep and stress management.');
    recommendations.push('Stay adequately hydrated with 2-3 liters of water daily.');
  } else if (bmi >= 25.0 && bmi < 30.0) {
    risks.push('Gradual increase in systolic blood pressure and fasting lipid levels.');
    risks.push('Mildly increased load on weight-bearing joints (knees, hips, lumbar spine).');
    recommendations.push('Aim for a modest, sustainable caloric deficit (300-500 kcal/day) focused on whole unprocessed foods.');
    recommendations.push('Engage in 150-300 minutes of moderate-intensity exercise such as brisk walking, cycling, or swimming.');
    recommendations.push('Reduce sugary beverages, ultra-processed snacks, and refined carbohydrates.');
    recommendations.push('Track portion sizes and include fiber-rich vegetables with every meal to enhance satiety.');
  } else {
    // Obese
    risks.push('Higher likelihood of obstructive sleep apnea, metabolic syndrome, and insulin resistance.');
    risks.push('Increased long-term stress on the cardiovascular system and arterial vascular walls.');
    recommendations.push('Consult a healthcare provider for a comprehensive cardiometabolic health assessment.');
    recommendations.push('Adopt low-impact cardiovascular exercises (water aerobics, elliptical, recumbent bike) to protect joints.');
    recommendations.push('Target a realistic, gradual weight loss goal of 5% to 10% of total body weight over 6 months.');
    recommendations.push('Focus on sustainable lifestyle modifications rather than restrictive crash dieting.');
  }

  const targetCalories = {
    maintain: tdee,
    mildWeightLoss: Math.max(1200, Math.round(tdee - 400)),
    weightGain: Math.round(tdee + 400),
  };

  return {
    bmi,
    category: categoryInfo.label,
    categoryKey: categoryInfo.key,
    categoryColor: categoryInfo.color,
    heightMetricCm: Math.round(heightCm * 10) / 10,
    weightMetricKg: Math.round(weightKg * 10) / 10,
    healthyWeightRange: {
      minKg: minNormalKg,
      maxKg: maxNormalKg,
      minLbs: minNormalLbs,
      maxLbs: maxNormalLbs,
      displayMin,
      displayMax,
      unit: weightUnit,
    },
    weightDifference: {
      status,
      differenceKg: diffKg,
      differenceLbs: diffLbs,
      displayDifference,
      unit: weightUnit,
      message,
    },
    bmiPrime,
    ponderalIndex,
    bmr,
    tdee,
    targetCalories,
    risks,
    recommendations,
  };
}
