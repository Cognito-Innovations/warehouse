-- Fix package_measurements constraints
-- Make dimensions (length, width, height) optional
-- Make volumetric_weight optional
-- Only weight should be required

-- Drop existing constraints
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_height_check;
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_length_check;
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_width_check;

-- Add new constraints that allow NULL or 0 for optional fields
ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_height_check 
  CHECK (height IS NULL OR height >= 0);

ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_length_check 
  CHECK (length IS NULL OR length >= 0);

ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_width_check 
  CHECK (width IS NULL OR width >= 0);

-- Note: weight should always be > 0, but we'll handle this in the application logic
