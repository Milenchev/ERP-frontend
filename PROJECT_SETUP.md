# ERP Frontend - Project Setup Documentation

## Overview
This document outlines the complete setup and architecture of the ERP frontend application built with React, TypeScript, Vite, and custom SCSS styling.

---

## Technology Stack

### Core Framework
- **React 19.2.0** - UI library for building component-based interfaces
- **TypeScript 5.9.3** - Type-safe JavaScript superset
- **Vite 7.2.4** - Fast build tool and development server

### Styling & UI
- **SASS/SCSS** - CSS preprocessor for maintainable stylesheets
- **Custom Component Library** - Hand-crafted UI components (Button, Card, Badge)
- **Lucide React** - Icon library for modern UI icons
- **BEM Methodology** - Block Element Modifier naming convention for CSS classes

### Routing & State
- **React Router DOM 7.13.0** - Client-side routing
- **React Hooks** - Built-in state management (useState, useEffect)

### Utilities
- **Custom Badge Utilities** - Helper functions for status badges and styling

---

## Project Structure

```
erp-frontend/
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx         # Button component with variants
│   │   │   └── card.tsx           # Card components (Card, CardHeader, CardTitle, etc.)
│   │   └── layout/                # Layout components
│   │       ├── MainLayout.tsx     # Main app layout wrapper
│   │       ├── Sidebar.tsx        # Navigation sidebar with menu items
│   │       └── Header.tsx         # Top header with search and user actions
│   ├── pages/
│   │   ├── Dashboard.tsx          # Dashboard page with API integration
│   │   ├── Documents.tsx          # Documents page with outgoing invoices
│   │   ├── Expenses.tsx           # Expenses page with incoming invoices
│   │   ├── AddInvoice.tsx         # Add outgoing invoice page with form and calculations
│   │   ├── AddIncomingInvoice.tsx # Add incoming invoice page with form and file upload
│   │   ├── ViewInvoice.tsx        # View/print invoice page (standalone, no sidebar)
│   │   ├── AutoInvoices.tsx       # Automatic invoices listing page
│   │   ├── AutoInvoiceAdd.tsx     # Add automatic invoice page with products
│   │   ├── Offers.tsx             # Offers listing page
│   │   ├── AddOffer.tsx           # Add offer page with tabbed form
│   │   ├── ClientsPage.tsx        # Clients listing page
│   │   ├── AddClients.tsx         # Add client page with full details
│   │   ├── StoreHouseParts.tsx    # Warehouse/storage management page
│   │   ├── AddStoreHouseParts.tsx # Add storage item page
│   │   ├── Orders.tsx             # Orders listing page
│   │   ├── AddOrder.tsx           # Add order page with product selection
│   │   ├── Repairs.tsx            # Repairs listing page
│   │   ├── AddRepairs.tsx         # Add repair page with serial numbers
│   │   ├── Employees.tsx          # Employees listing page
│   │   ├── AddEmployees.tsx       # Add employee page
│   │   └── Settings.tsx           # Application settings page
│   ├── lib/
│   │   └── badge-utils.ts         # Badge utility functions
│   ├── styles/                    # SCSS styling system
│   │   ├── _variables.scss        # Design tokens (colors, spacing, typography)
│   │   ├── _mixins.scss           # Reusable SCSS mixins
│   │   ├── _reset.scss            # CSS reset and base styles
│   │   ├── main.scss              # Main SCSS entry point
│   │   ├── components/            # Component-specific styles
│   │   │   ├── _button.scss       # Button component styles
│   │   │   ├── _card.scss         # Card component styles
│   │   │   ├── _sidebar.scss      # Sidebar component styles
│   │   │   ├── _header.scss       # Header component styles
│   │   │   └── _badge.scss        # Badge component styles
│   │   └── pages/                 # Page-specific styles
│   │       ├── _dashboard.scss    # Dashboard page styles
│   │       ├── _documents.scss    # Documents page styles (shared across list pages)
│   │       ├── _add-invoice.scss  # Add invoice page styles (shared across form pages)
│   │       ├── _view-invoice.scss # View/print invoice page styles
│   │       ├── _storehouse.scss   # Storehouse modal styles
│   │       └── _settings.scss     # Settings page styles
│   ├── App.tsx                    # Main app component with routing
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles with Tailwind v4 and CSS variables
├── public/                        # Static assets
├── tsconfig.json                  # TypeScript configuration
├── tsconfig.app.json              # TypeScript app-specific config with path aliases
├── vite.config.ts                 # Vite configuration with path resolution
└── package.json                   # Project dependencies and scripts
```

---

## Step-by-Step Setup Process

### 1. Initial Project Setup
- Created Vite project with React + TypeScript template
- Initialized with `npm create vite@latest` using react-ts template

### 2. Installed Core Dependencies
```bash
# SASS for styling
npm install -D sass

# React Router for navigation
npm install react-router-dom

# Icons
npm install lucide-react
```

### 3. Set Up Custom SCSS Architecture

**Created SCSS folder structure:**
- `src/styles/` - Main styling directory
- `_variables.scss` - Design system tokens
- `_mixins.scss` - Reusable SCSS patterns
- `_reset.scss` - CSS normalization
- `components/` - Component-specific styles
- `pages/` - Page-specific styles

