# Warehouse Package Management System - Database Schema

## Overview

This document defines the complete database schema for the Warehouse Package Management System, including both the **Normal Package** (current implementation) and **Ultimate Package** (enhanced system) table structures.

## Database Optimization Principles

- **Indexes**: Strategic indexing for frequently queried columns
- **Foreign Keys**: Proper referential integrity with cascade options
- **Data Types**: Optimized data types for storage efficiency
- **Constraints**: Data validation at database level
- **Triggers**: Automated calculations and timestamp updates
- **Partitioning**: Consider table partitioning for large datasets

---

## Supporting Tables

### Users Table (Customer Data)

```sql
-- Users Table (Customer Information)
CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    suite_no VARCHAR(100) NOT NULL, -- e.g., "102-529"
    email VARCHAR(255) UNIQUE NOT NULL,
    identifier VARCHAR(100),
    phone_number VARCHAR(50),
    phone_number_2 VARCHAR(50),
    gender VARCHAR(20),
    dob DATE,
    verified BOOLEAN DEFAULT FALSE,
    avatar VARCHAR(500),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_suite_no ON users(suite_no);
CREATE INDEX idx_users_verified ON users(verified);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
```

---

## Ultimate Package System (Enhanced)

### 1. Enhanced Main Package Table

```sql
-- Ultimate Package Table (Enhanced Implementation)
CREATE TABLE packages_ultimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_no VARCHAR(255) UNIQUE NOT NULL,
    reference_no VARCHAR(255), -- Order/Reference number from admin
    
    -- Package Status
    status VARCHAR(50) NOT NULL DEFAULT 'Action Required',
    
    -- Customer Information (Normalized)
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    
    -- Vendor/Supplier Information (Normalized)
    vendor_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
    
    -- Rack/Slot Information (Normalized)
    rack_slot_id UUID NOT NULL REFERENCES racks(id) ON DELETE RESTRICT,
    slot_info VARCHAR(255),
    warehouse_location VARCHAR(100),
    
    -- Physical Properties (Optimized)
    total_weight DECIMAL(10,3), -- In kg
    total_volumetric_weight DECIMAL(10,3), -- In kg
    dangerous_good BOOLEAN DEFAULT FALSE,
    
    -- Package Options
    country UUID NOT NULL REFERENCES country(id) ON DELETE RESTRICT
    allow_customer_items BOOLEAN DEFAULT FALSE,
    shop_invoice_received BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    
    -- Audit Fields
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_status CHECK (status IN ('Action Required', 'In Review', 'Ready to Send', 'Request Ship', 'Shipped', 'Discarded', 'Draft'))
);

-- Optimized Indexes for Ultimate Package
CREATE INDEX idx_packages_ultimate_tracking_no ON packages_ultimate(tracking_no);
CREATE INDEX idx_packages_ultimate_reference_no ON packages_ultimate(reference_no);
CREATE INDEX idx_packages_ultimate_status ON packages_ultimate(status);
CREATE INDEX idx_packages_ultimate_customer_id ON packages_ultimate(customer_id);
CREATE INDEX idx_packages_ultimate_vendor_id ON packages_ultimate(vendor_id);
CREATE INDEX idx_packages_ultimate_rack_slot_id ON packages_ultimate(rack_slot_id);
CREATE INDEX idx_packages_ultimate_created_at ON packages_ultimate(created_at);
CREATE INDEX idx_packages_ultimate_deleted_at ON packages_ultimate(deleted_at);
CREATE INDEX idx_packages_ultimate_created_by ON packages_ultimate(created_by);

-- Composite Indexes for Common Queries
CREATE INDEX idx_packages_ultimate_status_created ON packages_ultimate(status, created_at);
CREATE INDEX idx_packages_ultimate_customer_status ON packages_ultimate(customer_id, status);
CREATE INDEX idx_packages_ultimate_rack_status ON packages_ultimate(rack_slot_id, status);
```

### 2. Enhanced Package Items Table

