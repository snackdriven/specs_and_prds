# Chore Template Library

## Design Principles

**ADHD-Friendly Chore Management:**
- Break overwhelming tasks into small steps
- Clear time estimates per subtask
- Visual progress tracking
- Flexible completion (all at once or step-by-step)
- Metric tracking integrated naturally

**Proactive Maintenance Philosophy:**
- Remind 7 days before due
- Show cost estimates upfront
- Track history and patterns
- Learn optimal intervals over time

---

## Chore Template Structure

```typescript
interface ChoreTemplate {
  id: string
  name: string
  category: 'vehicle' | 'home' | 'health' | 'equipment' | 'pet' | 'other'
  description: string
  defaultInterval: IntervalConfig
  subtasks: ChoreSubtask[]
  estimatedMinutes: number
  costEstimate?: { min: number, max: number, currency: 'USD' }
  difficulty: 'easy' | 'medium' | 'hard'
  requiredMetrics: MetricField[]
  optionalMetrics: MetricField[]
  seasonalVariations?: SeasonalVariation[]
  externalDependency: boolean // Requires scheduling someone?
  safetyNotes?: string
  icon: string
  color: string
}

interface ChoreSubtask {
  id: string
  title: string
  description?: string
  estimatedMinutes?: number
  optional: boolean
  order: number
  requiresPhoto?: boolean // Document completion
  metricCapture?: string // Which metric to record at this step
  safetyWarning?: string
}

interface IntervalConfig {
  value: number
  unit: 'days' | 'weeks' | 'months' | 'miles' | 'hours'
  flexible: boolean // Can user adjust easily?
}

interface MetricField {
  key: string
  label: string
  type: 'number' | 'currency' | 'text' | 'photo'
  unit?: string
  required: boolean
}

interface SeasonalVariation {
  season: 'spring' | 'summer' | 'fall' | 'winter'
  adjustedSubtasks?: ChoreSubtask[] // Different steps
  notes?: string
}
```

---

## Vehicle Maintenance Templates (6)

### 1. Oil Change