**Design System Variables (`_variables.scss`):**
- Color palette with HSL values
- Spacing scale (xs to 2xl)
- Typography scale (font sizes, weights, line heights)
- Border radius values
- Shadow definitions
- Transition timings
- Responsive breakpoints
- Z-index layers

**SCSS Mixins (`_mixins.scss`):**
- Flexbox utilities (flex-center, flex-between, etc.)
- Button base styles
- Card base styles
- Input base styles
- Responsive breakpoint helpers
- Custom scrollbar styles
- Badge base styles

**Updated `src/main.tsx`:**
- Imports `src/styles/main.scss` instead of TailwindCSS
- Defined CSS custom properties in `:root` for light theme
- Defined CSS custom properties in `.dark` for dark theme
- Set global styles for border colors and body

### 4. Configured TypeScript Path Aliases

**Updated `vite.config.ts`:**
- Added path resolution for `@` alias pointing to `./src`
- Imported Node.js `path` module for path resolution

**Updated `tsconfig.app.json`:**
- Set `baseUrl` to `.`
- Configured `paths` mapping `@/*` to `./src/*`
- Enables clean imports like `@/components/ui/card`

### 5. Created shadcn/ui Configuration

**Created `components.json`:**
- Set style to "default"
- Configured for non-RSC (client-side React)
- Prevents class conflicts and duplicates

### 6. Built Custom UI Components

**Button Component (`src/components/ui/button.tsx`):**
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Uses BEM naming: `button`, `button--default`, `button--sm`
- Hover and active states with opacity and scale transforms
- Shadows for depth
- Smooth transitions (200ms)
- Full TypeScript support with React.forwardRef

**Card Components (`src/components/ui/card.tsx`):**
- Card - Main container with border and shadow
- CardHeader - Header section with spacing
- CardTitle - Large, semibold title
- CardDescription - Muted description text
- CardContent - Content area with padding
- CardFooter - Footer with top border
- Uses BEM naming: `card`, `card__header`, `card__title`, etc.
- All components use React.forwardRef
- Fully typed with TypeScript

### 7. Built Layout System

**MainLayout Component (`src/components/layout/MainLayout.tsx`):**
- Wraps entire application
- Uses flexbox for sidebar + main content layout
- Renders Sidebar component
- Renders Header component
- Uses `<Outlet />` from React Router for nested routes
- Implements overflow handling for scrollable content

**Sidebar Component (`src/components/layout/Sidebar.tsx`):**
- Fixed width navigation sidebar (w-64)
- Displays "ERP System" branding
- Defines menu items array with:
  - Icon from lucide-react
  - Label text
  - Path for routing
- Uses `useLocation()` hook to detect active route
- Highlights active menu item with primary color
- Uses React Router `<Link>` for navigation
- Implements hover states for better UX

**Header Component (`src/components/layout/Header.tsx`):**
- Top navigation bar with search and user actions
- Search input with icon
- Notification bell button
- User profile button
- Uses shadcn/ui Button component
- Responsive layout with flexbox

### 9. Created Dashboard Page

**Dashboard Component (`src/pages/Dashboard.tsx`):**
- Fetches data from backend API (`http://localhost:5001/getDashboardInvoices`)
- Uses TypeScript interfaces for type safety:
  - `Invoice` interface for invoice data structure
  - `DashboardData` interface for API response
- Implements React hooks:
  - `useState` for managing invoices, loading, and error states
  - `useEffect` for API data fetching on component mount
- Calculates business metrics:
  - Total incoming invoice value
  - Total outgoing invoice value
  - Total debt to us (unpaid outgoing invoices)
  - Total debt to suppliers (unpaid incoming invoices)
- Displays 4 metric cards with icons
- Shows two tables:
  - Last 10 incoming invoices (from suppliers)
  - Last 10 outgoing invoices (to clients)
- Implements status badges:
  - Yellow badge: "ЧАКА ПЛАЩАНЕ" (Waiting for payment)
  - Green badge: "ПЛАТЕНА" (Paid)
  - Red badge: "ПРОПУСНАТО ПЛАЩАНЕ" (Missed payment)
- Handles loading and error states gracefully
- Uses Bulgarian language labels

### 10. Created Documents Page

**Documents Component (`src/pages/Documents.tsx`):**
- Fetches data from backend API (`http://localhost:5001/outgoingInvoices`)
- Uses TypeScript interfaces for type safety:
  - `OutgoingInvoice` interface for invoice data structure
  - `ApiResponse` interface for API response
- Implements React hooks:
  - `useState` for managing invoices, loading, error, and search states
  - `useEffect` for API data fetching on component mount
  - `useLocation` for tracking current route
- Features implemented:
  - **Sub-navigation tabs** - 5 document type tabs (ПРОДАЖБИ, РАЗХОДИ, АВТОМАТИЧНИ ТАКСУВАНИЯ, ОФЕРТИ, ТОВАРИТЕЛНИЦИ)
  - **Left sidebar filter** - Document type filtering (Всички, Фактури, Проформа фактури)
  - **Search functionality** - Real-time client name filtering
  - **Delete operation** - Confirmation dialog + API call to delete invoices
  - **Full data table** with 8 columns:
    - Index number
    - Date (Дата на издаване)
    - Type (Фактура/Проформа фактура)
    - Client name
    - Invoice value
    - Payment type (Банков път/В брой/Пощенски паричен)
    - Status badges (color-coded)
    - Action buttons (Edit, Print, Delete)
