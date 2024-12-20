#!/bin/bash

# Function to update imports in a file
update_file() {
  local file=$1
  echo "Updating $file..."
  sed -i 's|@/lib/|@/src/lib/|g' "$file"
}

# Update each file
while IFS= read -r file; do
  update_file "$file"
done << "FILES"
./app/admin/about-content/page.tsx
./app/admin/analytics/page.tsx
./app/admin/contacts/ContactCard.tsx
./app/admin/contacts/ContactDetails.tsx
./app/admin/contacts/page.tsx
./app/admin/layout.tsx
./app/admin/portfolio/components/SectionPreview.tsx
./app/admin/portfolio/components/SiteEditor.tsx
./app/api/admin/contacts/[contactId]/notes/route.ts
./app/api/admin/contacts/route.ts
./app/api/auth/[...nextauth]/route.ts
./app/contact/page.tsx
./app/portfolio/[slug]/page.tsx
./app/providers.tsx
./components/ChatWindow.tsx
./components/GradientCard.tsx
./components/Image.tsx
./components/LatestProjects.tsx
./components/YourComponent.tsx
./components/admin/DashboardNav.tsx
./components/admin/ExportButton.tsx
./components/admin/Sidebar.tsx
./components/icons/DreamtimeIcon.tsx
./components/portfolio/PortfolioContent.tsx
./components/sections/HeroSection.tsx
./components/services/ServicesContent.tsx
./components/ui/Badge.tsx
./components/ui/Button.tsx
./components/ui/Checkbox.tsx
./components/ui/Dialog.tsx
./components/ui/VirtualList.tsx
./components/ui/dialog.tsx
./components/ui/scroll-area.tsx
./src/lib/hooks/useContacts.ts
./src/lib/hooks/useFirebaseQuery.ts
./src/lib/hooks/useTheme.ts
FILES

echo "All files updated!"
