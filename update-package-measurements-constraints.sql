-- Update package_measurements constraints to make dimensions optional
-- Allow NULL or 0 values for length, width, height when only weight is provided

-- Drop existing constraints
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_height_check;
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_length_check;
ALTER TABLE package_measurements DROP CONSTRAINT IF EXISTS package_measurements_width_check;

-- Add new constraints that allow 0 or NULL for dimensions
ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_height_check 
  CHECK (height IS NULL OR height >= 0);

ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_length_check 
  CHECK (length IS NULL OR length >= 0);

ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_width_check 
  CHECK (width IS NULL OR width >= 0);

-- Keep the piece_number constraint as it should always be > 0
-- ALTER TABLE package_measurements ADD CONSTRAINT package_measurements_piece_number_check 
--   CHECK ((piece_number > 0));