- Displays status badges:
  - Yellow badge: "ЧАКА ПЛАЩАНЕ" (Waiting for payment)
  - Green badge: "ПЛАТЕНА" (Paid)
  - Red badge: "ПРОПУСНАТО ПЛАЩАНЕ" (Missed payment)
- Shows invoice type and payment type with proper mapping
- Includes footer with totals (invoice count and sum)
- Action buttons:
  - Edit button (icon)
  - Print/View button (links to `/view-invoice?invoice_id=...`)
  - Delete button with confirmation
- Header actions:
  - "Справка" button
  - "Добавяне на фактура" button (links to `/add-invoice`)
  - Search input with icon
- Handles loading and error states gracefully
- Uses Bulgarian language labels throughout

### 11. Designed Custom Theme and Color Palette

**SCSS Variables (`src/styles/_variables.scss`):**
- **Primary Color**: Vibrant purple (`hsl(262, 83%, 58%)`)
- **Background**: Soft off-white (`hsl(240, 10%, 98%)`)
- **Accent**: Light blue (`hsl(204, 100%, 97%)`)
- **Secondary**: Bright sky blue (`hsl(204, 94%, 94%)`)
- **Status Colors**: Yellow (waiting), Green (paid), Red (missed)
- **Border Radius**: `0.75rem` for modern, soft corners
- **Shadows**: Multiple levels (sm, md, lg, xl)
- **Typography**: System font stack with fallbacks
- **Spacing Scale**: 0.25rem to 3rem
- **Transitions**: Fast (150ms), Base (200ms), Slow (300ms)

**Component Styling Approach:**
- **BEM Methodology**: Block__Element--Modifier naming
- **SCSS Nesting**: Organized, maintainable structure
- **Design Tokens**: Centralized variables for consistency
- **Hover States**: Opacity changes and background tints
- **Active States**: Scale transforms for tactile feedback
- **Transitions**: Smooth 200ms animations on all interactive elements
- **Shadows**: Added depth to cards and active states
- **Responsive**: Mobile-first with breakpoint mixins

### 12. Created Add Invoice Page

**AddInvoice Component (`src/pages/AddInvoice.tsx`):**
- Full invoice creation form with dynamic fields
- Fetches client list from API (`http://localhost:5001/clients`)
- Auto-generates invoice number based on document type
- Features implemented:
  - **Client Selection** - Dropdown with all clients from database
  - **МОЛ Field** - Auto-populated from selected client
  - **Document Type** - Фактура (0) or Проформа фактура (1)
  - **Invoice Number** - Auto-generated, fetches last number + 1
  - **Payment Method** - Банков превод, В брой, Пощенски паричен
  - **Dynamic Product Table** - Automatically adds new row when typing in last row
  - **Product Fields** - Name, Unit, Quantity, Price, Discount (%)
  - **Real-time Calculations** - Subtotal, VAT 20%, Total with VAT
  - **Action Buttons** - Добавяне (Save), Добавяне и печат (Save & Print), Назад (Back)
- Uses TypeScript interfaces for type safety:
  - `Product` interface for product line items
  - `Client` interface for client data
- Implements React hooks:
  - `useState` for form state management
  - `useEffect` for API calls and invoice number generation
- POST request to save invoice with all data
- Navigation back to Documents page after save
- Disabled fields for auto-generated data (invoice number, date)

**SCSS Styling (`src/styles/pages/_add-invoice.scss`):**
- Card-based layout with shadow and rounded corners
- Purple header with invoice number display
- Responsive grid layout for form fields
- Styled table with input fields in cells
- Highlighted totals rows (subtotal, VAT, final total)
- Footer with action buttons
- Focus states with purple accent
- Proper spacing and alignment throughout

### 13. Created Expenses Page

**Expenses Component (`src/pages/Expenses.tsx`):**
- Displays incoming invoices (expenses) from suppliers
- Fetches data from API (`http://localhost:5001/incomingInvoices`)
- Shares navigation tabs with Documents page
- Features implemented:
  - **Horizontal Navigation Tabs** - Same tabs as Documents page
  - **No Left Sidebar** - Full-width content area
  - **Invoice Table** - Displays incoming invoices with columns:
    - Номер (Number)
    - Дата на фактурата (Invoice Date)
    - Доставчик (Supplier)
    - Стойност (Value)
    - Дата на изтичане (Expiration Date)
    - Статус (Status with badges)
    - Действия (Actions: Edit, Print, Package, Delete)
  - **Search Functionality** - Filter by supplier name
  - **Delete Operation** - Remove invoices with confirmation
  - **Add Invoice Button** - Links to `/add-incoming-invoice`
  - **Footer Totals** - Total invoice count and sum
- Uses same SCSS styling as Documents page
- Reuses badge utility functions for status display

### 14. Created Add Incoming Invoice Page