```sql
-- Ultimate Package Items Table
CREATE TABLE package_items_ultimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages_ultimate(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (unit_price >= 0),
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 CHECK (total_price >= 0),
    
    -- Item Categories
    category VARCHAR(100),
    sku VARCHAR(100),
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for Package Items
CREATE INDEX idx_package_items_ultimate_package_id ON package_items_ultimate(package_id);
CREATE INDEX idx_package_items_ultimate_name ON package_items_ultimate(name);
CREATE INDEX idx_package_items_ultimate_category ON package_items_ultimate(category);
CREATE INDEX idx_package_items_ultimate_deleted_at ON package_items_ultimate(deleted_at);
```

### 3. Enhanced Package Measurements Table

```sql
-- Ultimate Package Measurements Table
CREATE TABLE package_measurements_ultimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages_ultimate(id) ON DELETE CASCADE,
    piece_number INTEGER NOT NULL CHECK (piece_number > 0),
    
    -- Weight Information
    weight DECIMAL(10,3), -- In kg
    volumetric_weight DECIMAL(10,3), -- In kg
    
    -- Dimensions (in cm)
    length DECIMAL(8,2) CHECK (length > 0),
    width DECIMAL(8,2) CHECK (width > 0),
    height DECIMAL(8,2) CHECK (height > 0),
    
    -- Measurement Status
    has_measurements BOOLEAN DEFAULT FALSE,
    measurement_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    UNIQUE(package_id, piece_number),
    CONSTRAINT chk_has_measurements CHECK (
        (has_measurements = FALSE) OR 
        (has_measurements = TRUE AND length IS NOT NULL AND width IS NOT NULL AND height IS NOT NULL)
    )
);

-- Indexes for Package Measurements
CREATE INDEX idx_package_measurements_ultimate_package_id ON package_measurements_ultimate(package_id);
CREATE INDEX idx_package_measurements_ultimate_piece_number ON package_measurements_ultimate(piece_number);
CREATE INDEX idx_package_measurements_ultimate_has_measurements ON package_measurements_ultimate(has_measurements);
CREATE INDEX idx_package_measurements_ultimate_deleted_at ON package_measurements_ultimate(deleted_at);
```

### 4. Enhanced Package Documents Table

```sql
-- Ultimate Package Documents Table
CREATE TABLE package_documents_ultimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages_ultimate(id) ON DELETE CASCADE,
    
    -- Document Information
    document_name VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    document_url VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(100) NOT NULL,
    
    -- Document Categories
    category VARCHAR(100), -- 'invoice', 'receipt', 'photo', 'other'
    is_required BOOLEAN DEFAULT FALSE,
    
    -- File Processing
    thumbnail_url VARCHAR(500),
    file_hash VARCHAR(64), -- For duplicate detection
    
    -- Audit Fields
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_document_type CHECK (document_type IN ('image', 'pdf', 'document', 'spreadsheet', 'other')),
    CONSTRAINT chk_file_size CHECK (file_size <= 10485760) -- 10MB limit
);

-- Indexes for Package Documents
CREATE INDEX idx_package_documents_ultimate_package_id ON package_documents_ultimate(package_id);
CREATE INDEX idx_package_documents_ultimate_document_type ON package_documents_ultimate(document_type);
CREATE INDEX idx_package_documents_ultimate_category ON package_documents_ultimate(category);
CREATE INDEX idx_package_documents_ultimate_uploaded_at ON package_documents_ultimate(uploaded_at);
CREATE INDEX idx_package_documents_ultimate_deleted_at ON package_documents_ultimate(deleted_at);
CREATE INDEX idx_package_documents_ultimate_file_hash ON package_documents_ultimate(file_hash);
```

### 5. Enhanced Package Charges Table

