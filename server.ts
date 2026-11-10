import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateBmi, BMI_CATEGORIES } from './src/utils/bmiCalculator.ts';
import { BmiCalculationRequest, BmiHistoryRecord } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory store for calculation history
const historyStore: BmiHistoryRecord[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BMI Calculator API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Calculate BMI endpoint
  app.post('/api/bmi/calculate', (req, res) => {
    try {
      const { unit, height, weight, age, gender, activityLevel } = req.body as BmiCalculationRequest;

      if (!unit || height === undefined || weight === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: unit, height, and weight are mandatory.',
        });
      }

      if (typeof height !== 'number' || height <= 0 || isNaN(height)) {
        return res.status(400).json({ error: 'Height must be a valid positive number.' });
      }

      if (typeof weight !== 'number' || weight <= 0 || isNaN(weight)) {
        return res.status(400).json({ error: 'Weight must be a valid positive number.' });
      }

      const result = calculateBmi({
        unit,
        height,
        weight,
        age: age ? Number(age) : 28,
        gender: gender || 'male',
        activityLevel: activityLevel || 'moderate',
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Calculation error occurred.';
      return res.status(400).json({ error: message });
    }
  });

  // Get WHO categories endpoint
  app.get('/api/bmi/categories', (req, res) => {
    res.json({
      categories: BMI_CATEGORIES,
      source: 'World Health Organization (WHO) BMI Classifications',
    });
  });

  // Sample presets for quick testing
  app.get('/api/bmi/presets', (req, res) => {
    res.json([
      {
        id: 'preset_normal_m',
        name: 'Average Adult (Metric)',
        unit: 'metric',
        height: 175,
        weight: 68,
        age: 30,
        gender: 'male',
        activityLevel: 'moderate',
        description: '175 cm, 68 kg — Normal healthy weight',
      },
      {
        id: 'preset_normal_imp',
        name: 'Average Adult (Imperial)',
        unit: 'imperial',
        height: 68, // 5 ft 8 in
        heightFeet: 5,
        heightInches: 8,
        weight: 150,
        age: 28,
        gender: 'female',
        activityLevel: 'light',
        description: "5'8\", 150 lbs — Balanced healthy BMI",
      },
      {
        id: 'preset_athletic',
        name: 'Athletic Male (Overweight BMI)',
        unit: 'metric',
        height: 180,
        weight: 85,
        age: 26,
        gender: 'male',
        activityLevel: 'active',
        description: '180 cm, 85 kg — Demonstrates BMI muscularity nuance',
      },
      {
        id: 'preset_underweight',
        name: 'Underweight Profile',
        unit: 'metric',
        height: 170,
        weight: 48,
        age: 22,
        gender: 'female',
        activityLevel: 'light',
        description: '170 cm, 48 kg — Mild/Moderate thinness',
      },
      {
        id: 'preset_obese',
        name: 'Elevated BMI Profile',
        unit: 'imperial',
        height: 70, // 5 ft 10 in
        heightFeet: 5,
        heightInches: 10,
        weight: 235,
        age: 45,
        gender: 'male',
        activityLevel: 'sedentary',
        description: "5'10\", 235 lbs — Obese Class I with targeted action steps",
      },
    ]);
  });

  // History endpoints
  app.get('/api/bmi/history', (req, res) => {
    res.json(historyStore.slice(-20).reverse());
  });

  app.post('/api/bmi/history', (req, res) => {
    const record = req.body as BmiHistoryRecord;
    if (!record || !record.id || !record.bmi) {
      return res.status(400).json({ error: 'Invalid history record.' });
    }
    historyStore.push(record);
    if (historyStore.length > 50) {
      historyStore.shift();
    }
    return res.status(201).json({ success: true, count: historyStore.length });
  });

  app.delete('/api/bmi/history', (req, res) => {
    historyStore.length = 0;
    return res.json({ success: true, message: 'History cleared' });
  });

  // Integration with Vite
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
