#!/bin/bash
# .devcontainer/setup.sh

echo "Installing base packages..."
npm install -g npm@11.10.1

echo "Installing ArcGIS packages to latest..."

echo "- arcgis/core"
npm install @arcgis/core@5.0.1 

# echo "- arcgis/map-components"
# npm install @arcgis/map-components@5.0.1 

# echo "- arcgis/charts-components"
# npm @arcgis/charts-components@5.0.1 

# echo "- esri/calcite-components"
# npm @esri/calcite-components@5.0.2

echo "Setup complete!"