**AddIncomingInvoice Component (`src/pages/AddIncomingInvoice.tsx`):**
- Form for creating incoming invoices (expenses) from suppliers
- Fetches and submits data to API (`http://localhost:5001/addIncomingInvoice`)
- Features implemented:
  - **Basic Information Section:**
    - Supplier name input
    - Invoice number field
    - Invoice date (dd.mm.yyyy format)
    - Comment/notes field
  - **Payment Details Section:**
    - Payment term (fixed at 15 days)
    - Payment method selector (Банков превод, В брой, Пощенски паричен)
    - Total amount with VAT input
    - Currency selector (Лв., $, Евро)
  - **Documentation Section:**
    - PDF file upload with base64 encoding
    - File name display after selection
  - **Auto-calculated Expiration Date:**
    - Parses invoice date in dd.mm.yyyy format
    - Automatically adds 15 days to calculate expiration date
    - Sends formatted expiration date to API
  - **Action Buttons:**
    - Добавяне (Save) - POST request to backend
    - Назад (Back) - Returns to Expenses page
- Uses same SCSS styling as AddInvoice page
- Handles file upload with FileReader API for base64 conversion
- Proper date parsing to avoid NaN errors

### 15. Set Up Routing

**Updated `src/App.tsx`:**
- Wrapped app in `<BrowserRouter>`
- Created route structure with `<Routes>` and `<Route>`
- Set MainLayout as parent route for all pages with sidebar
- ViewInvoice route placed outside MainLayout (no sidebar for print)
- **All Routes:**
  - `/` - Dashboard (index route)
  - `/documents` - Outgoing invoices (Documents)
  - `/expenses` - Incoming invoices (Expenses)
  - `/add-invoice` - Add outgoing invoice
  - `/add-incoming-invoice` - Add incoming invoice
  - `/view-invoice` - View/print invoice (outside MainLayout)
  - `/auto-invoice` - Automatic invoices listing
  - `/auto-invoice-add` - Add automatic invoice
  - `/offers` - Offers listing
  - `/add-offer` - Add offer
  - `/clients` - Clients listing
  - `/add-clients` - Add client
  - `/storeHouseParts` - Warehouse/storage management
  - `/add-items` - Add storage item
  - `/orders` - Orders listing
  - `/add-order` - Add order
  - `/repairs` - Repairs listing
  - `/add-repair` - Add repair
  - `/employees` - Employees listing
  - `/add-employee` - Add employee
  - `/settings` - Application settings

**Updated `src/main.tsx`:**
- Imports and renders App component
- Imports global CSS styles
- Uses React 19's createRoot API

---

## Configuration Files

### `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### `src/styles/main.scss`
```scss
// Base styles
@use 'reset';
@use 'variables';
@use 'mixins';

// Components
@use 'components/button';
@use 'components/card';
@use 'components/sidebar';
@use 'components/header';
@use 'components/badge';

// Pages
@use 'pages/dashboard';
@use 'pages/documents';
@use 'pages/add-invoice';
@use 'pages/view-invoice';
@use 'pages/storehouse';
@use 'pages/settings';

// Layout
.main-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
  // ...
}
```

---

## Key Features Implemented

### 1. Type Safety
- Full TypeScript implementation
- Interface definitions for all data structures
- Type-safe component props
- Path alias support in TypeScript

### 2. Modern Styling
- Custom SCSS architecture with BEM methodology
- Design system with centralized variables
- Reusable mixins for common patterns
- Consistent design tokens across all components
- Responsive layouts with breakpoint helpers
- Smooth transitions and hover effects

### 3. Component Architecture
- Reusable UI components
- Layout components for consistent structure
- Separation of concerns (UI, layout, pages)
- Component composition pattern

### 4. Routing System
- Client-side routing with React Router v7
- Nested route support
- Active route highlighting
- Type-safe navigation

### 5. API Integration
- Async data fetching with fetch API
- Loading and error state handling
- TypeScript interfaces for API responses
- RESTful API integration

### 6. Developer Experience
- Fast HMR with Vite
- Path aliases for clean imports
- ESLint configuration
- TypeScript strict mode

---

## Running the Application

### Development Server
```bash
npm run dev
```
Starts Vite development server on `http://localhost:5173`

### Build for Production
```bash
npm run build
```
Compiles TypeScript and builds optimized production bundle

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally

### Lint Code
```bash
npm run lint
```
Runs ESLint on the codebase

---

## Current Pages

### 1. Dashboard (`/`)
- Overview of business metrics
- Incoming and outgoing invoices tables
- Total values and debts display
- 4 metric cards (incoming total, outgoing total, debts to us, debts to suppliers)

### 2. Documents (`/documents`)
- Horizontal navigation tabs for document types (ПРОДАЖБИ, РАЗХОДИ, АВТОМАТИЧНИ ТАКСУВАНИЯ, ОФЕРТИ, ТОВАРИТЕЛНИЦИ)
- Outgoing invoices table with search and actions
- Delete functionality with confirmation
- Print button links to ViewInvoice page
- Add invoice button links to `/add-invoice`

### 3. Expenses (`/expenses`)
- Horizontal navigation tabs (shared with Documents)
- Incoming invoices from suppliers
- Full-width table without left sidebar
- Search by supplier name
- Delete functionality with confirmation
- Add invoice button links to `/add-incoming-invoice`

