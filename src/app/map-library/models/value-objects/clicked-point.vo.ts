/**
 * Represents data captured specifically during a map click event.
 * It extends basic geographic data with screen-space coordinates (pixels).
 */
export interface ClickedPointVO {
  /**
   * The geographic latitude where the click occurred.
   */
  latitude: number | null;
  /**
   * The geographic longitude where the click occurred.
   */
  longitude: number | null;
  /**
   * The calculated elevation at the clicked point.
   */
  altitude: number | null;
  /**
   * The horizontal screen coordinate (in pixels) relative to the top-left corner of the map view.
   */
  x: number;
  /**
   * The vertical screen coordinate (in pixels) relative to the top-left corner of the map view.
   */
  y: number;
}
