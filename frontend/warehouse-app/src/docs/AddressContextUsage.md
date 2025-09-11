# Address Context Usage Guide

This guide explains how to use the global address context system for managing address data across your application.

## 🏗️ Architecture Overview

The address context system consists of three main layers:

1. **Context Layer** (`AddressContext.tsx`) - Global state management
2. **API Integration Layer** (`useAddressAPI.ts`) - Data fetching and transformation
3. **Form Integration Layer** (`useAddressForm.ts`) - Form helpers and API data preparation

## 🚀 Quick Start

### 1. Basic Usage

```tsx
import { useAddressForm } from '../hooks/useAddressForm';

const MyComponent = () => {
  const {
    selectedCountry,
    selectedAddress,
    currentCountryInfo,
    selectCountry,
    selectAddress,
  } = useAddressForm();

  return (
    <div>
      <p>Current Country: {selectedCountry}</p>
      <p>Selected Address: {selectedAddress?.name}</p>
    </div>
  );
};
```

### 2. Country Selection

```tsx
const { selectCountry, availableCountries } = useAddressForm();

// Change country
const handleCountryChange = (country: string) => {
  selectCountry(country);
};

// Available countries
availableCountries.forEach(country => {
  console.log(country.name, country.code, country.phone_code);
});
```

### 3. Address Management

```tsx
const {
  selectedAddress,
  savedAddresses,
  selectAddress,
  updateAddress,
  addAddress,
  removeAddress,
} = useAddressForm();

// Select an address
selectAddress(savedAddresses[0]);

// Update current address
const updatedAddress = {
  ...selectedAddress,
  name: 'New Company Name',
  address: 'New Address',
};
updateAddress(updatedAddress);

// Add new address
const newAddress = {
  id: 'unique-id',
  name: 'Company Name',
  address: '123 Main St',
  country_name: 'Singapore',
  country_code: 'SG',
  country_phone_code: '+65',
  phone_number: '+65-1234-5678',
};
addAddress(newAddress);

// Remove address
removeAddress('address-id');
```

## 📝 Form Integration

### Pickup Request Form

```tsx
const { getPickupRequestData } = useAddressForm();

const handleSubmit = async (formData: any) => {
  const pickupData = getPickupRequestData({
    user_id: 'user-123',
    pickup_address: formData.pickup_address,
    supplier_name: formData.supplier_name,
    supplier_phone_number: formData.supplier_phone_number,
    pcs_box: formData.pcs_box,
    pkg_details: formData.pkg_details,
  });

  // pickupData now includes:
  // - country_id: Mapped from selected country
  // - admin_id: From user context
  // - country_code, country_name, country_phone_code

  const response = await createPickupRequest(pickupData);
};
```

### Shopping Request Form

```tsx
const { getShoppingRequestData } = useAddressForm();

const handleSubmit = async (formData: any) => {
  const shoppingData = getShoppingRequestData({
    user_id: 'user-123',
    items: formData.items,
    total_amount: formData.total_amount,
  });

  // shoppingData now includes country_id and admin_id
  const response = await createShoppingRequest(shoppingData);
};
```

## 🔧 Advanced Usage

### Custom Country Mapping

```tsx
const { getCountryId } = useAddressForm();

// Get current country ID for API calls
const countryId = getCountryId();
console.log('Country ID:', countryId);
```

### Address Filtering

```tsx
const { addressesForCurrentCountry } = useAddressForm();

// Get addresses filtered by current country
const currentCountryAddresses = addressesForCurrentCountry;
```

### Form Data Preparation

```tsx
const { getFormData } = useAddressForm();

// Get all form data including country info
const formData = getFormData();
console.log(formData);
// {
//   country_id: 'country-id-1',
//   admin_id: 'admin-id-1',
//   country_code: 'SG',
//   country_name: 'Singapore',
//   country_phone_code: '+65'
// }
```

## 🎯 Real-World Examples

### Address Selection Component

