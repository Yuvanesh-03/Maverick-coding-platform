# Mavericks Coding Platform - Setup & Troubleshooting Guide

## Fixed Issues ✅

### 1. Theme Initialization Error
**Error**: `theme-init.js:1 Uncaught TypeError: Cannot read properties of null (reading 'classList')`

**Fix**: Updated `utils/theme-init.js` with proper DOM ready checks and error handling.

### 2. PDF Report Generation Error
**Error**: `reportGenerator.ts:43 Uncaught TypeError: t.autoTable is not a function`

**Fix**: 
- Updated `utils/reportGenerator.ts` with proper autoTable imports and error handling
- Created enhanced report generator in `utils/enhancedReportGenerator.ts` with better styling and customization

### 3. Firebase Permissions Error
**Error**: `HackathonsPage.tsx:81 Failed to load hackathons page data: FirebaseError: Missing or insufficient permissions`

**Fix**: 
- Created proper Firestore security rules in `firestore.rules`
- Added error handling to hackathon service calls
- Improved data fetching with fallbacks

## New Features 🚀

### Enhanced PDF Reports
- **Basic Reports**: Original jsPDF with autoTable functionality
- **Enhanced Reports**: New custom report generator with:
  - Professional styling with color schemes
  - Better layout and typography
  - Stat boxes and improved tables
  - Personalized recommendations
  - Activity analysis and insights

### Improved Error Handling
- All PDF generation functions now have try-catch blocks
- Firebase operations have proper fallback states
- Theme initialization is resilient to DOM timing issues

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Make sure you have the following environment files:
- `.env` - Main environment variables
- `.env.local` - Local development overrides

### 3. Firebase Setup
1. Update `firestore.rules` with the security rules (already fixed)
2. Deploy the rules to your Firebase project:
```bash
firebase deploy --only firestore:rules
```

### 4. Build and Run
```bash
# Development
npm run start

# Production build
npm run build
```

## Key Files Modified

### Core Fixes
- `utils/theme-init.js` - DOM safety checks
- `utils/reportGenerator.ts` - Fixed autoTable integration
- `firestore.rules` - Proper security rules
- `components/pages/HackathonsPage.tsx` - Better error handling

### New Features
- `utils/enhancedReportGenerator.ts` - Professional PDF reports
- Updated `components/AdminUserProfileView.tsx` - Enhanced report button
- Updated `components/pages/ReportsPage.tsx` - Enhanced admin reports

## Troubleshooting

### PDF Generation Issues
If you still encounter PDF issues:
1. Clear browser cache and reload
2. Check console for specific error messages
3. Try using "Basic Report" first, then "Enhanced Report"

### Firebase Permission Issues
If you get permission errors:
1. Ensure you're logged in as an authenticated user
2. Check that your user document has the correct role field
3. Verify Firebase security rules are deployed

### Theme Issues
If dark/light mode doesn't work:
1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Check browser developer tools for console errors

## Development Tips

### PDF Report Customization
The enhanced report generator (`utils/enhancedReportGenerator.ts`) uses a class-based approach:
- Modify colors in the `colors` object
- Add new sections by creating new methods
- Customize layout by adjusting margins and spacing

### Adding New Report Types
1. Create new methods in `EnhancedReportGenerator` class
2. Export convenience functions at the bottom of the file
3. Import and use in your components

### Firebase Security Rules
The rules support:
- User-specific data access
- Admin role-based access
- Public read access for appropriate collections
- Proper hackathon registration permissions

## Browser Compatibility

Tested and working on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

## Performance Notes

- PDF generation is done client-side and may take a few seconds for large reports
- Enhanced reports include more styling and take slightly longer to generate
- Firebase queries are optimized with proper indexing

## Support

If you encounter issues not covered here:
1. Check the browser console for detailed error messages
2. Verify your Firebase configuration
3. Ensure all dependencies are properly installed
4. Try clearing browser cache and localStorage