### 4. Add Invoice (`/add-invoice`)
- Complete outgoing invoice creation form
- Client selection from API with auto-populated МОЛ
- Dynamic product table with auto-add rows
- Real-time calculations (Subtotal, ДДС 20%, Общо с ДДС)
- Save and print options

### 5. Add Incoming Invoice (`/add-incoming-invoice`)
- Incoming invoice (expense) creation form
- Supplier information input
- Payment details with auto-calculated expiration date (+15 days)
- PDF file upload with base64 encoding
- Currency selection (BGN, USD, EUR)

### 6. View Invoice (`/view-invoice`)
- Standalone page (no sidebar) for printing invoices
- Accessed via printer icon on Documents page with `?invoice_id=` parameter
- Fetches invoice and product data from API
- Modern, minimal print layout optimized to fit on one page
- Auto-triggers browser print dialog after data loads
- Navigates back to `/documents` after print dialog closes via `afterprint` event

### 7. Automatic Invoices (`/auto-invoice`)
- Horizontal navigation tabs (shared with Documents)
- Lists automatic/recurring invoices from API (`/automaticInvoices`)
- Table columns: Номер, Дата в месеца, Клиент, Стойност, Тип на плащане, Брой неплатени, Действия
- Payment types: В брой (0), По банка (1)
- Search by client name, delete with confirmation
- Add button links to `/auto-invoice-add`

### 8. Add Automatic Invoice (`/auto-invoice-add`)
- Form for creating recurring invoices
- Client selection from API (`/clients`) with auto-populated МОЛ
- Monthly automation date selector (1-ви, 2-ри, 3-ри, 10-ти, 15-ти)
- Payment term (5/10/15 days) and payment method selectors
- Dynamic product table with auto-add rows
- Subtotal, ДДС 20%, Общо с ДДС calculations
- POST to `/addAutomaticInvoicesProduct`

### 9. Offers (`/offers`)
- Horizontal navigation tabs (shared with Documents)
- Lists offers from API (`/offers`)
- Table columns: #, Дата, Заглавие, Клиент, Стойност, Тип, Статус, Действия
- Offer types: Фактура (0), Проформа фактура (1)
- Status badges (ЧАКА ПЛАЩАНЕ, ПЛАТЕНА, ПРОПУСНАТО ПЛАЩАНЕ)
- Search by client name, delete with confirmation
- Add button links to `/add-offer`

### 10. Add Offer (`/add-offer`)
- Tabbed form with "Основна информация" and "Артикули" views
- Basic info: Client name, МОЛ, Offer type (Проект/Обект), Date, Heading
- Products tab: Dynamic product table with calculations
- Subtotal, ДДС 20%, Общо с ДДС
- POST to `/addOffers`

### 11. Clients (`/clients`)
- Standalone page (no document tabs) accessible from sidebar
- Lists clients from API (`/clients`)
- Table columns: #, Клиент, МОЛ, Тип, ЕИК/ЕГН, Действия
- Client types: Частно лице (0), Фирма (1)
- Search by firm name, delete with confirmation
- Add button links to `/add-clients`

### 12. Add Client (`/add-clients`)
- Form with three sections:
  - **Основна информация**: Client type, firm name, МОЛ, ЕИК/ЕГН, ДДС number
  - **Местоположение**: Address, City, Country
  - **Допълнителна информация**: Email, Phone
- POST to `/addClients`

### 13. Warehouse / Storage (`/storeHouseParts`)
- Navigation tabs: ДОСТАВЧИЦИ, СКЛАДОВЕ, ПРОИЗВОДСТВО
- Left sidebar with storage list (clickable to switch storage)
  - "Неразпределени" option for unassigned items
  - Delete storage button on each item
  - "Добави Склад" link at bottom
- Main table columns: #, Арт. номер, Име на компонент, Наличност, Складов тип, Тип, Позиция, Действия
- Storage types: Реален (0), Виртуален (1)
- Item types: Производство (0), Части (1)
- Move item modal: Click Edit to move item to another storage via API
- API calls: `/storage`, `/storageItems`, `/deleteStorageItems`, `/deleteStorage`, `/updateStorageItemStorage`
- Add button links to `/add-items`

### 14. Add Storage Item (`/add-items`)
- Form with three sections:
  - **Тип на складов артикул**: Storage type (Складов/Реален), Quantity
  - **Основна информация**: Item name, Item number, Item type (Производство/Части), Position
  - **Складова информация**: Storage dropdown (fetches from `/storage`)
- POST to `/addItems`

### 15. Orders (`/orders`)
- Navigation tabs: ПОРЪЧКИ, РЕМОНТИ
- Lists orders from API (`/orders`)
- Table columns: #, Клиент, Подадена на, Изпратен на, Изх. товарителница, Стойност, Статус, Действия
- Status badges: ЧАКА ИЗПРАЩАНЕ (0), ИЗПРАТЕНА (1), НЕИЗПРАТЕНА (2)
- Search by client name, delete with confirmation
- Footer with total count and price sum
- Add button links to `/add-order`

### 16. Add Order (`/add-order`)
- Client name input and date picker
- Product selection dropdown (fetches all storage items from `/getAllStorageItems`)
- Dynamic product table with auto-add rows
- Subtotal, ДДС 20%, Общо с ДДС calculations
- POST to `/addOrder`