**Category:** Vehicle
**Interval:** Every 5,000 miles or 6 months
**Estimated Time:** 45-60 minutes (DIY) or 30-45 minutes (shop)
**Cost:** $30-$80 (shop), $20-$40 (DIY)
**Difficulty:** Medium
**Icon:** 🚗 | **Color:** Black (#2C3E50)

**External Dependency:** No (DIY) or Yes (shop appointment)

**Required Metrics:**
- `odometer` (number, miles)
- `cost` (currency, USD)
- `completion_date` (auto-captured)

**Optional Metrics:**
- `service_provider` (text)
- `oil_type` (text, e.g., "5W-30 synthetic")
- `receipt_photo` (photo)

**Subtasks (DIY Version):**
1. **Gather Supplies** (10 min, required)
   - Description: "New oil filter, correct oil (check manual), drain pan, wrench, funnel, rags"
   - Safety: "Ensure car is on level ground"

2. **Warm Up Engine** (5 min, required)
   - Description: "Run engine 2-3 minutes to warm oil (flows easier)"
   - Safety: "Don't let it get too hot - burns risk"

3. **Drain Old Oil** (10 min, required)
   - Description: "Place drain pan, remove drain plug, let oil drain completely"
   - Metric Capture: None
   - Safety: "Oil may be hot - wear gloves"

4. **Replace Oil Filter** (10 min, required)
   - Description: "Remove old filter, lubricate new filter gasket, install new filter"
   - Requires Photo: Yes (document old filter condition)

5. **Add New Oil** (10 min, required)
   - Description: "Replace drain plug, add new oil per manual specs, check dipstick"
   - Metric Capture: `oil_type`

6. **Dispose Old Oil** (10 min, optional)
   - Description: "Take old oil to auto parts store or recycling center"

7. **Update Maintenance Log** (5 min, required)
   - Description: "Record mileage, date, oil type"
   - Metric Capture: `odometer`, `cost`

**Subtasks (Shop Version):**
1. **Schedule Appointment** (5 min, required)
   - Description: "Call or book online with preferred shop"
   - Metric Capture: `service_provider`

2. **Drop Off Vehicle** (10 min, required)
   - Description: "Bring vehicle to shop, note current mileage"
   - Metric Capture: `odometer`

3. **Pick Up & Review** (15 min, required)
   - Description: "Review service report, ask about any issues found"
   - Metric Capture: `cost`
   - Requires Photo: Yes (receipt)

4. **Update Records** (5 min, required)
   - Description: "Note service date, mileage, next due date"

---

### 2. Tire Rotation

**Category:** Vehicle
**Interval:** Every 6,000 miles or 6 months
**Estimated Time:** 60 minutes (DIY) or 30 minutes (shop)
**Cost:** $20-$50 (shop), Free (DIY if you have tools)
**Difficulty:** Medium-Hard
**Icon:** 🛞 | **Color:** Dark Gray (#34495E)

**External Dependency:** No (DIY) or Yes (shop)

**Required Metrics:**
- `odometer` (number, miles)
- `cost` (currency, USD)
- `tire_condition_notes` (text)

**Optional Metrics:**
- `tire_pressure_front_left` (number, PSI)
- `tire_pressure_front_right` (number, PSI)
- `tire_pressure_rear_left` (number, PSI)
- `tire_pressure_rear_right` (number, PSI)
- `tread_depth` (number, mm)

**Subtasks:**
1. **Check Tire Pressure (All 4)** (10 min, required)
   - Description: "Check and record pressure for each tire"
   - Metric Capture: Tire pressure fields
   - Safety: "Check when tires are cold"

2. **Inspect Tread Wear** (10 min, required)
   - Description: "Look for uneven wear, damage, objects"
   - Metric Capture: `tread_depth`, `tire_condition_notes`
   - Requires Photo: Yes (any damage)

3. **Rotate Tires (Per Manual Pattern)** (30 min, required)
   - Description: "Follow rotation pattern in owner's manual"
   - Safety: "Use jack stands, never rely on jack alone"

4. **Re-Torque Lug Nuts** (5 min, required)
   - Description: "Torque to spec after 50 miles"
   - Safety: "Critical safety step - don't skip"

5. **Update Records** (5 min, required)
   - Description: "Log mileage, date, next due"
   - Metric Capture: `odometer`, `cost`

---

### 3. State Vehicle Inspection

**Category:** Vehicle
**Interval:** Annually (varies by state)
**Estimated Time:** 45-90 minutes
**Cost:** $15-$50
**Difficulty:** Easy
**Icon:** 📋 | **Color:** Blue (#3498DB)

**External Dependency:** Yes (inspection station)

**Required Metrics:**
- `cost` (currency, USD)
- `passed` (boolean)
- `expiration_date` (date)
- `odometer` (number, miles)

**Optional Metrics:**
- `inspection_station` (text)
- `failed_items` (text, if applicable)
- `receipt_photo` (photo)

**Subtasks:**
1. **Pre-Check Vehicle** (15 min, required)
   - Description: "Check all lights, wipers, tire pressure, fluid levels"
   - Notes: "Fix obvious issues before inspection"

2. **Schedule Inspection** (5 min, required)
   - Description: "Book appointment or visit walk-in station"
   - Metric Capture: `inspection_station`

3. **Get Inspection** (30-60 min, required)
   - Description: "Complete state-required inspection"
   - Metric Capture: `passed`, `cost`, `odometer`

4. **Address Failures (if needed)** (variable, optional)
   - Description: "Repair failed items and re-inspect"
   - Metric Capture: `failed_items`

5. **Update Registration** (5 min, required)
   - Description: "Place new sticker, record expiration"
   - Metric Capture: `expiration_date`
   - Requires Photo: Yes (new inspection sticker)

---

### 4. Brake Inspection

**Category:** Vehicle
**Interval:** Every 12 months or 12,000 miles
**Estimated Time:** 30-45 minutes (inspection only)
**Cost:** $0-$30 (inspection), $150-$400 (if replacement needed)
**Difficulty:** Medium
**Icon:** 🛑 | **Color:** Red (#E74C3C)

**External Dependency:** Yes (professional inspection recommended)

**Required Metrics:**
- `odometer` (number, miles)
- `pad_thickness_front` (number, mm)
- `pad_thickness_rear` (number, mm)
- `replacement_needed` (boolean)

**Optional Metrics:**
- `rotor_condition` (text)
- `brake_fluid_level` (text: "full", "low", "needs replacement")
- `cost` (currency, USD)

**Subtasks:**
1. **Visual Inspection** (10 min, required)
   - Description: "Look through wheels at brake pads, rotors"
   - Metric Capture: Initial condition notes

2. **Professional Inspection** (20 min, required)
   - Description: "Have mechanic measure pad thickness, check rotors"
   - Metric Capture: `pad_thickness_front`, `pad_thickness_rear`, `rotor_condition`
   - Requires Photo: Yes (inspection report)

3. **Schedule Replacement (if needed)** (10 min, optional)
   - Description: "Book brake service if pads <3mm or rotors damaged"
   - Metric Capture: `replacement_needed`, `cost`

4. **Update Records** (5 min, required)
   - Description: "Log inspection date, measurements, next check due"
   - Metric Capture: `odometer`

---

### 5. Battery Test

**Category:** Vehicle
**Interval:** Every 6 months (especially before winter/summer)
**Estimated Time:** 15-20 minutes
**Cost:** Free (auto parts store) or $100-200 (replacement)
**Difficulty:** Easy
**Icon:** 🔋 | **Color:** Yellow (#F1C40F)

**External Dependency:** No (can test at auto parts store for free)

**Required Metrics:**
- `battery_age_months` (number)
- `voltage` (number, volts)
- `test_result` (text: "good", "weak", "replace soon", "replace now")

**Optional Metrics:**
- `cold_cranking_amps` (number, CCA)
- `replacement_cost` (currency, USD)
- `battery_brand` (text)

**Subtasks:**
1. **Clean Battery Terminals** (10 min, required)
   - Description: "Remove corrosion with wire brush, baking soda solution"
   - Safety: "Wear gloves and eye protection"

2. **Test Battery** (10 min, required)
   - Description: "Drive to auto parts store for free load test"
   - Metric Capture: `voltage`, `test_result`, `cold_cranking_amps`
   - Requires Photo: Yes (test results printout)

3. **Replace Battery (if needed)** (20 min, optional)
   - Description: "Purchase and install new battery"
   - Metric Capture: `replacement_cost`, `battery_brand`, reset `battery_age_months` to 0

4. **Update Records** (5 min, required)
   - Description: "Log test date, voltage, age, next test due"
   - Metric Capture: `battery_age_months`

---

### 6. Air Filter Replacement

**Category:** Vehicle
**Interval:** Every 12 months or 15,000 miles
**Estimated Time:** 10-15 minutes (DIY)
**Cost:** $15-$30 (DIY), $30-$50 (shop)
**Difficulty:** Easy
**Icon:** 💨 | **Color:** Light Gray (#95A5A6)

**External Dependency:** No (very easy DIY)

**Required Metrics:**
- `odometer` (number, miles)
- `cost` (currency, USD)

**Optional Metrics:**
- `filter_brand` (text)
- `old_filter_condition_photo` (photo)

**Subtasks:**
1. **Purchase Correct Filter** (10 min, required)
   - Description: "Check owner's manual or auto parts store lookup"
   - Metric Capture: `filter_brand`, `cost`

2. **Locate Air Filter Housing** (2 min, required)
   - Description: "Open hood, find air filter box (check manual)"

3. **Remove Old Filter** (3 min, required)
   - Description: "Unclip housing, remove old filter"
   - Requires Photo: Yes (old filter condition)

4. **Install New Filter** (3 min, required)
   - Description: "Place new filter, ensure proper seating, close housing"

5. **Update Records** (2 min, required)
   - Description: "Log date, mileage, next replacement due"
   - Metric Capture: `odometer`

---

## Home Maintenance Templates (6)

### 7. HVAC System Service

**Category:** Home
**Interval:** Annually (spring for AC, fall for heating)
**Estimated Time:** 60-90 minutes (professional service)
**Cost:** $80-$150 per visit
**Difficulty:** N/A (professional required)
**Icon:** ❄️ | **Color:** Cyan (#00BCD4)

**External Dependency:** Yes (HVAC technician)

**Seasonal Variations:**
- **Spring:** AC focus (coolant levels, condensate drain, outdoor unit)
- **Fall:** Heating focus (heat exchanger, ignition, thermostat)

**Required Metrics:**
- `service_date` (date)
- `cost` (currency, USD)
- `service_provider` (text)
- `issues_found` (text)

**Optional Metrics:**
- `filter_replaced` (boolean)
- `coolant_added` (boolean)
- `next_service_date` (date)
- `receipt_photo` (photo)

**Subtasks:**
1. **Replace Filter (Pre-Service)** (10 min, required)
   - Description: "Install fresh filter before tech arrives"
   - Metric Capture: `filter_replaced`

2. **Schedule Service** (10 min, required)
   - Description: "Book annual maintenance with HVAC company"
   - Metric Capture: `service_provider`, `service_date`

3. **Professional Inspection** (60 min, required)
   - Description: "Tech inspects, cleans, tests system"
   - Notes: "Be present to ask questions"

4. **Review Service Report** (10 min, required)
   - Description: "Understand findings, recommendations, warranty"
   - Metric Capture: `issues_found`, `cost`
   - Requires Photo: Yes (service report)

5. **Schedule Repairs (if needed)** (10 min, optional)
   - Description: "Book follow-up if major issues found"

6. **Update Records** (5 min, required)
   - Description: "Log service date, findings, next service due"
   - Metric Capture: `next_service_date`

---

### 8. Clean Gutters

**Category:** Home
**Interval:** Twice yearly (spring and fall)
**Estimated Time:** 2-4 hours
**Cost:** $100-$200 (professional) or $0-$30 (DIY cleaning supplies)
**Difficulty:** Medium-Hard (height, physical)
**Icon:** 🏠 | **Color:** Brown (#8D6E63)

**External Dependency:** Optional (can hire service)

**Seasonal Variations:**
- **Spring:** Remove winter debris, check for ice damage
- **Fall:** Remove leaves, prepare for winter

**Required Metrics:**
- `completion_date` (date)
- `debris_amount` (text: "light", "moderate", "heavy")
- `damage_found` (boolean)

**Optional Metrics:**
- `cost` (currency, USD, if hired service)
- `service_provider` (text)
- `damage_photos` (photo)
- `cleaned_downspouts` (boolean)

**Subtasks:**
1. **Safety Setup** (15 min, required)
   - Description: "Stable ladder, gloves, eye protection, someone home"
   - Safety: "Never work alone on ladder, check ladder stability"

2. **Remove Debris from Gutters** (60-120 min, required)
   - Description: "Scoop out leaves, twigs, buildup"
   - Metric Capture: `debris_amount`
   - Requires Photo: Yes (before and after)

3. **Flush Gutters with Hose** (30 min, required)
   - Description: "Run water through gutters, check for leaks"
   - Metric Capture: `damage_found`

4. **Clean Downspouts** (30 min, required)
   - Description: "Ensure downspouts drain freely, remove clogs"
   - Metric Capture: `cleaned_downspouts`

5. **Inspect for Damage** (20 min, required)
   - Description: "Check for rust, holes, loose fasteners, sagging"
   - Metric Capture: `damage_found`
   - Requires Photo: Yes (any damage)

6. **Dispose Debris** (15 min, optional)
   - Description: "Bag and dispose of gutter debris"

7. **Update Records** (5 min, required)
   - Description: "Log completion, damage, next cleaning due"

**Seasonal Notes:**
- **Spring:** Check for winter ice damage, repair before summer storms
- **Fall:** Extra focus on leaf buildup, prepare for snow/ice

---

### 9. Replace HVAC Filter

**Category:** Home
**Interval:** Every 1-3 months (depends on filter type, pets, allergies)
**Estimated Time:** 5-10 minutes
**Cost:** $10-$30 per filter
**Difficulty:** Easy
**Icon:** 🔄 | **Color:** White (#ECF0F1)

**External Dependency:** No

**Required Metrics:**
- `replacement_date` (date)
- `filter_size` (text, e.g., "16x25x1")
- `filter_type` (text, e.g., "MERV 11", "pleated")

**Optional Metrics:**
- `cost` (currency, USD)
- `old_filter_condition` (text: "clean", "dirty", "very dirty")
- `old_filter_photo` (photo)

**Subtasks:**
1. **Purchase Correct Filter** (10 min, required)
   - Description: "Check current filter size, buy replacement"
   - Metric Capture: `filter_size`, `filter_type`, `cost`

2. **Turn Off HVAC** (1 min, required)
   - Description: "Switch thermostat to OFF"
   - Safety: "Never change filter while system running"

3. **Remove Old Filter** (2 min, required)
   - Description: "Open filter compartment, slide out old filter"
   - Requires Photo: Yes (old filter condition)
   - Metric Capture: `old_filter_condition`

4. **Install New Filter** (2 min, required)
   - Description: "Insert new filter (check airflow direction arrow)"
   - Safety: "Arrow points toward blower motor"

5. **Turn HVAC Back On** (1 min, required)
   - Description: "Restore thermostat to desired setting"

6. **Update Records** (2 min, required)
   - Description: "Log replacement date, set next reminder"
   - Metric Capture: `replacement_date`

---

### 10. Test Smoke & CO Detectors

**Category:** Home
**Interval:** Monthly (test) + Annually (battery replacement)
**Estimated Time:** 15-20 minutes
**Cost:** $0-$30 (batteries)
**Difficulty:** Easy
**Icon:** 🚨 | **Color:** Orange Red (#FF5722)

**External Dependency:** No

**Required Metrics:**
- `test_date` (date)
- `detectors_passed` (number)
- `detectors_failed` (number)

**Optional Metrics:**
- `batteries_replaced` (boolean)
- `detector_age_years` (number, for each detector)
- `failed_detector_locations` (text)

**Subtasks:**
1. **Test Each Detector** (10 min, required)
   - Description: "Press test button on each smoke/CO detector"
   - Metric Capture: `detectors_passed`, `detectors_failed`
   - Notes: "Should beep loudly within seconds"

2. **Replace Batteries (if needed)** (10 min, optional)
   - Description: "Install fresh 9V or AA batteries in any weak/dead detectors"
   - Metric Capture: `batteries_replaced`
   - Safety: "Replace all batteries annually even if working"

3. **Check Expiration Dates** (5 min, required)
   - Description: "Most detectors expire after 10 years - check manufacture date"
   - Metric Capture: `detector_age_years`
   - Notes: "Replace any over 10 years old"

4. **Replace Failed Detectors** (20 min, optional)
   - Description: "Install new detector if old one failed"
   - Metric Capture: `failed_detector_locations`

5. **Update Records** (5 min, required)
   - Description: "Log test date, results, next test due"

---

### 11. Dryer Vent Cleaning

**Category:** Home
**Interval:** Annually
**Estimated Time:** 30-60 minutes (DIY) or 45 minutes (professional)
**Cost:** $100-$150 (professional) or $20-$30 (DIY kit)
**Difficulty:** Medium
**Icon:** 🌪️ | **Color:** Blue Gray (#607D8B)

**External Dependency:** Optional

**Required Metrics:**
- `cleaning_date` (date)
- `lint_buildup` (text: "minimal", "moderate", "severe")

**Optional Metrics:**
- `vent_length_feet` (number)
- `service_provider` (text)
- `cost` (currency, USD)
- `airflow_improved` (boolean)

**Subtasks:**
1. **Disconnect Dryer** (5 min, required)
   - Description: "Unplug dryer, pull away from wall"
   - Safety: "Don't scratch floors - use furniture sliders"

2. **Clean Lint Trap Housing** (10 min, required)
   - Description: "Vacuum inside lint trap area"

3. **Clean Vent Duct** (30 min, required)
   - Description: "Use dryer vent brush or vacuum to clean duct"
   - Metric Capture: `lint_buildup`
   - Requires Photo: Yes (lint removed)

4. **Clean Exterior Vent** (10 min, required)
   - Description: "Remove exterior vent cover, clean, check flap opens freely"
   - Metric Capture: `airflow_improved`

5. **Reconnect Dryer** (5 min, required)
   - Description: "Reattach vent, plug in dryer, test run"

6. **Update Records** (5 min, required)
   - Description: "Log cleaning date, buildup severity, next cleaning due"

---

### 12. Water Heater Maintenance

**Category:** Home
**Interval:** Annually
**Estimated Time:** 30-45 minutes
**Cost:** $0 (DIY) or $100-$150 (professional)
**Difficulty:** Medium
**Icon:** 🔥 | **Color:** Red Orange (#FF6F00)

**External Dependency:** Optional (DIY possible, professional recommended)

**Required Metrics:**
- `maintenance_date` (date)
- `tank_age_years` (number)
- `sediment_amount` (text: "clear", "some sediment", "heavy sediment")

**Optional Metrics:**
- `pressure_relief_tested` (boolean)
- `anode_rod_condition` (text: "good", "worn", "needs replacement")
- `temperature_setting` (number, Fahrenheit)

**Subtasks:**
1. **Check Temperature Setting** (5 min, required)
   - Description: "Ensure set to 120°F (safety and efficiency)"
   - Metric Capture: `temperature_setting`

2. **Test Pressure Relief Valve** (5 min, required)
   - Description: "Lift valve lever briefly, should release water"
   - Metric Capture: `pressure_relief_tested`
   - Safety: "Hot water will discharge - have bucket ready"

3. **Drain Sediment** (20 min, required)
   - Description: "Attach hose, drain 2-3 gallons from tank bottom"
   - Metric Capture: `sediment_amount`
   - Requires Photo: Yes (sediment in bucket)

4. **Inspect Anode Rod (every 3-5 years)** (15 min, optional)
   - Description: "Check rod condition, replace if <1/2\" thick"
   - Metric Capture: `anode_rod_condition`
   - Notes: "Extends tank life significantly"

5. **Update Records** (5 min, required)
   - Description: "Log maintenance date, tank age, findings"
   - Metric Capture: `tank_age_years`

---

## Health Maintenance Templates (3)

### 13. Dental Checkup

**Category:** Health
**Interval:** Every 6 months
**Estimated Time:** 60 minutes (appointment)
**Cost:** $0-$150 (depends on insurance)
**Difficulty:** Easy
**Icon:** 🦷 | **Color:** White (#FAFAFA)

**External Dependency:** Yes (dentist appointment)

**Required Metrics:**
- `appointment_date` (date)
- `issues_found` (text)
- `cleaning_completed` (boolean)

**Optional Metrics:**
- `cost` (currency, USD)
- `dentist_name` (text)
- `next_appointment_date` (date)
- `x_rays_taken` (boolean)
- `follow_up_needed` (boolean)

**Subtasks:**
1. **Schedule Appointment** (5 min, required)
   - Description: "Book 6-month checkup and cleaning"
   - Metric Capture: `appointment_date`, `dentist_name`

2. **Attend Appointment** (60 min, required)
   - Description: "Cleaning, examination, any necessary x-rays"
   - Metric Capture: `cleaning_completed`, `x_rays_taken`

3. **Review Findings** (10 min, required)
   - Description: "Discuss any cavities, gum health, recommendations"
   - Metric Capture: `issues_found`, `follow_up_needed`

4. **Schedule Follow-Up (if needed)** (5 min, optional)
   - Description: "Book filling, crown, or other treatment"

5. **Schedule Next Checkup** (5 min, required)
   - Description: "Book next 6-month appointment before leaving"
   - Metric Capture: `next_appointment_date`

6. **Update Records** (5 min, required)
   - Description: "Log visit date, findings, next appointment"
   - Metric Capture: `cost`

---

### 14. Annual Physical Exam

**Category:** Health
**Interval:** Annually
**Estimated Time:** 45-60 minutes
**Cost:** $0-$200 (depends on insurance)
**Difficulty:** Easy
**Icon:** 🩺 | **Color:** Medical Blue (#2196F3)

**External Dependency:** Yes (doctor appointment)

**Required Metrics:**
- `exam_date` (date)
- `blood_pressure` (text, e.g., "120/80")
- `weight` (number, lbs)
- `health_concerns` (text)

**Optional Metrics:**
- `doctor_name` (text)
- `bloodwork_ordered` (boolean)
- `prescriptions_updated` (boolean)
- `follow_up_needed` (boolean)
- `cost` (currency, USD)

**Subtasks:**
1. **Schedule Physical** (10 min, required)
   - Description: "Book annual wellness visit with primary care"
   - Metric Capture: `exam_date`, `doctor_name`

2. **Prepare Questions** (10 min, optional)
   - Description: "List health concerns, symptoms, medication questions"

3. **Attend Appointment** (45 min, required)
   - Description: "Physical exam, vital signs, health history review"
   - Metric Capture: `blood_pressure`, `weight`, `health_concerns`

4. **Lab Work (if ordered)** (30 min, optional)
   - Description: "Bloodwork, cholesterol, blood sugar, etc."
   - Metric Capture: `bloodwork_ordered`

5. **Review Results** (15 min, required)
   - Description: "Follow up on lab results within 1-2 weeks"
   - Metric Capture: `follow_up_needed`

6. **Update Records** (5 min, required)
   - Description: "Log exam date, findings, next annual due"

---

### 15. Prescription Refills

**Category:** Health
**Interval:** Monthly or as prescribed
**Estimated Time:** 15-30 minutes
**Cost:** Varies by medication and insurance
**Difficulty:** Easy
**Icon:** 💊 | **Color:** Pill Orange (#FF9800)

**External Dependency:** Yes (pharmacy)

**Required Metrics:**
- `refill_date` (date)
- `medication_name` (text)
- `days_supply` (number)

**Optional Metrics:**
- `pharmacy_name` (text)
- `cost` (currency, USD)
- `refills_remaining` (number)
- `prescription_expires` (date)

**Subtasks:**
1. **Check Medication Levels** (2 min, required)
   - Description: "Count remaining pills, refill when 7-10 days left"

2. **Request Refill** (5 min, required)
   - Description: "Call pharmacy, use app, or request online"
   - Metric Capture: `medication_name`, `pharmacy_name`

3. **Pick Up Medication** (15 min, required)
   - Description: "Visit pharmacy or arrange delivery"
   - Metric Capture: `cost`, `days_supply`

4. **Verify Medication** (5 min, required)
   - Description: "Check name, dosage, quantity, expiration"
   - Safety: "Never take medication if anything looks wrong"

5. **Update Records** (3 min, required)
   - Description: "Log refill date, cost, next refill due"
   - Metric Capture: `refill_date`, `refills_remaining`

---

## Equipment Maintenance Templates (2)

### 16. Lawn Mower Seasonal Prep

**Category:** Equipment
**Interval:** Twice yearly (spring startup, fall winterization)
**Estimated Time:** 30-45 minutes
**Cost:** $20-$50 (oil, spark plug, fuel stabilizer)
**Difficulty:** Medium
**Icon:** 🌱 | **Color:** Green (#4CAF50)

**External Dependency:** No

**Seasonal Variations:**
- **Spring:** Fresh oil, new spark plug, sharpen blade, fresh fuel
- **Fall:** Drain fuel or add stabilizer, final oil change, clean thoroughly

**Required Metrics:**
- `maintenance_date` (date)
- `season` (text: "spring" or "fall")
- `hours_used_this_season` (number)

**Optional Metrics:**
- `blade_sharpened` (boolean)
- `spark_plug_replaced` (boolean)
- `oil_changed` (boolean)
- `cost` (currency, USD)

**Subtasks (Spring):**
1. **Change Oil** (10 min, required)
   - Description: "Drain old oil, add fresh oil per manual"
   - Metric Capture: `oil_changed`

2. **Replace Spark Plug** (5 min, required)
   - Description: "Remove old plug, gap and install new plug"
   - Metric Capture: `spark_plug_replaced`

3. **Sharpen/Replace Blade** (15 min, required)
   - Description: "Remove blade, sharpen or replace if damaged"
   - Metric Capture: `blade_sharpened`
   - Safety: "Wear gloves, disconnect spark plug wire first"

4. **Fresh Fuel** (5 min, required)
   - Description: "Add fresh gasoline (or drain if using stabilizer)"

5. **Test Start** (5 min, required)
   - Description: "Start mower, check for issues"

**Subtasks (Fall):**
1. **Final Mow & Clean** (15 min, required)
   - Description: "Final cut, clean undercarriage thoroughly"

2. **Fuel Decision** (10 min, required)
   - Description: "Either drain fuel completely OR add stabilizer and run 5 min"
   - Notes: "Prevents carburetor gumming over winter"

3. **Change Oil** (10 min, required)
   - Description: "Fresh oil for winter storage"
   - Metric Capture: `oil_changed`

4. **Store Properly** (5 min, required)
   - Description: "Dry location, covered, remove battery if applicable"

---

### 17. Computer Backup Verification

**Category:** Equipment
**Interval:** Weekly (auto-backups) + Monthly (verification)
**Estimated Time:** 20-30 minutes
**Cost:** $0 (if backup system exists)
**Difficulty:** Easy-Medium
**Icon:** 💾 | **Color:** Tech Blue (#2196F3)

**External Dependency:** No

**Required Metrics:**
- `backup_date` (date)
- `backup_successful` (boolean)
- `data_size_gb` (number)

**Optional Metrics:**
- `backup_location` (text: "external drive", "cloud", "NAS")
- `verification_method` (text: "test restore", "visual check")
- `errors_found` (text)

**Subtasks:**
1. **Check Auto-Backup Status** (5 min, required)
   - Description: "Verify automatic backups running as scheduled"
   - Metric Capture: `backup_successful`

2. **Review Backup Size** (5 min, required)
   - Description: "Ensure backup size makes sense (not too small/large)"
   - Metric Capture: `data_size_gb`

3. **Test Restore (Monthly)** (15 min, required)
   - Description: "Restore a few random files to verify backup integrity"
   - Metric Capture: `verification_method`, `errors_found`

4. **Update Backup Strategy (if needed)** (10 min, optional)
   - Description: "Add new folders, exclude unnecessary files"

5. **Update Records** (5 min, required)
   - Description: "Log verification date, results, next check due"

---

## Template Usage Guidelines

### When Creating a Chore from Template:

1. **User selects template**
2. **System pre-populates:**
   - Chore name
   - Default interval
   - All subtasks
   - Metric fields
   - Cost estimate
3. **User customizes:**
   - Adjust interval if needed
   - Add/remove/edit subtasks
   - Set first due date
   - Add personal notes
4. **System creates:**
   - Main chore task (task_type = 'maintenance')
   - Subtasks linked to parent
   - First reminder scheduled (7 days before due)

### Template Customization:

- Users can edit any template
- Save custom versions
- Share templates between devices
- Reset to defaults anytime

### Smart Features:

- **Learn optimal intervals:** If user consistently completes early/late, suggest adjustment
- **Cost tracking:** Build history of actual costs vs. estimates
- **Seasonal reminders:** Prompt spring/fall chores at appropriate times
- **Bulk scheduling:** "Schedule all vehicle maintenance" feature
