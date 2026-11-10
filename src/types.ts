export type UnitSystem = 'metric' | 'imperial';
export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface BmiCalculationRequest {
  unit: UnitSystem;
  height: number; // cm in metric, total inches in imperial
  weight: number; // kg in metric, lbs in imperial
  heightFeet?: number; // optional helper for imperial
  heightInches?: number; // optional helper for imperial
  age?: number;
  gender?: Gender;
  activityLevel?: ActivityLevel;
}

export type BmiCategoryKey =
  | 'severe_thinness'
  | 'moderate_thinness'
  | 'mild_thinness'
  | 'normal'
  | 'overweight'
  | 'obese_1'
  | 'obese_2'
  | 'obese_3';

export interface BmiCategoryInfo {
  key: BmiCategoryKey;
  label: string;
  min: number;
  max: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  healthRisk: string;
}

export interface BmiResult {
  bmi: number;
  category: string;
  categoryKey: BmiCategoryKey;
  categoryColor: string;
  heightMetricCm: number;
  weightMetricKg: number;
  healthyWeightRange: {
    minKg: number;
    maxKg: number;
    minLbs: number;
    maxLbs: number;
    displayMin: number;
    displayMax: number;
    unit: string;
  };
  weightDifference: {
    status: 'under' | 'normal' | 'over';
    differenceKg: number;
    differenceLbs: number;
    displayDifference: number;
    unit: string;
    message: string;
  };
  bmiPrime: number;
  ponderalIndex: number;
  bmr?: number;
  tdee?: number;
  targetCalories?: {
    maintain: number;
    mildWeightLoss?: number;
    weightGain?: number;
  };
  risks: string[];
  recommendations: string[];
}

export interface BmiHistoryRecord {
  id: string;
  timestamp: string;
  unit: UnitSystem;
  heightDisplay: string;
  weightDisplay: string;
  bmi: number;
  category: string;
  categoryColor: string;
  notes?: string;
}