```sql
-- Ultimate Package Charges Table
CREATE TABLE package_charges_ultimate (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages_ultimate(id) ON DELETE CASCADE,
    
    -- Charge Information
    summary VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Charge Categories
    charge_type VARCHAR(50) NOT NULL,
    is_taxable BOOLEAN DEFAULT TRUE,
    tax_rate DECIMAL(5,4) DEFAULT 0.0000, -- 4 decimal places for precision
    
    -- Charge Status
    status VARCHAR(50) DEFAULT 'PENDING',
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    paid_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Audit Fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_charge_type CHECK (charge_type IN ('storage', 'handling', 'customs', 'shipping', 'insurance', 'other')),
    CONSTRAINT chk_charge_status CHECK (status IN ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED'))
);

-- Indexes for Package Charges
CREATE INDEX idx_package_charges_ultimate_package_id ON package_charges_ultimate(package_id);
CREATE INDEX idx_package_charges_ultimate_charge_type ON package_charges_ultimate(charge_type);
CREATE INDEX idx_package_charges_ultimate_status ON package_charges_ultimate(status);
CREATE INDEX idx_package_charges_ultimate_due_date ON package_charges_ultimate(due_date);
CREATE INDEX idx_package_charges_ultimate_deleted_at ON package_charges_ultimate(deleted_at);
```

### 6. Action Logs Table (Invoice Upload)

```sql
-- Package Action Logs Table (Stores Uploaded Invoice Files)
CREATE TABLE package_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    package_id UUID NOT NULL REFERENCES packages_ultimate(id) ON DELETE CASCADE,
    
    -- Invoice File Information
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL, -- 'image' or 'pdf'
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Status
    is_completed BOOLEAN DEFAULT FALSE,
    
    -- Audit Fields
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT chk_file_type CHECK (file_type IN ('image', 'pdf'))
);

-- Indexes for Action Logs
CREATE INDEX idx_package_action_logs_package_id ON package_action_logs(package_id);
CREATE INDEX idx_package_action_logs_is_completed ON package_action_logs(is_completed);
CREATE INDEX idx_package_action_logs_file_type ON package_action_logs(file_type);
CREATE INDEX idx_package_action_logs_uploaded_at ON package_action_logs(uploaded_at);
CREATE INDEX idx_package_action_logs_deleted_at ON package_action_logs(deleted_at);
```

---

## Complete Package Workflow

### 1. Package Registration Flow:
1. **Admin Registers Package**:
   - Selects customer, rack slot, vendor/supplier
   - Enters reference/order number
   - Enters weight and volumetric weight (L×W×H in CM)
   - Can add multiple products with individual weights
   - System calculates total weight and total volumetric weight
   - Chooses to allow customer to add more products
   - Indicates if shop invoice received
   - Adds remarks/product details
   - **Status**: `Action Required`

### 2. Package Details Display:
- **Customer Details**: Name, suite, email, phone
- **Package Status**: Current status indicator
- **Package Details**: 
  - Tracking/Reference number
  - Weight and total volumetric weight
  - Dangerous goods indicator
  - Individual product weights and volumetric weights
- **Audit Trail**: Which admin created/updated with date, time, and name
- **Package Items**: Product name, quantity, amount per product, total
- **Action Log**: Upload invoices/PDFs and change status

### 3. Status Management:
1. **Package Registration** → Status: `Action Required`
2. **Admin Uploads Invoice/PDF** → Action Log: Stores file with `is_completed = FALSE`
3. **Admin Checks Action** → Action Log: `is_completed = TRUE` → Status: `In Review`
4. **Future Statuses**: `Ready to Send`, `Request Ship`, `Shipped`, `Discarded`, `Draft`

### Key Points:
- Action Logs store actual uploaded invoice files (images/PDFs)
- Each uploaded file gets its own record in action_logs table
- Admin uploads file → `is_completed = FALSE`
- Admin clicks action checkbox → `is_completed = TRUE`
- Status changes from `Action Required` to `In Review` when action is completed

---

## Database Triggers and Functions

### 1. Auto-calculate Item Totals

```sql
-- Function to calculate item total
CREATE OR REPLACE FUNCTION calculate_item_total_ultimate()
RETURNS TRIGGER AS $$
BEGIN
    NEW.total_price = NEW.quantity * NEW.unit_price;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for package items
CREATE TRIGGER trigger_calculate_item_total_ultimate
    BEFORE INSERT OR UPDATE ON package_items_ultimate
    FOR EACH ROW
    EXECUTE FUNCTION calculate_item_total_ultimate();
```

### 2. Auto-calculate Volumetric Weight