### 17. Repairs (`/repairs`)
- Navigation tabs (shared with Orders): ПОРЪЧКИ, РЕМОНТИ
- Lists repairs from API (`/repairs`)
- Table columns: #, Клиент, Приет на, Вх. товарителница, Изпратен на, Изх. товарителница, Артикули, Статус, Действия
- Status badges (ЧАКА ПЛАЩАНЕ, ПЛАТЕНА, ПРОПУСНАТО ПЛАЩАНЕ)
- Search by client name, delete with confirmation
- Add button links to `/add-repair`

### 18. Add Repair (`/add-repair`)
- Client name, arrival date, incoming shipment number inputs
- Dynamic serial number table with auto-add rows
- Delete button for rows (except first)
- POST to `/addRepair`

### 19. Employees (`/employees`)
- Standalone page accessible from sidebar
- Lists employees from API (`/employees`)
- Table columns: #, Име, Заплата, Осигуровки, Данък, Допълнение, Общо
- Total calculated as: salary + insurance - tax + additionalPay
- Search by employee name
- Footer with employee count and total sum
- Add button links to `/add-employee`

### 20. Add Employee (`/add-employee`)
- Form with two sections:
  - **Основна информация**: Name, Salary, Insurance
  - **Допълнителна информация**: Tax, Additional pay
- POST to `/addEmployee`

### 21. Settings (`/settings`)
- Application settings page with 4 card sections:
  - **Фирмена информация**: Company name, ЕИК, ДДС, Address, City, Country
  - **Лице за контакт**: МОЛ, Phone, Email
  - **Банкови данни**: Bank name, IBAN, BIC
  - **Предпочитания**: Default currency (BGN/EUR/USD), Language (BG/EN)
- Saves to localStorage
- Custom SCSS styling with card-based layout

## Sidebar Navigation

The main sidebar contains the following menu items:
1. **Табло** (`/`) - Dashboard with LayoutDashboard icon
2. **Документи** (`/documents`) - Documents with FileText icon
3. **Клиенти** (`/clients`) - Clients with Users icon
4. **Складове** (`/storeHouseParts`) - Warehouse with Warehouse icon
5. **Поръчки** (`/orders`) - Orders with ShoppingCart icon
6. **Служители** (`/employees`) - Employees with UserCog icon
7. **Настройки** (`/settings`) - Settings with Settings icon

## SCSS Architecture & Style Sharing

Pages share SCSS styles to maintain consistency:
- **`_documents.scss`** - Used by: Documents, Expenses, AutoInvoices, Offers, ClientsPage, StoreHouseParts, Orders, Repairs, Employees (all list/table pages)
- **`_add-invoice.scss`** - Used by: AddInvoice, AddIncomingInvoice, AutoInvoiceAdd, AddOffer, AddClients, AddOrder, AddRepairs, AddEmployees, AddStoreHouseParts (all form pages)
- **`_view-invoice.scss`** - Used by: ViewInvoice (print-optimized layout)
- **`_storehouse.scss`** - Used by: StoreHouseParts (modal styles)
- **`_settings.scss`** - Used by: Settings (card-based settings layout)

---

## Design Decisions

### Why Custom SCSS Instead of TailwindCSS?
- **Full Control**: Complete ownership of styling without framework constraints
- **Maintainability**: Easier to understand and modify for team members
- **Performance**: No unused CSS classes, smaller bundle size
- **Scalability**: Better suited for large applications with complex styling needs
- **Learning Curve**: Standard CSS/SCSS is more universally understood
- **No Build Dependencies**: Removed dependency on Tailwind ecosystem
- **BEM Methodology**: Clear, semantic class names that are self-documenting

### Why BEM (Block Element Modifier)?
- Clear component structure and hierarchy
- Avoids CSS specificity issues
- Self-documenting class names
- Easy to understand component relationships
- Scales well for large projects

### Why React Router v7?
- Industry standard for React routing
- Type-safe navigation
- Nested routes support
- Active development and support

### Why Vite?
- Extremely fast HMR
- Native ESM support
- Optimized production builds
- Better DX than webpack

---

## API Integration Details

### Dashboard Endpoint
- **URL**: `http://localhost:5001/getDashboardInvoices`
- **Method**: GET
- **Response Format**: JSON

**Expected Response Structure:**
```typescript
{
  incoming: [
    {
      date: string,
      supplier: string,
      invoiceValue: number,
      invoiceState: number,  // 0: waiting, 1: paid, 2: missed
      State: number          // Alternative field name
    }
  ],
  outgoing: [
    {
      date: string,
      client: string,
      invoiceValue: number,
      invoiceState: number
    }
  ]
}
```

### Documents Endpoint
- **URL**: `http://localhost:5001/outgoingInvoices`
- **Method**: GET
- **Response Format**: JSON

**Expected Response Structure:**
```typescript
{
  outgoingInvoices: [
    {
      uid: string,
      date: string,
      type: number,           // 0: Фактура, 1: Проформа фактура
      client: string,
      invoiceValue: number,
      typeOfPayment: number,  // 0: Банков път, 1: В брой, 2: Пощенски паричен
      invoiceState: number    // 0: waiting, 1: paid, 2: missed
    }
  ]
}
```