```tsx
const AddressSelector = () => {
  const {
    selectedAddress,
    savedAddresses,
    selectAddress,
  } = useAddressForm();

  return (
    <div>
      <h3>Select Address</h3>
      <select
        value={selectedAddress?.id || ''}
        onChange={(e) => {
          const address = savedAddresses.find(addr => addr.id === e.target.value);
          selectAddress(address || null);
        }}
      >
        <option value="">Select an address</option>
        {savedAddresses.map(addr => (
          <option key={addr.id} value={addr.id}>
            {addr.name} - {addr.address}
          </option>
        ))}
      </select>
    </div>
  );
};
```

### Address Edit Form

```tsx
const AddressEditForm = () => {
  const { selectedAddress, updateAddress } = useAddressForm();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone_number: '',
  });

  useEffect(() => {
    if (selectedAddress) {
      setFormData({
        name: selectedAddress.name,
        address: selectedAddress.address,
        phone_number: selectedAddress.phone_number,
      });
    }
  }, [selectedAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddress) {
      updateAddress({
        ...selectedAddress,
        ...formData,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        placeholder="Company Name"
      />
      <input
        value={formData.address}
        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
        placeholder="Address"
      />
      <input
        value={formData.phone_number}
        onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
        placeholder="Phone Number"
      />
      <button type="submit">Update Address</button>
    </form>
  );
};
```

## 🔄 Data Flow

1. **App Initialization**
   - Context loads saved country from localStorage
   - API fetches addresses from backend
   - First address is auto-selected

2. **User Interaction**
   - User changes country → Global state updates
   - User selects address → Global state updates
   - All components reflect changes automatically

3. **Form Submission**
   - Form data includes current country/address info
   - API calls include proper country_id and admin_id
   - Backend receives complete data

## 🎨 UI Components

The system includes several UI components:

- **AddressSection**: Country selection with flags
- **HeaderAddressSection**: Address display in header
- **AddressDetailsModal**: Address details with copy functionality
- **SavedAddressesModal**: Address selection modal

## 🚨 Error Handling

```tsx
const { error, isLoading } = useAddressForm();

if (isLoading) return <div>Loading addresses...</div>;
if (error) return <div>Error: {error}</div>;
```

## 📱 Responsive Design

The context system works seamlessly with responsive design:

```tsx
const { selectedAddress } = useAddressForm();

return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    <div>
      <h3>Address</h3>
      <p>{selectedAddress?.name}</p>
      <p>{selectedAddress?.address}</p>
    </div>
  </div>
);
```

## 🔧 Configuration

### Country Mapping

Update the country ID mapping in `useAddressForm.ts`:

```tsx
const getCountryId = () => {
  const countryIdMap: { [key: string]: string } = {
    'India': 'your-india-id',
    'Singapore': 'your-singapore-id',
    'USA': 'your-usa-id',
    // Add more mappings
  };
  return countryIdMap[selectedCountry] || 'default-id';
};
```

### Admin ID

Update the admin ID logic in `useAddressForm.ts`:

```tsx
const getAdminId = () => {
  // Get from user context or auth
  return userContext?.adminId || 'default-admin-id';
};
```

## 🎯 Best Practices

1. **Always use the hooks**: Don't access context directly
2. **Handle loading states**: Check `isLoading` before rendering
3. **Error boundaries**: Wrap components in error boundaries
4. **Type safety**: Use TypeScript interfaces
5. **Performance**: Use selector hooks for specific data
6. **Testing**: Mock the context in tests

## 🧪 Testing

```tsx
// Mock the context in tests
jest.mock('../hooks/useAddressForm', () => ({
  useAddressForm: () => ({
    selectedCountry: 'Singapore',
    selectedAddress: mockAddress,
    selectCountry: jest.fn(),
    selectAddress: jest.fn(),
  }),
}));
```

This system provides a robust, type-safe, and performant way to manage address data across your entire application! 🎉