```sql
-- Function to calculate volumetric weight
CREATE OR REPLACE FUNCTION calculate_volumetric_weight_ultimate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.length IS NOT NULL AND NEW.width IS NOT NULL AND NEW.height IS NOT NULL THEN
        NEW.volumetric_weight = (NEW.length * NEW.width * NEW.height) / 5000; -- cm³ to kg
        NEW.has_measurements = TRUE;
    ELSE
        NEW.has_measurements = FALSE;
    END IF;
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for package measurements
CREATE TRIGGER trigger_calculate_volumetric_weight_ultimate
    BEFORE INSERT OR UPDATE ON package_measurements_ultimate
    FOR EACH ROW
    EXECUTE FUNCTION calculate_volumetric_weight_ultimate();
```

### 3. Update Package Totals

```sql
-- Function to update package totals
CREATE OR REPLACE FUNCTION update_package_totals_ultimate()
RETURNS TRIGGER AS $$
DECLARE
    total_weight DECIMAL(10,3);
    total_vol_weight DECIMAL(10,3);
BEGIN
    -- Calculate total weight from measurements
    SELECT COALESCE(SUM(weight), 0) INTO total_weight
    FROM package_measurements_ultimate
    WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
    AND deleted_at IS NULL;
    
    -- Calculate total volumetric weight from measurements
    SELECT COALESCE(SUM(volumetric_weight), 0) INTO total_vol_weight
    FROM package_measurements_ultimate
    WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
    AND deleted_at IS NULL;
    
    -- Update package totals
    UPDATE packages_ultimate
    SET 
        total_weight = total_weight,
        total_volumetric_weight = total_vol_weight,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.package_id, OLD.package_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for package measurements
CREATE TRIGGER trigger_update_package_totals_measurements_ultimate
    AFTER INSERT OR UPDATE OR DELETE ON package_measurements_ultimate
    FOR EACH ROW
    EXECUTE FUNCTION update_package_totals_ultimate();
```

---

## Migration Strategy

### Phase 1: Normal Package (Current)
- Implement basic package management
- Simple item and measurement tracking
- Basic document upload

### Phase 2: Ultimate Package (Enhanced)
- Migrate to normalized structure
- Add advanced features
- Implement comprehensive audit trail

### Migration Script Example

```sql
-- Example migration from normal to ultimate
INSERT INTO packages_ultimate (
    id, tracking_no, status,
    customer_id, vendor_id, rack_slot_id, slot_info,
    total_weight, total_volumetric_weight, dangerous_good,
    allow_customer_items, shop_invoice_received, remarks,
    created_by, created_at, updated_at
)
SELECT 
    p.id, p.tracking_no, p.status,
    u.id as customer_id, s.id as vendor_id, r.id as rack_slot_id, p.slot_info,
    CAST(REPLACE(p.weight, 'Kg', '') AS DECIMAL(10,3)) as total_weight,
    CASE 
        WHEN p.volumetric_weight = '-' THEN 0
        ELSE CAST(REPLACE(p.volumetric_weight, 'Kg', '') AS DECIMAL(10,3))
    END as total_volumetric_weight,
    p.dangerous_good = 'Yes' as dangerous_good,
    p.allow_customer_items, p.shop_invoice_received, p.remarks,
    p.created_by, p.created_at, p.updated_at
FROM packages p
LEFT JOIN users u ON u.email = p.customer_email
LEFT JOIN suppliers s ON s.supplier_name = p.vendor
LEFT JOIN racks r ON r.label = p.rack_slot
WHERE p.deleted_at IS NULL;
```

---

## Performance Optimization Recommendations

1. **Partitioning**: Consider partitioning large tables by date
2. **Archiving**: Archive old packages to separate tables
3. **Connection Pooling**: Use connection pooling for better performance
4. **Query Optimization**: Use EXPLAIN ANALYZE for query optimization
5. **Monitoring**: Implement database monitoring and alerting

---

## Security Considerations

1. **Row Level Security**: Implement RLS for multi-tenant scenarios
2. **Data Encryption**: Encrypt sensitive data at rest
3. **Audit Logging**: Comprehensive audit trail for all changes
4. **Access Control**: Role-based access control for different user types
5. **Backup Strategy**: Regular backups with point-in-time recovery

---

This schema provides a solid foundation for both current and future package management needs while maintaining optimal database performance and data integrity.
