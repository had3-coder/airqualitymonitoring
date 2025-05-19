# Temporary Setup Notice

This project is currently using Tailwind CSS via CDN due to installation issues.

## To restore local Tailwind processing:

1. Remove the CDN script tag from all HTML files:
   ```html
   <script src="https://cdn.tailwindcss.com"></script>
   ```

2. Uncomment the local CSS link:
   ```html
   <link href="/dist/output.css" rel="stylesheet">
   ```

3. Fix the local Tailwind installation:
   - Ensure proper PostCSS configuration
   - Verify build scripts in package.json
   - Test the build process with `npm run build:css`

## Known Issues:
- Local Tailwind CLI not found despite being installed
- Build process fails to generate output.css