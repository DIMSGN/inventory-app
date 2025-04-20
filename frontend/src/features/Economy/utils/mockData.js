/**
 * Mock data for Economy feature when API is not available
 */

/**
 * Mock financial data for development and testing
 */

export const MOCK_FINANCIAL_DATA = {
  year: 2023,
  categories: {
    sales: {
      name: 'ΠΩΛΗΣΕΙΣ',
      subcategories: {
        food: {
          name: 'FOOD',
          values: {
            1: 12500, 2: 13200, 3: 15400, 4: 16800, 5: 18900, 6: 22500,
            7: 27800, 8: 29500, 9: 21300, 10: 17400, 11: 14600, 12: 15800
          }
        },
        wine: {
          name: 'WINE',
          values: {
            1: 3400, 2: 3600, 3: 4200, 4: 4500, 5: 5300, 6: 6100,
            7: 7800, 8: 8200, 9: 5900, 10: 4800, 11: 4100, 12: 4500
          }
        },
        drinks: {
          name: 'ΠΟΤΑ',
          values: {
            1: 5100, 2: 5300, 3: 6100, 4: 6700, 5: 7800, 6: 9500,
            7: 12800, 8: 13600, 9: 8900, 10: 7200, 11: 5800, 12: 6900
          }
        },
        beer: {
          name: 'ΜΠΥΡΕΣ',
          values: {
            1: 2800, 2: 3000, 3: 3500, 4: 4200, 5: 5500, 6: 7200,
            7: 9100, 8: 9800, 9: 6200, 10: 4600, 11: 3400, 12: 3800
          }
        },
        cafe: {
          name: 'CAFE',
          values: {
            1: 4200, 2: 4300, 3: 4500, 4: 4800, 5: 5200, 6: 5600,
            7: 6100, 8: 6300, 9: 5400, 10: 4800, 11: 4300, 12: 4400
          }
        }
      }
    },
    costs: {
      name: 'ΚΟΣΤΟΣ ΠΩΛΗΘΕΝΤΩΝ',
      subcategories: {
        food: {
          name: 'ΚΟΣΤΟΣ FOOD',
          values: {
            1: 4800, 2: 5100, 3: 5900, 4: 6500, 5: 7300, 6: 8700,
            7: 10700, 8: 11300, 9: 8200, 10: 6700, 11: 5600, 12: 6100
          }
        },
        wine: {
          name: 'ΚΟΣΤΟΣ WINE',
          values: {
            1: 1900, 2: 2000, 3: 2300, 4: 2500, 5: 2900, 6: 3400,
            7: 4300, 8: 4500, 9: 3300, 10: 2700, 11: 2300, 12: 2500
          }
        },
        drinks: {
          name: 'ΚΟΣΤΟΣ ΠΟΤΩΝ',
          values: {
            1: 2200, 2: 2300, 3: 2600, 4: 2900, 5: 3400, 6: 4100,
            7: 5500, 8: 5900, 9: 3800, 10: 3100, 11: 2500, 12: 3000
          }
        },
        beer: {
          name: 'ΚΟΣΤΟΣ ΜΠΥΡΩΝ',
          values: {
            1: 1100, 2: 1200, 3: 1400, 4: 1700, 5: 2200, 6: 2900,
            7: 3600, 8: 3900, 9: 2500, 10: 1800, 11: 1400, 12: 1500
          }
        },
        cafe: {
          name: 'ΚΟΣΤΟΣ CAFE',
          values: {
            1: 1600, 2: 1600, 3: 1700, 4: 1800, 5: 2000, 6: 2100,
            7: 2300, 8: 2400, 9: 2100, 10: 1800, 11: 1600, 12: 1700
          }
        }
      }
    },
    labor: {
      name: 'ΕΡΓΑΤΙΚΑ',
      subcategories: {
        salaries: {
          name: 'ΜΙΣΘΟΙ',
          values: {
            1: 8500, 2: 8500, 3: 8500, 4: 8700, 5: 9500, 6: 11200,
            7: 12800, 8: 12800, 9: 9800, 10: 8700, 11: 8500, 12: 8500
          }
        },
        benefits: {
          name: 'ΕΠΙΔΟΜΑΤΑ',
          values: {
            1: 800, 2: 800, 3: 800, 4: 800, 5: 1000, 6: 1300,
            7: 1500, 8: 1500, 9: 1000, 10: 800, 11: 800, 12: 1200
          }
        },
        taxes: {
          name: 'ΑΣΦΑΛΙΣΤΙΚΑ',
          values: {
            1: 2500, 2: 2500, 3: 2500, 4: 2600, 5: 2800, 6: 3300,
            7: 3800, 8: 3800, 9: 2900, 10: 2600, 11: 2500, 12: 2500
          }
        }
      }
    },
    operating: {
      name: 'ΛΕΙΤΟΥΡΓΙΚΑ ΕΞΟΔΑ',
      subcategories: {
        rent: {
          name: 'ΕΝΟΙΚΙΑ',
          values: {
            1: 3500, 2: 3500, 3: 3500, 4: 3500, 5: 3500, 6: 3500,
            7: 3500, 8: 3500, 9: 3500, 10: 3500, 11: 3500, 12: 3500
          }
        },
        utilities: {
          name: 'ΡΕΥΜΑ/ΝΕΡΟ',
          values: {
            1: 1800, 2: 1700, 3: 1600, 4: 1500, 5: 1600, 6: 2100,
            7: 2800, 8: 2900, 9: 2200, 10: 1700, 11: 1600, 12: 1900
          }
        },
        marketing: {
          name: 'ΜΑΡΚΕΤΙΝΓΚ',
          values: {
            1: 900, 2: 900, 3: 1200, 4: 1500, 5: 1800, 6: 2000,
            7: 2000, 8: 2000, 9: 1500, 10: 1200, 11: 900, 12: 1500
          }
        },
        maintenance: {
          name: 'ΣΥΝΤΗΡΗΣΗ',
          values: {
            1: 800, 2: 600, 3: 700, 4: 900, 5: 1200, 6: 1500,
            7: 1800, 8: 1600, 9: 1200, 10: 900, 11: 700, 12: 600
          }
        },
        other: {
          name: 'ΔΙΑΦΟΡΑ',
          values: {
            1: 1200, 2: 1100, 3: 1300, 4: 1500, 5: 1700, 6: 1900,
            7: 2200, 8: 2300, 9: 1800, 10: 1500, 11: 1300, 12: 1400
          }
        }
      }
    }
  },
  updatedAt: '2023-12-31T23:59:59.999Z'
};

