import { type } from "os";

export type FitbitImage = {
  url: string;
  height: number;
  width: number;
};

export type Sleep = {
  sleep: {
    dateOfSleep: string;
    duration: number;
    efficiency: number;
    endTime: string;
    infoCode: number;
    isMainSleep: boolean;
    levels: {
      data: {
        dateTime: string;
        level: string;
        seconds: number;
      }[];
      shortData: {
        dateTime: string;
        level: string;
        seconds: number;
      }[];
      summary: {
        deep: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        light: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        rem: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
        wake: {
          count: number;
          minutes: number;
          thirtyDayAvgMinutes: number;
        };
      };
      logId: number;
      minutesAfterWakeup: number;
      minutesAsleep: number;
      minutesAwake: number;
      minutesToFallAsleep: number;
      logType: string;
      startTime: string;
      timeInBed: number;
      type: string;
    };
  }[];
  summary: {
    stages: {
      deep: number;
      light: number;
      rem: number;
      wake: number;
    };
    totalMinutesAsleep: number;
    totalSleepRecords: number;
    totalTimeInBed: number;
  };
};

export type Friends = {
  data: {
    type: string;
    id: string;
    attributes: {
      avatar: string;
      child: boolean;
      friend: boolean;
      name: string;
    };
  }[];
};

export type Food = {
  foods: {
    isFavorite: boolean;
    logDate: string;
    logId: number;
    loggedFood: {
      accessLevel: string;
      amount: number;
      brand: string;
      calories: number;
      foodId: number;
      locale: string;
      mealTypeId: number;
      name: string;
      unit: {
        id: number;
        name: string;
        plural: string;
      };
      units: number[];
    }[];
    nutritionalValues: {
      calories: number;
      carbs: number;
      fat: number;
      fiber: number;
      protein: number;
      sodium: number;
    };
  }[];
  goals: {
    calories: number;
  };
  summary: {
    calories: number;
    carbs: number;
    fat: number;
    fiber: number;
    protein: number;
    sodium: number;
    water: number;
  };
};

export type Water = {
  summary: {
    water: number;
  };
  water: {
    amount: number;
    logID: number;
  }[];
};

export type Temperature = {
  tempCore: {
    dateTime: string;
    value: number;
  }[];
};

export type Devices = {
  devices: {
    battery: string;
    batteryLevel: number;
    deviceVersion: string;
    features: [];
    id: string;
    lastSyncTime: string;
    mac: string;
    type: string;
  }[];
};

// Define HeartRate type, **START**
export type HeartRate = {
  activitiesHeart: HeartActivity[];
};

export type HeartRateZone = {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
};

// Define a type for the value object in activitiesHeart
export type HeartRateValue = {
  customHeartRateZones: HeartRateZone[];
  heartRateZones: HeartRateZone[];
  restingHeartRate: number;
};

// Define a type for an activity in activitiesHeart
export type HeartActivity = {
  dateTime: string;
  value: HeartRateValue;
};
//**END**

//Profile type, **START**
export type Profile = {
  user: {
    aboutMe: any; // Replace 'any' with the appropriate type if known
    age: any;
    ambassador: any;
    autoStrideEnabled: any;
    avatar: string;
    avatar150: string;
    avatar640: string;
    averageDailySteps: any;
    challengesBeta: any;
    clockTimeDisplayFormat: any;
    country: any;
    corporate: any;
    corporateAdmin: any;
    dateOfBirth: any;
    displayName: any;
    displayNameSetting: any;
    distanceUnit: any;
    encodedId: any;
    features: Features;
    firstName: any;
    foodsLocale: any;
    fullName: any;
    gender: any;
    glucoseUnit: any;
    height: any;
    heightUnit: any;
    isBugReportEnabled: any;
    isChild: any;
    isCoach: any;
    languageLocale: any;
    lastName: any;
    legalTermsAcceptRequired: any;
    locale: any;
    memberSince: any;
    mfaEnabled: any;
    offsetFromUTCMillis: any;
    sdkDeveloper: any;
    sleepTracking: any;
    startDayOfWeek: any;
    state: any;
    strideLengthRunning: any;
    strideLengthRunningType: any;
    strideLengthWalking: any;
    strideLengthWalkingType: any;
    swimUnit: any;
    temperatureUnit: any;
    timezone: any;
    topBadges: Badge[];
    waterUnit: any;
    waterUnitName: any;
    weight: any;
    weightUnit: any;
  };
};

export type Badge = {
  // Define the structure of the badge if known, or use any if the structure is not specified
  [key: string]: any;
};

export type Features = {
  exerciseGoal: any; // Replace 'any' with the appropriate type if known
};
//**END**

export type Breathing = {
  br: {
    value: {
      breathingRate: number;
    };
    dateTime: string;
  }[];
};

// Activity type, **START**
export type Activity = {
  activities: any[]; // Assuming activities is an array, but its structure is not specified
  goals: Goals;
  summary: Summary;
};

// Define a type for Distance
type Distance = {
  activity: string;
  distance: number;
};

// Define a type for Goals
type Goals = {
  activeMinutes: number;
  caloriesOut: number;
  distance: number;
  floors: number;
  steps: number;
};

// Define a type for Summary
type Summary = {
  activeScore: number;
  activityCalories: number;
  calorieEstimationMu: number;
  caloriesBMR: number;
  caloriesOut: number;
  caloriesOutUnestimated: number;
  customHeartRateZones: HeartRateZone[];
  distances: Distance[];
  elevation: number;
  fairlyActiveMinutes: number;
  floors: number;
  heartRateZones: HeartRateZone[];
  lightlyActiveMinutes: number;
  marginalCalories: number;
  restingHeartRate: number;
  sedentaryMinutes: number;
  steps: number;
  useEstimation: boolean;
  veryActiveMinutes: number;
};
//**END**

//oxygen saturation type
export type OxygenSaturation = {
  dateTime: string;
  value: {
    avg: number;
    min: number;
    max: number;
  };
};

//weight type
export type Weight = {
  weight: {
    bmi: number;
    date: string;
    fat: number;
    logId: number;
    time: string;
    weight: number;
  }[];
};
