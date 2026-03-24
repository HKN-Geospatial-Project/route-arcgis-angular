#!/bin/bash
# .devcontainer/setup.sh

echo "Installing base packages..."
npm install -g npm@11.12.0

npm install @angular/animations@21.2.5
npm install ngx-toastr@20.0.5

echo "Installing ArcGIS packages..."

echo "- arcgis/core"
npm install @arcgis/core@5.0.13

# echo "- arcgis/map-components"
# npm install @arcgis/map-components@5.0.13

# echo "- arcgis/charts-components"
# npm @arcgis/charts-components@5.0.13

# echo "- esri/calcite-components"
# npm @esri/calcite-components@5.0.2

echo "Setup complete!"