export const MOCK_DAILY_LOGS = [
  {
    id: '1',
    date: '2023-06-01',
    sales: {
      food: 650,
      wine: 280,
      drinks: 420,
      beer: 350,
      cafe: 120
    },
    notes: 'Busy Thursday evening, two large parties',
    createdBy: 'user1',
    createdAt: '2023-06-01T23:45:00.000Z'
  },
  {
    id: '2',
    date: '2023-06-02',
    sales: {
      food: 580,
      wine: 320,
      drinks: 380,
      beer: 290,
      cafe: 150
    },
    notes: 'Rainy day, slower than usual',
    createdBy: 'user2',
    createdAt: '2023-06-02T23:30:00.000Z'
  },
  {
    id: '3',
    date: '2023-06-03',
    sales: {
      food: 820,
      wine: 450,
      drinks: 580,
      beer: 420,
      cafe: 180
    },
    notes: 'Saturday, fully booked',
    createdBy: 'user1',
    createdAt: '2023-06-03T23:55:00.000Z'
  }
];

export const MOCK_MONTHLY_EXPENSE_BREAKDOWN = {
  month: 6,
  year: 2023,
  categories: {
    ingredients: {
      name: 'Πρώτες Ύλες',
      total: 6080,
      items: [
        { name: 'Κρέατα', amount: 2200 },
        { name: 'Λαχανικά', amount: 1450 },
        { name: 'Γαλακτοκομικά', amount: 980 },
        { name: 'Ποτά', amount: 950 },
        { name: 'Λοιπά Τρόφιμα', amount: 500 }
      ]
    },
    labor: {
      name: 'Μισθοδοσία',
      total: 16900,
      items: [
        { name: 'Μάγειρες', amount: 6500 },
        { name: 'Σερβιτόροι', amount: 5800 },
        { name: 'Μπαρίστες', amount: 4800 }
      ]
    },
    fixed: {
      name: 'Σταθερά Έξοδα',
      total: 5590,
      items: [
        { name: 'Ενοίκιο', amount: 2500 },
        { name: 'Λογαριασμοί', amount: 1600 },
        { name: 'Συντήρηση', amount: 450 },
        { name: 'Λογιστικά', amount: 400 },
        { name: 'Τηλέφωνο', amount: 120 },
        { name: 'Καθαριότητα', amount: 450 },
        { name: 'Λοιπά', amount: 750 }
      ]
    }
  }
};

