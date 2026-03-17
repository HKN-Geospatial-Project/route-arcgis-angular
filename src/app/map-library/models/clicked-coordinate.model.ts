/**
 * Represents data captured specifically during a map click event.
 * It extends basic geographic data with screen-space coordinates (pixels).
 */
export interface ClickedCoordinate {
  /**
   * The geographic latitude where the click occurred.
   */
  latitude: number | null | undefined;
  /**
   * The geographic longitude where the click occurred.
   */
  longitude: number | null | undefined;
  /**
   * The calculated elevation at the clicked point.
   */
  altitude: number | undefined;
  /**
   * The horizontal screen coordinate (in pixels) relative to the top-left corner of the map view.
   */
  x: number;
  /**
   * The vertical screen coordinate (in pixels) relative to the top-left corner of the map view.
   */
  y: number;
}