### Delete Outgoing Invoice Endpoint
- **URL**: `http://localhost:5001/deleteOutgoingInvoices?id={uid}`
- **Method**: DELETE
- **Response Format**: JSON
- **Description**: Deletes an outgoing invoice by UID

### Incoming Invoices Endpoint
- **URL**: `http://localhost:5001/incomingInvoices`
- **Method**: GET
- **Response Format**: JSON

**Expected Response Structure:**
```typescript
{
  incomingInvoices: [
    {
      uid: string,
      date: string,
      supplier: string,
      invoiceValue: number,
      expDate: string,
      State: number  // 0: waiting, 1: paid, 2: missed
    }
  ]
}
```

### Delete Incoming Invoice Endpoint
- **URL**: `http://localhost:5001/deleteIncomingInvoices?id={uid}`
- **Method**: DELETE
- **Response Format**: JSON
- **Description**: Deletes an incoming invoice by UID

### Clients Endpoint
- **URL**: `http://localhost:5001/clients`
- **Method**: GET
- **Response Format**: JSON

**Expected Response Structure:**
```typescript
{
  clients: [
    {
      uid: number,
      clientName: string,
      mol: string  // МОЛ (responsible person)
    }
  ]
}
```

### Get Last Invoice Number Endpoint
- **URL**: `http://localhost:5001/getLastInvoiceNum?invoice_type={type}`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns the last invoice number for the specified type

**Expected Response Structure:**
```typescript
{
  invoice_num: string | "none"  // Returns "none" if no invoices exist
}
```

### Add Outgoing Invoice Endpoint
- **URL**: `http://localhost:5001/addOutgoingInvoice`
- **Method**: POST
- **Request Body**:
```typescript
{
  invoice: {
    invoiceNum: string,
    client: string,
    clientId: number,
    ownerName: string,
    type: string,  // "0" or "1"
    date: string,
    typeOfPayment: string,  // "0", "1", or "2"
    total_value: string,
    products: [
      {
        id: number,
        name: string,
        unit: string,
        quantity: number,
        price: number,
        discount: number
      }
    ]
  }
}
```
- **Response Format**: JSON
- **Description**: Creates a new outgoing invoice with products

### Add Incoming Invoice Endpoint
- **URL**: `http://localhost:5001/addIncomingInvoice`
- **Method**: POST
- **Request Body**:
```typescript
{
  invoice: {
    supplierName: string,
    expDate: string,        // Auto-calculated: invoice date + 15 days
    fax: string,            // Invoice number
    date: string,           // Invoice date in dd.mm.yyyy format
    typeOfPayment: string,  // "0", "1", or "2"
    total_value: string,    // Total amount with VAT
    base_64_file: string,   // PDF file encoded in base64
    comment: string,        // Optional comment/notes
    currency: string        // "BGN", "USD", or "EUR"
  }
}
```
- **Response Format**: JSON
- **Description**: Creates a new incoming invoice (expense) with PDF attachment

### View Invoice - Product Details Endpoint
- **URL**: `http://localhost:5001/getProductbyInvoice_id?invoice_id={id}`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns products associated with an invoice

### Automatic Invoices Endpoint
- **URL**: `http://localhost:5001/automaticInvoices`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns all automatic/recurring invoices

### Delete Automatic Invoice Endpoint
- **URL**: `http://localhost:5001/deleteAutoInvoice?id={uid}`
- **Method**: DELETE
- **Description**: Deletes an automatic invoice by UID

### Add Automatic Invoice Endpoint
- **URL**: `http://localhost:5001/addAutomaticInvoicesProduct`
- **Method**: POST
- **Request Body**:
```typescript
{
  automaticInvoice: {
    client: string,
    clientId: number,
    dateOfMonth: string,
    price: number,
    typeOfPayment: string,
    unpaid: number,
    products: [{ id: number, productName: string, unit: string, quantity: number, price: number }]
  }
}
```

### Offers Endpoint
- **URL**: `http://localhost:5001/offers`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns all offers

### Delete Offer Endpoint
- **URL**: `http://localhost:5001/deleteOffers?id={uid}`
- **Method**: DELETE
- **Description**: Deletes an offer by UID

### Add Offer Endpoint
- **URL**: `http://localhost:5001/addOffers`
- **Method**: POST
- **Request Body**:
```typescript
{
  offer: {
    clientName: string,
    mol: string,
    typeOfOffer: string,
    dateOfOffer: string,
    heading: string,
    price: number,
    state: number,
    products: [{ offerId: number, productName: string, unit: string, quantity: number, price: number }]
  }
}
```

### Delete Client Endpoint
- **URL**: `http://localhost:5001/deleteClients?id={uid}`
- **Method**: DELETE
- **Description**: Deletes a client by UID

### Add Client Endpoint
- **URL**: `http://localhost:5001/addClients`
- **Method**: POST
- **Request Body**:
```typescript
{
  clients: {
    firmName: string,
    clientName: string,
    mol: string,
    eik: string,
    dds: string,
    address: string,
    city: string,
    country: string,
    email: string,
    phone: string,
    clientType: string
  }
}
```