export const MOCK_MONTHLY_REVENUE_BREAKDOWN = {
  month: 6,
  year: 2023,
  categories: {
    food: {
      name: 'Φαγητό',
      total: 15200,
      items: [
        { name: 'Κύρια Πιάτα', amount: 8500 },
        { name: 'Ορεκτικά', amount: 3200 },
        { name: 'Επιδόρπια', amount: 2100 },
        { name: 'Παιδικά Μενού', amount: 1400 }
      ]
    },
    drinks: {
      name: 'Ποτά & Αναψυκτικά',
      total: 19500,
      items: [
        { name: 'Κρασιά', amount: 5800 },
        { name: 'Cocktails', amount: 7200 },
        { name: 'Μπύρες', amount: 6500 }
      ]
    },
    cafe: {
      name: 'Καφές & Αφεψήματα',
      total: 3200,
      items: [
        { name: 'Espresso', amount: 1200 },
        { name: 'Cappuccino', amount: 850 },
        { name: 'Τσάι & Άλλα', amount: 650 },
        { name: 'Specialty', amount: 500 }
      ]
    },
    events: {
      name: 'Εκδηλώσεις',
      total: 12500,
      items: [
        { name: 'Γαμήλιο Δείπνο', amount: 8500 },
        { name: 'Εταιρική Εκδήλωση', amount: 4000 }
      ]
    }
  },
  paymentMethods: {
    cash: 12500,
    card: 35400,
    other: 2500
  }
};

