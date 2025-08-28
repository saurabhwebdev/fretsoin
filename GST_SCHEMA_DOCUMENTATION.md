# GST-Compliant Prisma Schema Documentation

## Overview
This Prisma schema is designed specifically for Indian businesses and complies with GST (Goods and Services Tax) requirements. It includes models for User management, Client information, Service/Product items, and Quote generation with proper GST calculations.

## 📋 Models Overview

### 1. User Model
**Purpose**: System user authentication and role management

**Key Fields**:
- `email` - Unique email for login
- `name` - Full name (required)
- `phone` - Contact number
- `role` - User role (ADMIN, MANAGER, USER)
- `isActive` - Account status

### 2. Client Model
**Purpose**: Customer information with GST compliance

**GST-Specific Fields**:
- `gstNumber` - 15-character GSTIN (unique)
- `panNumber` - PAN number
- `clientType` - Registration type (REGISTERED, UNREGISTERED, COMPOSITION, EXPORT, IMPORT)
- `state` - Required for SGST/CGST vs IGST determination

**Address Fields**:
- Complete address including state and pincode
- Default country set to "India"

### 3. ServiceItem Model
**Purpose**: Services and products catalog with GST rates

**GST-Specific Fields**:
- `hsnCode` - HSN (Harmonized System of Nomenclature) or SAC (Service Accounting Code)
- `gstRate` - GST rate percentage (e.g., 18.00 for 18%)
- `cessRate` - Additional cess rate if applicable
- `itemType` - SERVICE, PRODUCT, or MATERIAL

**Pricing**:
- `basePrice` - Base price before tax
- `unit` - Unit of measurement (unit, hour, kg, etc.)

### 4. Quote Model
**Purpose**: Generate GST-compliant quotations

**GST Calculations**:
- `subtotal` - Amount before tax
- `cgstAmount` - Central GST (for intra-state)
- `sgstAmount` - State GST (for intra-state)
- `igstAmount` - Integrated GST (for inter-state)
- `cessAmount` - Cess amount if applicable
- `totalTax` - Total of all taxes
- `totalAmount` - Final amount including all taxes

**Business Fields**:
- `quoteNumber` - Unique quote identifier (e.g., QT-2024-001)
- `validUntil` - Quote expiry date
- `status` - Quote status tracking
- `termsAndConditions` - Legal terms

### 5. QuoteItem Model
**Purpose**: Line items in quotes with individual tax calculations

**Key Fields**:
- `quantity` - Item quantity (supports decimals)
- `unitPrice` - Price per unit
- `discount` - Discount percentage
- `lineTotal` - Line total after discount, before tax
- `taxAmount` - Tax amount for this line item

## 🏛️ GST Compliance Features

### 1. Client Type Management
```typescript
enum ClientType {
  REGISTERED      // Has valid GSTIN - eligible for input tax credit
  UNREGISTERED    // No GSTIN - simplified billing
  COMPOSITION     // Composition scheme dealer
  EXPORT          // Export transactions - zero-rated/exempted
  IMPORT          // Import transactions
}
```

### 2. Tax Calculation Logic
- **Intra-State**: CGST + SGST (same state transactions)
- **Inter-State**: IGST (different state transactions)
- **Cess**: Additional tax on specific items (luxury, tobacco, etc.)

### 3. HSN/SAC Code Support
- HSN codes for goods
- SAC codes for services
- Required for GST return filing

### 4. Business Registration Types
Supports all Indian business registration types:
- Regular GST registration
- Composition scheme
- Unregistered businesses
- Export/Import businesses

## 💼 Usage Examples

### Creating a Client
```typescript
const client = await prisma.client.create({
  data: {
    name: "ABC Pvt Ltd",
    email: "contact@abc.com",
    addressLine1: "123 Business Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    gstNumber: "27ABCDE1234F1Z5", // Valid GSTIN format
    panNumber: "ABCDE1234F",
    clientType: "REGISTERED"
  }
})
```

### Creating a Service Item
```typescript
const service = await prisma.serviceItem.create({
  data: {
    name: "Web Development Service",
    itemType: "SERVICE",
    basePrice: 50000.00,
    unit: "project",
    hsnCode: "998314", // SAC for IT services
    gstRate: 18.00 // 18% GST
  }
})
```

### Generating a Quote
```typescript
const quote = await prisma.quote.create({
  data: {
    quoteNumber: "QT-2024-001",
    clientId: client.id,
    userId: user.id,
    subtotal: 50000.00,
    cgstAmount: 4500.00, // 9% CGST
    sgstAmount: 4500.00, // 9% SGST
    totalTax: 9000.00,
    totalAmount: 59000.00,
    status: "DRAFT"
  }
})
```

## 🔧 Next Steps

1. **Database Migration**: Run the migration to create tables
   ```bash
   npx prisma migrate dev --name add-gst-models
   ```

2. **Seed Data**: Create initial data for testing
   ```bash
   npx prisma db seed
   ```

3. **Generate Types**: Update TypeScript types
   ```bash
   npx prisma generate
   ```

## 📊 GST Rate Reference (Common Rates)

| Item Type | GST Rate | Examples |
|-----------|----------|----------|
| Essential Services | 0% | Healthcare, Education |
| Basic Services | 5% | Transport, Small restaurants |
| Standard Services | 12% | Business class air travel |
| Premium Services | 18% | IT services, Telecom |
| Luxury Items | 28% | Automobiles, High-end goods |

## ⚖️ Compliance Notes

1. **GSTIN Format**: 15 characters (State Code + PAN + Entity Code + Check Digit)
2. **HSN/SAC Codes**: Mandatory for businesses with turnover > ₹5 crores
3. **Tax Calculation**: Always calculate to 2 decimal places
4. **State Codes**: Use official GST state codes for proper tax calculation
5. **Return Filing**: Schema supports data required for GSTR filings

Your GST-compliant schema is now ready for Indian business operations! 🇮🇳