### Storage Endpoints
- **GET** `http://localhost:5001/storage` - Returns all storages
- **GET** `http://localhost:5001/storageItems?storage_id={id}` - Returns items for a storage
- **GET** `http://localhost:5001/getAllStorageItems` - Returns all storage items
- **GET** `http://localhost:5001/updateStorageItemStorage?storage_id={id}&item_id={id}` - Moves item to another storage
- **DELETE** `http://localhost:5001/deleteStorageItems?id={uid}` - Deletes a storage item
- **DELETE** `http://localhost:5001/deleteStorage?id={uid}` - Deletes a storage

### Add Storage Item Endpoint
- **URL**: `http://localhost:5001/addItems`
- **Method**: POST
- **Request Body**:
```typescript
{
  storageItems: {
    itemNum: string,
    itemName: string,
    Availability: string,
    storageType: string,
    type: string,
    position: string,
    storage_id: string
  }
}
```

### Orders Endpoint
- **URL**: `http://localhost:5001/orders`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns all orders

### Delete Order Endpoint
- **URL**: `http://localhost:5001/deleteOrder?id={uid}`
- **Method**: DELETE
- **Description**: Deletes an order by UID

### Add Order Endpoint
- **URL**: `http://localhost:5001/addOrder`
- **Method**: POST
- **Request Body**:
```typescript
{
  orders: {
    client: string,
    dateApplied: string,
    orderItems: [{ id: number, productName: string, unit: string, quantity: number, price: number }]
  }
}
```

### Repairs Endpoint
- **URL**: `http://localhost:5001/repairs`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns all repairs

### Delete Repair Endpoint
- **URL**: `http://localhost:5001/deleteRepair?id={uid}`
- **Method**: DELETE
- **Description**: Deletes a repair by UID

### Add Repair Endpoint
- **URL**: `http://localhost:5001/addRepair`
- **Method**: POST
- **Request Body**:
```typescript
{
  repairs: {
    client: string,
    arrivalDate: string,
    shipmentNum: string,
    sentDate: string,
    outgoingShipmentNum: string,
    Articles: number,
    state: number,
    serialNum: string,
    repairArticles: [{ id: number, serialNum: string }]
  }
}
```

### Employees Endpoint
- **URL**: `http://localhost:5001/employees`
- **Method**: GET
- **Response Format**: JSON
- **Description**: Returns all employees

### Add Employee Endpoint
- **URL**: `http://localhost:5001/addEmployee`
- **Method**: POST
- **Request Body**:
```typescript
{
  employees: {
    name: string,
    salary: string,
    insurance: string,
    tax: string,
    additionalPay: string
  }
}
```

---

## Styling System

### SCSS Variables Architecture

**Color Tokens** (All use HSL format):
```scss
$color-primary: hsl(262, 83%, 58%);           // Vibrant purple
$color-primary-hover: hsl(262, 83%, 48%);     // Darker on hover
$color-secondary: hsl(204, 94%, 94%);         // Sky blue
$color-accent: hsl(204, 100%, 97%);           // Light blue
$color-background: hsl(240, 10%, 98%);        // Off-white
$color-foreground: hsl(240, 10%, 10%);        // Dark text
$color-destructive: hsl(0, 84%, 60%);         // Red
$color-border: hsl(240, 6%, 90%);             // Light gray
```

**Spacing Scale**:
```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
```

**Typography**:
```scss
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
```

### BEM Class Naming Examples
```scss
// Button component
.button { }                    // Block
.button--default { }           // Modifier (variant)
.button--sm { }                // Modifier (size)

// Card component
.card { }                      // Block
.card__header { }              // Element
.card__title { }               // Element

// Dashboard page
.dashboard { }                 // Block
.dashboard__header { }         // Element
.dashboard__metric-card { }    // Element
```

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- `md:` - 768px and up
- `lg:` - 1024px and up
- Grid system for flexible layouts

---

## Performance Considerations

1. **Code Splitting** - React Router enables route-based code splitting
2. **Tree Shaking** - Vite automatically removes unused code
3. **CSS Purging** - Tailwind removes unused styles in production
4. **Fast Refresh** - Vite HMR preserves component state
5. **Optimized Icons** - Lucide React uses tree-shakeable SVGs

---

## Migration History

### TailwindCSS to Custom SCSS (January 24, 2026)

**Reason for Migration:**
- Better maintainability and control over styling
- Reduced dependency on external frameworks
- Improved performance with smaller CSS bundle
- Easier onboarding for developers familiar with standard CSS
- More semantic, self-documenting class names

**Migration Steps:**
1. Installed SASS as dev dependency
2. Created SCSS folder structure with variables, mixins, and component styles
3. Converted all components from Tailwind classes to BEM-style SCSS classes
4. Created badge utility functions to replace inline Tailwind classes
5. Removed TailwindCSS, PostCSS, and utility dependencies
6. Deleted configuration files (tailwind.config.js, postcss.config.js, components.json)
7. Updated documentation to reflect new styling approach

**Benefits Achieved:**
- Reduced bundle size by removing unused Tailwind classes
- Clearer component structure with BEM naming
- Centralized design system in SCSS variables
- Easier to customize and extend styling
- Better IDE support for SCSS

---

*Documentation created: January 24, 2026*
*Last updated: February 24, 2026 - Added all application pages (21 total), complete API documentation, sidebar navigation, and SCSS architecture notes*