export const generateDefaultTemplate = (year) => {
  // Create months array (1-12)
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // Define categories with default values
  const categories = {
    sales: {
      name: 'ΠΩΛΗΣΕΙΣ',
      subcategories: {
        food: { name: 'FOOD', values: {} },
        wine: { name: 'WINE', values: {} },
        drinks: { name: 'ΠΟΤΑ', values: {} },
        beer: { name: 'ΜΠΥΡΕΣ', values: {} },
        cafe: { name: 'CAFE', values: {} },
        events: { name: 'EVENTS', values: {} }
      }
    },
    costs: {
      name: 'ΚΟΣΤΟΣ ΑΓΑΘΩΝ',
      subcategories: {
        food: { name: 'FOOD', values: {} },
        wine: { name: 'WINE', values: {} },
        drinks: { name: 'ΠΟΤΑ', values: {} },
        beer: { name: 'ΜΠΥΡΕΣ', values: {} },
        cafe: { name: 'CAFE', values: {} }
      }
    },
    labor: {
      name: 'ΕΡΓΑΤΙΚΟ ΚΟΣΤΟΣ',
      subcategories: {
        kitchen: { name: 'ΚΟΥΖΙΝΑ', values: {} },
        service: { name: 'ΣΕΡΒΙΣ', values: {} },
        bar: { name: 'ΜΠΑΡ', values: {} },
        management: { name: 'ΔΙΟΙΚΗΣΗ', values: {} }
      }
    },
    operating: {
      name: 'ΛΕΙΤΟΥΡΓΙΚΑ',
      subcategories: {
        rent: { name: 'ΕΝΟΙΚΙΟ', values: {} },
        utilities: { name: 'ΔΕΗ/ΝΕΡΟ', values: {} },
        internet: { name: 'INTERNET/ΤΗΛΕΦΩΝΟ', values: {} },
        maintenance: { name: 'ΣΥΝΤΗΡΗΣΗ', values: {} },
        cleaning: { name: 'ΚΑΘΑΡΙΟΤΗΤΑ', values: {} },
        marketing: { name: 'MARKETING', values: {} },
        accounting: { name: 'ΛΟΓΙΣΤΙΚΑ', values: {} },
        other: { name: 'ΛΟΙΠΑ ΕΞΟΔΑ', values: {} }
      }
    }
  };
  
  // Initialize all values to 0
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    Object.keys(category.subcategories).forEach(subcategoryKey => {
      const subcategory = category.subcategories[subcategoryKey];
      months.forEach(month => {
        subcategory.values[month] = 0;
      });
    });
  });
  
  return {
    year,
    categories,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Mock operating expense categories
 */
export const OPERATING_EXPENSE_TYPES = [
  'Ενοικίαση',
  'Ηλεκτρισμός',
  'Νερό',
  'Τηλεπικοινωνίες',
  'Προμήθειες Κουζίνας',
  'Προμήθειες Μπαρ',
  'Καθαριστικά',
  'Συντήρηση',
  'Μάρκετινγκ',
  'Ασφάλιση',
  'Άδειες',
  'Λογιστικά',
  'Μεταφορικά',
  'Άλλο'
];

/**
 * Mock employee positions
 */
export const EMPLOYEE_POSITIONS = [
  'Μάγειρας',
  'Βοηθός Μάγειρα',
  'Σερβιτόρος',
  'Μπάρμαν',
  'Ταμίας',
  'Διοίκηση',
  'Καθαριότητα',
  'Άλλο'
];

/**
 * Predefined financial data templates by category
 */
export const FINANCIAL_TEMPLATES = {
  sales: {
    restaurant: {
      food: { name: 'FOOD' },
      wine: { name: 'WINE' },
      drinks: { name: 'ΠΟΤΑ' },
      beer: { name: 'ΜΠΥΡΕΣ' },
      cafe: { name: 'CAFE' }
    },
    retail: {
      products: { name: 'ΠΡΟΪΟΝΤΑ' },
      services: { name: 'ΥΠΗΡΕΣΙΕΣ' }
    }
  },
  costs: {
    restaurant: {
      food: { name: 'ΚΟΣΤΟΣ FOOD' },
      wine: { name: 'ΚΟΣΤΟΣ WINE' },
      drinks: { name: 'ΚΟΣΤΟΣ ΠΟΤΩΝ' },
      beer: { name: 'ΚΟΣΤΟΣ ΜΠΥΡΩΝ' },
      cafe: { name: 'ΚΟΣΤΟΣ CAFE' }
    },
    retail: {
      inventory: { name: 'ΑΠΟΘΕΜΑ' },
      packaging: { name: 'ΣΥΣΚΕΥΑΣΙΑ' }
    }
  },
  labor: {
    standard: {
      salaries: { name: 'ΜΙΣΘΟΙ' },
      benefits: { name: 'ΕΠΙΔΟΜΑΤΑ' },
      taxes: { name: 'ΑΣΦΑΛΙΣΤΙΚΑ' }
    }
  },
  operating: {
    standard: {
      rent: { name: 'ΕΝΟΙΚΙΑ' },
      utilities: { name: 'ΚΟΙΝΟΧΡΗΣΤΑ' },
      marketing: { name: 'ΜΑΡΚΕΤΙΝΓΚ' },
      maintenance: { name: 'ΣΥΝΤΗΡΗΣΗ' },
      other: { name: 'ΔΙΑΦΟΡΑ' }
    }
  }
};

/**
 * Sample monthly comparison data
 */
export const SAMPLE_COMPARISON_DATA = {
  year: 2023,
  previousYear: 2022,
  month: 6, // June
  categories: {
    sales: {
      current: 50900,
      previous: 46200,
      percentChange: 10.17
    },
    costs: {
      current: 21200,
      previous: 19800,
      percentChange: 7.07
    },
    labor: {
      current: 15800,
      previous: 14500,
      percentChange: 8.97
    },
    operating: {
      current: 11000,
      previous: 10200,
      percentChange: 7.84
    }
  },
  totals: {
    revenue: {
      current: 50900,
      previous: 46200,
      percentChange: 10.17
    },
    expenses: {
      current: 48000,
      previous: 44500,
      percentChange: 7.87
    },
    profit: {
      current: 2900,
      previous: 1700,
      percentChange: 70.59
    }
  },
  metrics: {
    grossProfitMargin: {
      current: 58.35,
      previous: 57.14,
      percentChange: 2.12
    },
    netProfitMargin: {
      current: 5.70,
      previous: 3.68,
      percentChange: 54.89
    }
  }
};

export default {
  MOCK_FINANCIAL_DATA,
  OPERATING_EXPENSE_TYPES,
  EMPLOYEE_POSITIONS,
  FINANCIAL_TEMPLATES,
  SAMPLE_COMPARISON_DATA
}; 